const JobModel = require('../../../models/job');

function renderJobsPage(req, res) {
  return JobModel.getAllJobs({}, (jobs) => {
    if (jobs.error) {
      return res.render('pages/error', { error: 'Error while fetching jobs.' });
    }
    return res.render('pages/jobs/list', { jobs });
  });
}

module.exports = renderJobsPage;
