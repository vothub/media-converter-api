const _ = require('lodash');
const jobLib = require('../../lib/job');
const config = require('../../lib/config');

function apiDispatcherRetrieve (req, res) {
  const jobId = req.params.jobId;
  const contentType = req.headers['content-type'] || '';
  const job = jobLib.get(jobId);

  if (!jobId) {
    return res.send('Please specify jobId.');
  }

  if (!job || typeof job !== 'object') {
    return res.render('pages/error', { error: 'Job not found' });
  }

  if (job.progress === 100) {
    const nicename = _.last(job.pathOut.split('/'));
    job.url = `${config.baseUrl}/api/v1/stream/${jobId}/${nicename}`;
  }

  const data = _.omit(job, ['pathIn', 'pathOut']);

  return res.json(data);
}

module.exports = apiDispatcherRetrieve;
