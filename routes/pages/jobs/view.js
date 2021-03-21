const _ = require('lodash');
const JobModel = require('../../../models/job');

function renderJobInspectPage (req, res) {
  const jobId = req.params.jobId;
  res.locals.pageTitle = `Inspect job ${jobId} - Media Converter`;

  const autorefresh = req.query.autorefresh === 'true';
  if (!jobId) {
    return res.render('pages/error', { error: 'Please specify jobId.' });
  }

  return JobModel.getJobById(jobId, (job) => {
    if (!job || typeof job !== 'object') {
      return res.render('pages/error', { error: 'Job not found.' });
    }

    if (job.progress === 100) {
      const nicename = _.last(job.pathOut.split('/'));
      job.url = `${res.locals.baseUrl}/api/v1/stream/${jobId}/${nicename}`;
    }

    const jobData = _.omit(job, ['pathIn', 'pathOut']);

    return res.render('pages/jobs/view', { jobId, job: jobData, autorefresh });
  });
}

module.exports = renderJobInspectPage;
