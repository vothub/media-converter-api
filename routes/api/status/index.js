const _ = require('lodash');
const jobLib = require('../../../lib/job');

function apiDispatcherRetrieve (req, res) {
  const jobId = req.params.jobId;
  if (!jobId) {
    return res.send('Please specify jobId.');
  }

  const job = jobLib.get(jobId);

  if (!job || typeof job !== 'object') {
    res.status(404).send('Job with specified ID not found.');
  }

  if (job.progress === 100) {
    const nicename = _.last(job.pathOut.split('/'));
    job.url = '/api/v1/retrieve/' + jobId + '/' + nicename;
  }

  res.json(_.omit(job, ['pathIn', 'pathOut']));
}

module.exports = apiDispatcherRetrieve;
