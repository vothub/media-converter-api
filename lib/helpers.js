const path = require('path');
const fs = require('fs');
const os = require('os');
const axios = require('axios');

const MIMETYPES = {
  mp4: 'video/mp4',
};

/**
 * (private) Used by helpers to insert a leading zero
 * in front of months, days, hours, minutes and seconds
 * to produce a two digit string ("09:41:07" instead of "9:41:7")
 *
 * @param inputNumber Number One-digit or two-digit number
 * @return String The same number with added leading zero if required
 */
function leadZero(inputNumber) {
  const num = inputNumber.toString();
  return num.length < 2 ? `0${num}` : num;
}

/**
 * Formats the date-time string consistently
 * (registered as a handlebars helper)
 *
 * @param inputDate Date
 * @return String yyyy-mm-dd hh:mm:ss
 */
function formatDateTimeString(inputDate) {
  inputDate = inputDate || Date.now();
  const d = new Date(inputDate);
  const dateString = `${d.getFullYear()}-${leadZero(d.getMonth() + 1)}-${leadZero(d.getDate())}`;
  const timeString = `${leadZero(d.getHours())}:${leadZero(d.getMinutes())}:${leadZero(d.getSeconds())}`;
  return `${dateString} ${timeString}`;
}

/**
 * Formats the date into a unix timestamp
 *
 * @param inputDate Date
 * @return Number
 */
function getTimestamp(inputDate) {
  return (inputDate ? new Date(inputDate) : new Date()).getTime();
}

/**
 * Stringifies JSON data
 * (registered as a handlebars helper)
 *
 * @param inputJson JSON data object
 * @return String
 */
function stringifyJson(inputJson) {
  return JSON.stringify(inputJson, null, 2);
}

function getExtension(filename) {
  return path.extname(getFilename(filename));
}

/**
 * Returns the filename
 */
function getFilename(filename) {
  return path.basename(filename);
}
/**
 * Returns the filename
 */
function getDirname(filename) {
  return (typeof filename === 'string' ? path.dirname(filename) : false);
}

/**
 * Returns the filename without the extension
 */
function getFileBasename(filename) {
  const ext = getExtension(filename);
  return path.basename(filename, ext);
}

function extractMimetype(filename) {
  const ext = getExtension(filename);
  return MIMETYPES[ext] || null;
}

// Example '$base-$resX-$resY-$quality.$format'
function generateOutputFilename(data) {
  let rtn = data.filenamePatern;
  rtn = rtn.replace('$base', data.fileBasename);
  rtn = rtn.replace('$format', data.format);

  return rtn;
}

// function ensureDirSync(jobId) {
function ensureJobTmpDirExists(jobId, callback) {
  const targetPath = `${os.tmpdir()}/vhmc/${jobId}`;
  callback = callback || (() => {});

  // eslint-disable-next-line no-bitwise
  fs.access(targetPath, fs.constants.F_OK | fs.constants.W_OK, (accessTmpDirErr) => {
    if (!accessTmpDirErr) {
      console.log(`${targetPath} exists and is writable`);
      return callback(null, targetPath);
    }

    console.log(`${targetPath} ${accessTmpDirErr.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);

    fs.mkdir(targetPath, { recursive: true }, (mkdirErr) => {
      if (mkdirErr) {
        console.error(mkdirErr);
        return callback(mkdirErr);
      }
      console.log(`${targetPath} exists and is writable`);
      return callback(null, targetPath);
    });
  });
}

function moveInputFileToJobTmpDir(jobId, sourceUrl, callback) {
  const filename = getFilename(sourceUrl);
  const ext = getExtension(sourceUrl);
  const targetDir = `${os.tmpdir()}/vhmc/${jobId}`;
  const targetPath = `${targetDir}/input${ext}`;
  const uploadDir = `${os.tmpdir()}/vhmc/uploads`;
  console.log(`Proceeding to move the input file from "${sourceUrl}" to "${targetPath}"`);

  return ensureJobTmpDirExists(jobId, (ensureDirErr) => {
    if (ensureDirErr) {
      return callback(ensureDirErr);
    }

    if (sourceUrl.startsWith(uploadDir)) {
      return fs.rename(sourceUrl, targetPath, (renameErr) => {
        if (renameErr) {
          return callback(renameErr);
        }

        fs.stat(targetPath, (statErr, stats) => {
          console.log(`stats: ${JSON.stringify(stats)}`);
          return callback(null, targetPath);
        });
      });
    }

    if (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://')) {
      console.log('Fetching file from remote source', sourceUrl);
      const writeStream = fs.createWriteStream(targetPath);
      return axios({ url: sourceUrl, method: 'get', responseType: 'stream' })
        .then((response) => {
          response.data.pipe(writeStream);
        })
        .catch((error) => {
          console.log('Error', error.response, error.message);
        })
        .finally(() => {
          writeStream.on('close', () => {
            console.log('write socket closed');
            callback(null, targetPath);
          });
        });
    }
  });
}

// function removeJobTmpDir(job) {
//
// }

module.exports = {
  formatDateTimeString,
  getTimestamp,
  stringifyJson,
  getFilename,
  getFileBasename,
  getExtension,
  getDirname,
  extractMimetype,
  ensureJobTmpDirExists,
  moveInputFileToJobTmpDir,
};
