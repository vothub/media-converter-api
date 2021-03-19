const jobLib = require('../../../lib/job');

function renderJobsPage(req, res) {
  return jobLib.getAllJobs({}, (jobs) => {
    if (jobs.error) {
      return res.render('pages/error', { error: 'Error while fetching jobs.' });
    }
    return res.render('pages/jobs/list', { jobs });
  });
}

module.exports = renderJobsPage;
