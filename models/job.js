const pg = require('../lib/postgres');
const AVAILABLE_PRESETS = require('./presets');

const availablePresetsArray = AVAILABLE_PRESETS.map((preset) => preset.value);

// very meh - replace with something decent
function sanitiseSQLString(input) {
  return input.replace(';', '').replace('\'', '').replace('"', '').replace('\\', '');
}

/**
 * Create a job
 * @param data object
 * @returns job id
 *
 * data = {
 *   input_url: '/tmp/file/path',
 *   preset: 'mp4',
 *   owner: 'vhmc',
 *   origin: 'test-suite'
 * }
 */
function createJob(data, callback) {
  if (typeof data !== 'object' || !data.input_url || !data.preset) {
    console.log('Missing arguments when creating a job. Provided:', data);
    return null;
  }
  if (availablePresetsArray.indexOf(data.preset) === -1) {
    console.log('Unsupported output format. Provided:', data.preset);
    return null;
  }
  // data.filenamePatern = data.filenamePatern || '$base.$format';

  const insertQuery = `INSERT INTO vhmc.public.jobs (
    input_url,
    preset,
    origin,
    owner
  ) VALUES (
    '${data.input_url}',
    '${data.preset}',
    ${data.origin ? `${data.origin}` : `'test-suite'`},
    ${data.owner ? `${data.owner}` : `'vhmc'`}
  ) RETURNING job_id;`;

  return pg.execQuery(insertQuery, (insertJobResponse) => {
    if (!insertJobResponse || insertJobResponse.error) {
      return callback(insertJobResponse || { error: 'Couldnt insert the job into DB' });
    }

    if (!insertJobResponse.data || !Array.isArray(insertJobResponse.data) || !insertJobResponse.data.length) {
      return callback({ error: 'Job ID not returned. Job missing maybe?' });
    }

    const jobId = insertJobResponse.data[0].job_id;
    console.log('INSERTED JOB', jobId);

    const response = {
      error: null,
      total: insertJobResponse.total,
      data: jobId
    };
    return callback(response);
  });
}

/**
 * Update job record
 * Requires id
 */
function updateJob(data, callback) {
  // todo
}

function getAllJobs(opts, callback) {
  let query = 'SELECT * FROM public.jobs';
  if (opts && typeof opts.status === 'string') {
    query += ` WHERE status='${sanitiseSQLString(opts.status.toLowerCase().trim())}'`;
  }
  // console.log('query:', query);
  return pg.execQuery(query, callback);
}

function getJobById(jobId, callback) {
  // return pg.getJobById(jobId, callback);
  // check if jobId is a valid uuid
  const query = `SELECT * FROM public.jobs WHERE job_id = '${jobId}'::uuid`;

  return pg.execQuery(query, (getJobResponse) => {
    if (!getJobResponse || getJobResponse.error) {
      return callback(getJobResponse || { error: 'Couldnt fetch job from DB' });
    }

    if (!getJobResponse.data || !Array.isArray(getJobResponse.data) || !getJobResponse.data.length) {
      return callback({ error: 'Job not found' });
    }

    const response = {
      error: null,
      total: getJobResponse.total,
      data: getJobResponse.data[0],
    };
    return callback(response);
  });
}

const JobModel = {
  AVAILABLE_PRESETS,
  createJob,
  getAllJobs,
  getJobById,
};

module.exports = JobModel;
