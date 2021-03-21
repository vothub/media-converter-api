const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinariesPaths = require('../ffbinaries').getPaths();

/*
taskData = {
  jobId,
  sourceFile,
  dir,
  preset,
}
*/

/**
 * FFmpeg conversion routine
 */
function processFfmpegTask(taskData, callback) {
  console.log('taskData:', taskData);
  const jobId = taskData.jobId;
  // will require fetching from an URL
  const sourceFile = taskData.sourceFile;
  const dir = taskData.dir;
  const ext = taskData.preset.split(':')[0];
  console.log('sourceFile:', sourceFile);
  console.log('dir:', dir);
  console.log('ext:', ext);

  // async here to process each requested output
  fluentFfmpeg(sourceFile)
    .setFfmpegPath(ffbinariesPaths.ffmpeg)
    .setFfprobePath(ffbinariesPaths.ffprobe)
    .output(`${dir}/output.${ext}`)
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
