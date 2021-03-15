const postgres = require('postgres');

// const _ = require('lodash');
// const jobLib = require('../../lib/job');
// const config = require('../../lib/config');

const postgresOpts = {
  db: 'vhmc',
  user: 'postgres',
  pass: 'postgres',
  idle_timeout: 0.2,
  debug: false,
  max: 1
};

const sql = postgres(postgresOpts); // will default to the same as psql

function renderJobsPage(req, res) {
  const collection = 'jobs';
  const results = sql(`select id, status from ${collection}`, (err, data) => {
    console.log('err', err);
    console.log('data', data);
  });

  console.log(results);
  return res.json(results);
}

module.exports = renderJobsPage;
