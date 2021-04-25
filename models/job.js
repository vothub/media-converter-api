const pg = require('../lib/postgres');
const FFMPEG_PRESETS = require('./presets');

const presetKeys = Object.keys(FFMPEG_PRESETS);

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
  if (presetKeys.indexOf(data.preset) === -1) {
    console.log('Unsupported output format. Provided:', data.preset);
    return null;
  }
  // data.filenamePatern = data.filenamePatern || '$base.$format';

  const insertQuery = `INSERT INTO public.jobs (
    input_url,
    preset,
    origin,
    owner
  ) VALUES (
    '${data.input_url}',
    '${data.preset}',
    ${data.origin ? `'${data.origin}'` : "'test-suite'"},
    ${data.owner ? `'${data.owner}'` : "'vhmc'"}
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
 * @param jobId
 * @param data.status
 * @param data.time_started
 * @param data.time_finished
 * @param callback
 */
function updateJob(jobId, data, callback) {
  if (typeof jobId !== 'string' || !jobId.length) {
    return callback('jobId is required');
  }
  if (typeof data !== 'object' || (!data.status && !data.time_started && !data.time_finished)) {
    return callback(`No update-able data provided. Provided: ${JSON.stringify(data)}`);
  }

  const updatedFields = [];
  if (data.status) {
    updatedFields.push(`status = '${data.status}'`);
  }
  if (data.time_started) {
    updatedFields.push(`time_started = '${new Date(data.time_started).toISOString()}'::timestamp`);
  }
  if (data.time_finished) {
    updatedFields.push(`time_finished = '${new Date(data.time_finished).toISOString()}'::timestamp`);
  }

  let updateQuery = 'UPDATE public.jobs';
  updateQuery += ` SET ${updatedFields.join(', ')}`;
  updateQuery += ` WHERE job_id='${jobId}'::uuid;`;

  return pg.execQuery(updateQuery, (updateJobResponse) => {
    if (!updateJobResponse || updateJobResponse.error) {
      return callback(updateJobResponse || { error: 'Couldnt insert the job into DB' });
    }

    if (!updateJobResponse.data || !Array.isArray(updateJobResponse.data) || !updateJobResponse.data.length) {
      return callback({ error: 'Job ID not returned. Job missing maybe?' });
    }

    console.log('UPDATED JOB', jobId);

    const response = {
      error: null,
      total: updateJobResponse.total,
      data: jobId
    };
    return callback(response);
  });
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
  createJob,
  updateJob,
  getAllJobs,
  getJobById,
};

module.exports = JobModel;
