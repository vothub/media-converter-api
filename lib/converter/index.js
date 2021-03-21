const os = require('os');
const JobModel = require('../../models/job');
const helpers = require('../helpers');
const { processFfmpegTask } = require('./ffmpeg');

if (process.env.VHMC_PROCESS_TYPE !== 'worker') {
  throw new Error('ConverterLib can only be used by a worker thread.');
}

/**
 * This library should only be used by worker processes.
 *
 * Start processing of the job (to be used by worker threads only!)
 * Fetches the job data from the DB, fetches the data for local processing,
 * triggers FFmpeg conversion.
 */
function start(jobId, callback) {
  console.log(`Starting job #${jobId}`);
  if (typeof callback !== 'function') {
    console.log('Callback function not provided - the worker thread will not be released after job completes!');
  }

  return JobModel.getJobById(jobId, (jobData) => {
    if (jobData.error || !jobData.data || !jobData.data.job_id) {
      console.log(`Job #${jobId} could not be located.`);
      console.log(jobData);
      return;
    }

    helpers.moveInputFileToJobTmpDir(jobId, jobData.data.input_url, (err, inputFilePath) => {
      // retrieve file and store in jobTempDir
      const outputDir = helpers.getDirname(inputFilePath) || `${os.tmpdir()}/vhmc/${jobId}`;
      const ext = helpers.getExtension(jobData.data.input_url);

      // parse job.preset here!
      console.log('jobData', jobData);
      console.log('ext', ext);
      // job.opts = opts;

      const taskData = {
        // sourceFile: jobData.data.input_url,
        sourceFile: inputFilePath || `${outputDir}/input${ext}`,
        jobId,
        dir: outputDir,
        preset: jobData.data.preset,
      };
      console.log('taskData', taskData);

      processFfmpegTask(taskData, (statusPing) => {
        if (statusPing.state === 'started') {
          console.log(`Transcoding started (job #${statusPing.id}).`);
          JobModel.updateJob(jobId, { status: 'started', time_started: new Date() }, (updateRes) => {});
        }

        if (statusPing.state === 'progress') {
          console.log(`Job #${statusPing.id} progress: ${Math.floor(statusPing.progress * 100) / 100}%.`);
        }

        if (statusPing.state === 'completed') {
          console.log(`Done converting (job #${statusPing.id}).`);
          console.log(`File saved to ${outputDir}`);
          statusPing.progress = 100;

          JobModel.updateJob(jobId, { status: 'success', time_finished: new Date() }, (updateRes) => {
            console.log('updateRes', updateRes)
            // this callback is what releases the worker thread to pick up new jobs
            callback();
          });
        }

        if (statusPing.progress > 100) {
          statusPing.progress = 100;
        }

        // jobs[id] = _.merge(job, updateData);
        // updateJob(id, updateData);
      });
    });
  });
}

module.exports = {
  start,
};
