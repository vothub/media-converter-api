const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinLib = require('./ffbinLib').getPaths();

const ffmpegWrapper = {
  convert: function convert(data, callback) {
    fluentFfmpeg(data.pathIn)
      .setFfmpegPath(ffbinLib.ffmpeg)
      .setFfprobePath(ffbinLib.ffprobe)
      .output(data.pathOut)
      .on('end', () => {
        callback({ id: data.id, state: 'completed' });
      })
      .on('progress', (progress) => {
        callback({ id: data.id, state: 'progress', progress: progress.percent });
      })
      .run();

    return callback({ id: data.id, state: 'started' });
  }
};

module.exports = ffmpegWrapper;
