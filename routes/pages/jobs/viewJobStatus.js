const _ = require('lodash');
const jobLib = require('../../../lib/job');
const config = require('../../../lib/config');

function apiDispatcherRetrieve (req, res) {
  const jobId = req.params.jobId;

  if (!jobId) {
    return res.render('pages/error', { error: 'Please specify jobId.' });
  }

  const job = jobLib.getJobById(jobId, (job) => {
    // if (jobs.error) {
    //   return res.render('pages/error',  { error: 'Error while fetching jobs.' });
    // }
    // return res.render('pages/jobs-list', { jobs });

    if (!job || typeof job !== 'object') {
      return res.render('pages/error', { error: 'Job not found.' });
    }

    if (job.progress === 100) {
      const nicename = _.last(job.pathOut.split('/'));
      job.url = `${config.baseUrl}/api/v1/stream/${jobId}/${nicename}`;
    }

    const data = _.omit(job, ['pathIn', 'pathOut']);

    return res.render('pages/status', { jobId, data });
  });
}

module.exports = apiDispatcherRetrieve;
