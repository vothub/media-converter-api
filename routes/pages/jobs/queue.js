const JobModel = require('../../../models/job');

function renderQueuePage(req, res) {
  res.locals.pageTitle = 'Queue - Media Converter';

  return JobModel.getAllJobs({}, (jobs) => {
    if (jobs.error) {
      return res.render('pages/error', { error: 'Error while fetching jobs.' });
    }
    return res.render('pages/jobs/list', { jobs });
  });
}

module.exports = renderQueuePage;
