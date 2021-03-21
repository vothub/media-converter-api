const pg = require('../lib/postgres');
const AVAILABLE_PRESETS = require('./presets');

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
  const mappedPresets = AVAILABLE_PRESETS.map((preset) => preset.value);
  if (mappedPresets.indexOf(data.format) === -1) {
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

//   const insertQuery = `INSERT INTO vhmc.public.jobs (
//     input_url,
//     origin,
//     owner,
//     requested_outputs
//   ) VALUES (
//       'https://download.blender.org/demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4',
//       'test-suite',
//       'vot-hq',
//       'ogv'
//   );`
//
//     const job = res.rows[0];
//
//     const response = {
//       error: null,
//       total: res.rowCount,
//       data: job,
//     };
//     return callback(response);
//   });
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
