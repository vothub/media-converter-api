const _ = require('lodash');
const jobLib = require('../../../lib/job');
const config = require('../../../config');

function apiDispatcherRetrieve (req, res) {
  const jobId = req.params.jobId;
  const contentType = req.headers['content-type'] || '';

  if (!jobId) {
    return res.send('Please specify jobId.');
  }

  const job = jobLib.get(jobId);

  if (!job || typeof job !== 'object') {
    return res.render('pages/error', {error: 'Job not found'});
  }

  if (job.progress === 100) {
    const nicename = _.last(job.pathOut.split('/'));
    job.url = config.baseUrl + '/api/v1/retrieve/' + jobId + '/' + nicename;
  }

  const data = _.omit(job, ['pathIn', 'pathOut']);

  if (contentType.indexOf('application/json') !== -1 || req.query.json !== undefined) {
    return res.json(data);
  }
  res.render('pages/status', {jobId, data});
}

module.exports = apiDispatcherRetrieve;
