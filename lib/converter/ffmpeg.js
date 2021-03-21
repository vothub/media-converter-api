const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinariesPaths = require('../ffbinaries').getPaths();

/*
taskData = {
  sourceFile,
  outputFile,
  dir,
  preset,
}
*/

/**
 * FFmpeg conversion routine
 */
function processFfmpegTask(job, callback) {
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
  processFfmpegTask,
};
