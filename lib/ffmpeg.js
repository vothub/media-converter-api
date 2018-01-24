const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinLib = require('./ffbinLib').getPaths();

const ffmpegWrapper = {
  convert: function convert(path, opts, callback) {
    // TODO better handling of filenames, don't assume mp4
    const filename = path.substr(path.lastIndexOf('/') + 1);
    const destLocation = os.tmpdir() + '/' + filename + '.mp4';
    const ffmpeg = fluentFfmpeg(path)
      .setFfmpegPath(ffbinLib.ffmpeg)
      .setFfprobePath(ffbinLib.ffprobe)
      .output(destLocation)
      .on('end', function() {
        console.log('Finished processing');
      }).run();

    return callback(ffmpeg);
  }
};
// const ffmpegWrapper = {
//   generateInstance: function generateInstance(path) {
//     const ffmpeg = fluentFfmpeg(path);
//     ffmpeg.setFfmpegPath(ffbinLib.ffmpeg);
//     ffmpeg.setFfprobePath(ffbinLib.ffprobe);
//     return ffmpeg;
//   },
//
//   convert: function convert(path, opts, callback) {
//     opts = opts || {};
//     let ffmpegCommand = this.generateInstance(path);;
//
//     if (opts.codec) {
//       ffmpegCommand.videoCodec(opts.codec);
//     }
//
//     ffmpegCommand.output(destLocation);
//
//     ffmpegCommand.on('end', function() {
//       console.log('Finished processing');
//     });
//
//     ffmpegCommand.run();
//
//     return callback(ffmpegCommand);
//   }
// };

module.exports = ffmpegWrapper;
