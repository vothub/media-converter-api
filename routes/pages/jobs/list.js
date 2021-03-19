const jobLib = require('../../../lib/job');

// const _ = require('lodash');
// const jobLib = require('../../lib/job');
// const config = require('../../lib/config');

function renderJobsPage(req, res) {
  const collection = 'jobs';
  jobLib.getAllJobs({}, (jobs) => {
    if (jobs.error) {
      return res.render('pages/error',  { error: 'Error while fetching jobs.' });
    }
    return res.render('pages/jobs/list', { jobs });
  });
}

module.exports = renderJobsPage;
