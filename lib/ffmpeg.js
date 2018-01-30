const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinLib = require('./ffbinLib').getPaths();

const ffmpegWrapper = {
  convert: function convert(data, callback) {
    const ffmpeg = fluentFfmpeg(data.pathIn)
      .setFfmpegPath(ffbinLib.ffmpeg)
      .setFfprobePath(ffbinLib.ffprobe)
      .output(data.pathOut)
      .on('end', function() {
        callback({id: data.id, state: 'completed'});
      })
      .on('progress', function(progress) {
        callback({id: data.id, state: 'progress', progress: progress.percent});
      })
      .run();

    return callback({id: data.id, state: 'started'});
  }
};

module.exports = ffmpegWrapper;
