const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinariesPaths = require('./ffbinaries').getPaths();
const jobLib = require('./job');
/**
 * File conversion routines
 * Currently just ffmpeg, needs other tools for image / text doc manipulation
 * Also needs to actually check what the requested outputs are
 */
function processJobFfmpeg(job, callback) {
  const jobId = job.job_id;
  // will require fetching from an URL
  const pathIn = job.url;
  console.log('path in:', pathIn);

  // async here to process each requested output
  fluentFfmpeg(pathIn)
    .setFfmpegPath(ffbinariesPaths.ffmpeg)
    .setFfprobePath(ffbinariesPaths.ffprobe)
    .output(`${pathIn}.mp4`)
    .on('end', () => {
      callback({ id: jobId, state: 'completed' });
    })
    .on('progress', (progress) => {
      callback({ id: jobId, state: 'progress', progress: progress.percent });
    })
    .run();

  return callback({ id: jobId, state: 'started' });
}

/**
 * Start processing of the job (to be used by worker threads only!)
 * Fetches the job data from the DB, fetches the data for local processing,
 * triggers FFmpeg conversion,
 */
function start(id, callback) {
  console.log(`Starting job #${id}`);
  if (typeof callback !== 'function') {
    console.log('Callback function not provided - the worker thread will not be released after job completes!');
  }

  return jobLib.getJobById(id, (job) => {
    if (job.error || !job.data || !job.data.job_id) {
      console.log(job);
      console.log(`Job #${id} could not be located.`);
      return;
    }

    // parse job.requested_outputs here!
    console.log(job);
    const opts = {
      // codec: 'libx264'
    };

    job.opts = opts;

    processJobFfmpeg(job, (updateData) => {
      if (updateData.state === 'started') {
        console.log(`Transcoding started (job #${updateData.id}).`);
      }

      if (updateData.state === 'progress') {
        console.log(`Job #${updateData.id} progress: ${Math.floor(updateData.progress * 100) / 100}%.`);
      }

      if (updateData.state === 'completed') {
        console.log(`Done converting (job #${updateData.id}).`);
        console.log(`File saved to ${job.pathOut}`);
        updateData.progress = 100;
        // this callback is what releases the worker thread to pick up new jobs
        callback();
      }

      if (updateData.progress > 100) {
        updateData.progress = 100;
      }

      // jobs[id] = _.merge(job, updateData);
      // updateJob(id, updateData);
    });
  });
}

module.exports = {
  start,
};
