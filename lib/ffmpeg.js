const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinariesPaths = require('./ffbinaries').getPaths();

const ffmpegWrapper = {
  convert: function convert(data, callback) {
    fluentFfmpeg(data.pathIn)
      .setFfmpegPath(ffbinariesPaths.ffmpeg)
      .setFfprobePath(ffbinariesPaths.ffprobe)
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
