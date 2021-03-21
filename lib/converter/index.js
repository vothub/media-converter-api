const JobModel = require('../../models/job');
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
function start(id, callback) {
  console.log(`Starting job #${id}`);
  if (typeof callback !== 'function') {
    console.log('Callback function not provided - the worker thread will not be released after job completes!');
  }

  return JobModel.getJobById(id, (job) => {
    if (job.error || !job.data || !job.data.job_id) {
      console.log(job);
      console.log(`Job #${id} could not be located.`);
      return;
    }

    // retrieve file and store in jobTempDir

    // parse job.requested_outputs here!
    console.log(job);
    const opts = {
      // codec: 'libx264'
    };

    job.opts = opts;

    const taskData = {
      // sourceFile,
      // outputFile,
      // dir,
      // preset,
    };

    processFfmpegTask(taskData, (statusPing) => {
      if (statusPing.state === 'started') {
        console.log(`Transcoding started (job #${statusPing.id}).`);
      }

      if (statusPing.state === 'progress') {
        console.log(`Job #${statusPing.id} progress: ${Math.floor(statusPing.progress * 100) / 100}%.`);
      }

      if (statusPing.state === 'completed') {
        console.log(`Done converting (job #${statusPing.id}).`);
        console.log(`File saved to ${job.pathOut}`);
        statusPing.progress = 100;
        // this callback is what releases the worker thread to pick up new jobs
        callback();
      }

      if (statusPing.progress > 100) {
        statusPing.progress = 100;
      }

      // jobs[id] = _.merge(job, updateData);
      // updateJob(id, updateData);
    });
  });
}

module.exports = {
  start,
};
