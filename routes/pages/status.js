const _ = require('lodash');
const jobLib = require('../../lib/job');
const config = require('../../config');

function apiDispatcherRetrieve (req, res) {
  const jobId = req.params.jobId;
  const contentType = req.headers['content-type'] || '';
  const job = jobLib.get(jobId);

  if (!jobId) {
    return res.render('pages/error', {error: 'Please specify jobId.'});
  }

  if (!job || typeof job !== 'object') {
    return res.render('pages/error', {error: 'Job not found.'});
  }

  if (job.progress === 100) {
    const nicename = _.last(job.pathOut.split('/'));
    job.url = config.baseUrl + '/api/v1/stream/' + jobId + '/' + nicename;
  }

  const data = _.omit(job, ['pathIn', 'pathOut']);

  res.render('pages/status', {jobId, data});
}

module.exports = apiDispatcherRetrieve;
