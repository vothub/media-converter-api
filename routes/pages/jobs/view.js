const _ = require('lodash');
const jobLib = require('../../../lib/job');
// const config = require('../../../lib/config');

function apiDispatcherRetrieve (req, res) {
  const jobId = req.params.jobId;

  if (!jobId) {
    return res.render('pages/error', { error: 'Please specify jobId.' });
  }

  return jobLib.getJobById(jobId, (job) => {
    if (!job || typeof job !== 'object') {
      return res.render('pages/error', { error: 'Job not found.' });
    }

    if (job.progress === 100) {
      const nicename = _.last(job.pathOut.split('/'));
      job.url = `${res.locals.baseUrl}/api/v1/stream/${jobId}/${nicename}`;
    }

    const jobData = _.omit(job, ['pathIn', 'pathOut']);

    return res.render('pages/jobs/view', { jobId, job: jobData });
  });
}

module.exports = apiDispatcherRetrieve;
