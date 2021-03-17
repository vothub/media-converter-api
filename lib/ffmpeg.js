const fluentFfmpeg = require('fluent-ffmpeg');
const ffbinariesPaths = require('./ffbinaries').getPaths();

const ffmpegWrapper = {
  convert: function convert(job, callback) {
    const jobId = job.job_id;
    // will require fetching from an URL
    const pathIn = job.url;
    console.log('path in:', pathIn);

    fluentFfmpeg(pathIn)
      .setFfmpegPath(ffbinariesPaths.ffmpeg)
      .setFfprobePath(ffbinariesPaths.ffprobe)
      .output(pathIn + '.mp4')
      .on('end', () => {
        callback({ id: jobId, state: 'completed' });
      })
      .on('progress', (progress) => {
        callback({ id: jobId, state: 'progress', progress: progress.percent });
      })
      .run();

    return callback({ id: jobId, state: 'started' });
  }
};

module.exports = ffmpegWrapper;
