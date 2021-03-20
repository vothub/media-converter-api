const uuidv4 = require('uuid/v4');
const _ = require('lodash');
const os = require('os');
const helpers = require('./helpers');
const converter = require('./converter');
const pg = require('./db/postgres');

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
function create(data, callback) {
  if (typeof data !== 'object' || !data.pathIn || !data.format) {
    console.log('Missing arguments when creating a job. Provided:', data);
    return null;
  }
  if (AVAILABLE_PRESETS.indexOf(data.format) === -1) {
    console.log('Unsupported output format. Provided:', data.format);
    return null;
  }
  data.filenamePatern = data.filenamePatern || '$base.$format';

  const tmpDir = os.tmpdir();
  data.id = uuidv4();

  const destination = `${tmpDir}/vhmc/output/${data.id.toString()}`;
  helpers.ensureDirSync(destination);

  data.pathOut = `${destination}/${generateOutputFilename(data)}`;
  // TODO insert data to mongo instead
  // jobs[data.id] = data;
  // return data.id;
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

function start(id, callback) {
  console.log(`Starting job #${id}`);
  if (typeof callback !== 'function') {
    console.log('Callback function not provided - the worker thread will not be released after job completes!');
  }

  return getJobById(id, (job) => {
    if (job.error || !job.data || !job.data.job_id) {
      console.log(job);
      console.log(`Job #${id} could not be located.`);
      return;
    }

    const opts = {
      // codec: 'libx264'
    };

    job.opts = opts;

    converter.start(job, (updateData) => {
      if (updateData.state === 'started') {
        console.log(`Transcoding started (job #${updateData.id}).`);
      }

      if (updateData.state === 'progress') {
        console.log(`Job #${updateData.id} progress: ${Math.floor(updateData.progress * 100) / 100}%.`);
      }

      if (updateData.state === 'completed') {
        console.log(`Done converting (job #${updateData.id}).`);
        console.log(`File saved to ${job.pathOut}`);
        updateData.progress = 100;
        // update job progress in db instead - consider multiple outputs
        // this callback is what releases the worker thread to pick up new jobs
        callback();
      }

      if (updateData.progress > 100) {
        updateData.progress = 100;
      }

      // jobs[id] = _.merge(job, updateData);
      // updateJob(id, updateData);
    });
  });
}

const jobLib = {
  create,
  getAllJobs,
  getJobById,
  start
};

module.exports = jobLib;
