const { Client } = require('pg');

const pgOpts = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'vhmc',
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
