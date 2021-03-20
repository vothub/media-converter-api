const pg = require('./postgres');

const AVAILABLE_PRESETS = ['mp4', 'mp3', 'flv', 'ogv', 'ogg', 'gif'];

// Example '$base-$resX-$resY-$quality.$format'
function generateOutputFilename(data) {
  let rtn = data.filenamePatern;
  rtn = rtn.replace('$base', data.fileBasename);
  rtn = rtn.replace('$format', data.format);

  return rtn;
}

/**
 * Create a job
 * @param data object
 * @returns job id
 *
 * data = {
 *   pathIn: '/tmp/file/path',
 *   format: 'mp4',
 *   fileBasename: 'MyImportantPresentation',
 *   filenamePatern: '$base.$format'
 * }
 */
function createJob(data, callback) {
  if (typeof data !== 'object' || !data.pathIn || !data.format) {
    console.log('Missing arguments when creating a job. Provided:', data);
    return null;
  }
  if (AVAILABLE_PRESETS.indexOf(data.format) === -1) {
    console.log('Unsupported output format. Provided:', data.format);
    return null;
  }
  data.filenamePatern = data.filenamePatern || '$base.$format';

  // data.pathOut = `${destination}/${generateOutputFilename(data)}`;
  // TODO insert data to mongo instead
  // jobs[data.id] = data;
  // return data.id;

  // insert to DB here!!
  return callback(null, data.id);
}

/**
 * Update job record
 * Requires id
 */
function updateJob(data, callback) {
  // todo
}

function getAllJobs(opts, callback) {
  return pg.getAllJobs(opts, callback);
}

function getJobById(jobId, callback) {
  return pg.getJobById(jobId, callback);
}

const jobLib = {
  createJob,
  getAllJobs,
  getJobById,
};

module.exports = jobLib;
