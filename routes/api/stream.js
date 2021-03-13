const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const jobLib = require('../../lib/job');

function apiDispatcherRetrieve (req, res) {
  const jobId = req.params.jobId;
  const nicename = req.params.nicename;

  if (!jobId) {
    return res.send('Please specify jobId.');
  }

  const job = jobLib.get(jobId);

  if (!job) {
    return res.send('Invalid job');
  }

  if (!nicename) {
    const redirectNicename = _.last(job.pathOut.split('/'));
    return res.redirect(`/api/v1/stream/${jobId}/${redirectNicename}`);
  }

  // Simple jail for this not to jump out of temp dir
  const filepath = path.resolve(job.pathOut);
  const tempDir = `${os.tmpdir()}/vhmc/output/`;
  if (filepath.indexOf(tempDir) !== 0) {
    return res.send('Back to jail with you');
  }

  return fs.exists(filepath, (exists) => {
    if (!exists) {
      console.log(`File does not exist: ${filepath}`);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found');
      return res.end();
    }

    // const mimeType = mimeTypes[path.extname(filepath).split(".")[1]];
    // res.writeHead(200, mimeType);

    const fileStream = fs.createReadStream(filepath);
    return fileStream.pipe(res);
  });
}

module.exports = apiDispatcherRetrieve;
