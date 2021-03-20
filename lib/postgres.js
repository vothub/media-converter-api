const { Client } = require('pg');
const config = require('./config');

const pgOpts = {
  host: config.postgresHost,
  port: config.postgresPort,
  user: config.postgresUser,
  password: config.postgresPass,
  database: config.postgresDbName,
};

const client = new Client(pgOpts);

// very meh - replace with something decent
function sanitiseSQLString(input) {
  return input.replace(';', '').replace('\'', '').replace('"', '').replace('\\', '');
}

function connectClient() {
  return client.connect()
    .then(() => {
      console.log('DB connection established.');
    })
    .catch((e) => {
      console.log(`DB connection failed: ${e && e.message ? e.message : e}`);
      return process.exit(1);
    });
}

// needs to be triggered explicitly during boot
// needs callback
connectClient();

// function disconnect() {
//   client.end();
// }

/**
 * Get all jobs
 * Supported filters:
 * - status
 * - owner
 */
function getAllJobs(opts, callback) {
  // connect();
  // add filters here
  let query = 'SELECT * FROM public.jobs';
  if (opts && typeof opts.status === 'string') {
    query += ` WHERE status='${sanitiseSQLString(opts.status.toLowerCase())}'`;
  }
  console.log('query:', query);
  client.query(query, (err, res) => {
    if (err) {
      // log the error
      return callback({ error: err.message });
    }

    const response = {
      error: null,
      total: res.rowCount,
      data: res.rows,
    };
    return callback(response);
  });
}

function getJobById(jobId, callback) {
  // connect();
  // check if jobId is a valid uuid
  client.query(`SELECT * FROM public.jobs WHERE job_id = '${jobId}'::uuid`, (err, res) => {
    // disconnect();

    if (err) {
      // log the error
      return callback({ error: err });
    }

    if (!res || !Array.isArray(res.rows) || !res.rows.length) {
      return callback({ error: 'Job not found' });
    }

    const job = res.rows[0];

    const response = {
      error: null,
      total: res.rowCount,
      data: job,
    };
    return callback(response);
  });
}

// function createJob(jobData, callback) {
//   // connect();
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
//   // check if jobId is a valid uuid
//   client.query(insertQuery, (err, res) => {
//   // client.query(`INSERT * FROM public.jobs WHERE job_id = '${jobId}'::uuid`, (err, res) => {
//     // disconnect();
//
//     if (err) {
//       // log the error
//       return callback({ error: err });
//     }
//
//     if (!res || !Array.isArray(res.rows) || !res.rows.length) {
//       return callback({ error: 'Job not found' });
//     }
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
// }

function claimFirstAvailableJob(workerId, callback) {
  // find first job
}

function identifyStuckJobs() {
  // find jobs stuck in processing for more than ~5 minutes (relative to filesize)
  // if timeout hit and the worker stopped sending updates set the job run status to failed
  //
}

module.exports = {
  getAllJobs,
  getJobById,
};
