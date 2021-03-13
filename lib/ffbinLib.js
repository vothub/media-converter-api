const fs = require('fs');
const path = require('path');
const ffbinaries = require('ffbinaries');
const fmt = require('./fmt');

const ffbinPath = path.resolve('./bin');

/**
 * Returns an object with paths, local to the project
 *
 * @param {function} callback (err)
 */
function getPaths() {
  const platform = ffbinaries.detectPlatform();
  const paths = {
    root: ffbinPath,
    ffmpeg: `${ffbinPath}/${ffbinaries.getBinaryFilename('ffmpeg', platform)}`,
    ffprobe: `${ffbinPath}/${ffbinaries.getBinaryFilename('ffprobe', platform)}`
  };
  return paths;
}

/**
 * Ensures required binaries are downloaded.
 *
 * @param {function} callback (err, data)
 */
function ensureBinaries(callback) {
  const paths = getPaths();
  const downloadQueue = [];

  if (!fs.existsSync(paths.ffmpeg)) {
    downloadQueue.push('ffmpeg');
  }

  if (!fs.existsSync(paths.ffprobe)) {
    downloadQueue.push('ffprobe');
  }

  if (!downloadQueue.length) {
    return callback();
  }
  console.log(`[${fmt.date()} ${fmt.time()}] Downloading binaries for ${downloadQueue.join(' and ')}.`);
  return ffbinaries.downloadFiles(downloadQueue, { destination: paths.root }, callback);
}

module.exports = {
  getPaths,
  ensureBinaries,
};
