const _ = require('lodash');
const { spawn } = require('child_process');
const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinariesPaths = require('../ffbinaries').getPaths();

const FFMPEG_PRESETS = require('../../models/presets');

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
  // console.log('taskData:', taskData);
  const jobId = taskData.jobId;
  // will require fetching from an URL
  const sourceFile = taskData.sourceFile;
  const dir = taskData.dir;
  const preset = FFMPEG_PRESETS[taskData.preset];
  if (!preset || !preset.ext) {
    return callback({ id: jobId, state: 'error-001' });
  }

  const ext = preset.ext;
  const task = preset.task;

  // lookup preset and get extension from there (or just split on hyphen but that's a bodge)
  console.log('sourceFile:', sourceFile);
  console.log('dir:', dir);
  console.log('ext:', ext);

  const taskSubstituted = task
    .replace('$VHMC_INPUT', sourceFile)
    .replace('$VHMC_OUTPUT_BASE', `${dir}/output`);

  console.log(`Executing task: "${taskSubstituted}"`);

  const execArgs = taskSubstituted.split(' ');
  const execBin = execArgs.shift().replace('ffmpeg', ffbinariesPaths.ffmpeg);

  const child = spawn(execBin, execArgs);

  // child.stdout.on('data', (data) => {
  //   console.log('stdout:', data.toString())
  // });

  child.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.log(`process exited with code ${code}`);
      return callback({ id: jobId, state: `failed-${code}` });
    }
    return callback({ id: jobId, state: 'completed' });
  });

  // // async here to process each requested output
  // fluentFfmpeg(sourceFile)
  //   .setFfmpegPath(ffbinariesPaths.ffmpeg)
  //   .setFfprobePath(ffbinariesPaths.ffprobe)
  //   .output(`${dir}/output.${ext}`)
  //   .on('end', () => {
  //     callback({ id: jobId, state: 'completed' });
  //   })
  //   .on('progress', (progress) => {
  //     callback({ id: jobId, state: 'progress', progress: progress.percent });
  //   })
  //   .run();

  return callback({ id: jobId, state: 'started' });
}

module.exports = {
  processFfmpegTask,
};
