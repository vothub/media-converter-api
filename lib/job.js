const uuidv4 = require('uuid/v4');
const os = require('os');
const fs = require('fs-extra');
const ffmpeg = require('./ffmpeg');
let jobs = {};

// TODO parse data.filenamePattern
function generateOutputFilename(data) {
  return data.filenameBase + '.' + data.format;
}

/**
 * Create a job
 * @param data object
 * @returns job id
 *
 * data = {
 *   pathIn: '/tmp/file/path',
 *   format: 'mp4',
 *   filenameBase: 'MyImportantPresentation',
 *   filenamePatern: '$base-$resX-$resY-$quality.$format'
 * }


 const filename = path.substr(path.lastIndexOf('/') + 1);
 const destLocation = os.tmpdir() + '/' + filename + '.mp4';

 */
function create(data) {
  if (typeof data !== 'object' || !data.pathIn || !data.format) {
    console.log('Missing arguments when creating a job. Provided:', data);
    return null;
  }
  const tmpDir = os.tmpDir();
  data.id = uuidv4();

  const destination = tmpDir + '/greatconverto/output/' + data.id.toString();
  fs.ensureDirSync(destination);

  data.pathOut = destination + '/' + generateOutputFilename(data);
  // TODO insert data to mongo instead
  jobs[data.id] = data;

  return data.id;
}


function get(id) {
  return jobs[id];
}

function start(id) {
  console.log('Starting job #' + id);
  var job = get(id);

  // Process:
  // 1. Get input file from tmp dir
  // 2. Start conversion process

  // const opts = {
  //   codec: 'libx264'
  // };
  ffmpeg.convert(job, function (result) {
    console.log('Done converting job #' + id);
    // res.json({status: 'Transcoding started.'});
  });
}

const jobLib = {
  create,
  get,
  start
};

module.exports = jobLib;
