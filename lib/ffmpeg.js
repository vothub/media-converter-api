const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinLib = require('./ffbinLib').getPaths();

const ffmpegWrapper = {
  convert: function convert(data, callback) {
    const ffmpeg = fluentFfmpeg(data.pathIn)
      .setFfmpegPath(ffbinLib.ffmpeg)
      .setFfprobePath(ffbinLib.ffprobe)
      .output(data.pathOut)
      .on('end', function() {
        console.log('Finished processing, ' + data.pathOut);
        callback();
      }).run();

    return callback(ffmpeg);
  }
};

module.exports = ffmpegWrapper;
