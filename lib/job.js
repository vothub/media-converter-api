const uuidv4 = require('uuid/v4');
const _ = require('lodash');
const os = require('os');
const fs = require('fs-extra');
const ffmpeg = require('./ffmpeg');
const pg = require('./db/postgres');

// TODO - switch to database implementation
const jobs = {};

function generateOutputFilename(data) {
  // Example '$base-$resX-$resY-$quality.$format'

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
  if (['mp4', 'mp3', 'flv', 'ogv', 'ogg', 'gif'].indexOf(data.format) === -1) {
    console.log('Unsupported output format. Provided:', data.format);
    return null;
  }
  data.filenamePatern = data.filenamePatern || '$base.$format';

  const tmpDir = os.tmpdir();
  data.id = uuidv4();

  const destination = `${tmpDir}/vhmc/output/${data.id.toString()}`;
  fs.ensureDirSync(destination);

  data.pathOut = `${destination}/${generateOutputFilename(data)}`;
  // TODO insert data to mongo instead
  jobs[data.id] = data;

  return data.id;
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

    ffmpeg.convert(job, (update) => {
      if (update.state === 'started') {
        console.log(`Transcoding started (job #${update.id}).`);
      }

      if (update.state === 'progress') {
        console.log(`Job #${update.id} progress: ${Math.floor(update.progress * 100) / 100}%.`);
      }

      if (update.state === 'completed') {
        console.log(`Done converting (job #${update.id}).`);
        console.log(`File saved to ${job.pathOut}`);
        update.progress = 100;
        // this callback is what releases the worker thread to pick up new jobs
        callback();
      }

      if (update.progress > 100) {
        update.progress = 100;
      }

      jobs[id] = _.merge(job, update);
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
