const pg = require('../lib/postgres');

// very meh - replace with something decent
function sanitiseSQLString(input) {
  return input.replace(';', '').replace('\'', '').replace('"', '').replace('\\', '');
}

/**
 * Create a job run entry
 * Every attempt (original and retries) at processing a job should be registered
 * as an individual run which can then be associated with the logs of the job run
 * @param data object
 * @returns job id
 */
function createJobRun(data, callback) {
  // todo
}

/**
 * Update job runner
 * Requires id
 */
function updateJobRun(data, callback) {
  // todo
}

function getAllJobRunsForJobId(jobId, callback) {
  if (typeof jobId !== 'string') {
    return callback({ error: 'Invalid Job ID' });
  }
  let query = 'SELECT * FROM public.job_runs';
  query += ` WHERE job_id='${sanitiseSQLString(jobId)}':uuid`;
  // console.log('query:', query);
  return pg.execQuery(query, callback);
}

function getJobRunById(jobRunId, callback) {
  let query = 'SELECT * FROM public.job_runs';
  query += ` WHERE job_run_id='${sanitiseSQLString(jobRunId)}':uuid`;

  return pg.execQuery(query, (getJobRunResponse) => {
    if (!getJobRunResponse || getJobRunResponse.error) {
      return callback(getJobRunResponse || { error: 'Couldnt fetch job run from DB' });
    }

    if (!getJobRunResponse.data || !Array.isArray(getJobRunResponse.data) || !getJobRunResponse.data.length) {
      return callback({ error: 'Job run not found' });
    }

    const response = {
      error: null,
      total: getJobRunResponse.total,
      data: getJobRunResponse.data[0],
    };
    return callback(response);
  });
}

function storeLogsForJobRun(jobRunId, logdata, callback) {
  // todo
}

const JobModel = {
  createJobRun,
  updateJobRun,
  getAllJobRunsForJobId,
  getJobRunById,
  storeLogsForJobRun,
};

module.exports = JobModel;
