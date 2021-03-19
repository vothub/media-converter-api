const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinariesPaths = require('./ffbinaries').getPaths();

/**
 * File conversion routines
 * Currently just ffmpeg, needs other tools for image / text doc manipulation
 * Also needs to actually check what the requested outputs are
 */
function start(job, callback) {
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

module.exports = {
  start,
};
