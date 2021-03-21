const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const JobModel = require('../../models/job');
const helpers = require('../../lib/helpers');

function apiDispatcherRetrieve (req, res) {
  const jobId = req.params.jobId;
  const nicename = req.params.nicename;

  if (!jobId) {
    return res.send('Please specify jobId.');
  }

  JobModel.getJobById(jobId, (getJobRes) => {
    if (!getJobRes.data) {
      return res.send('Invalid job');
    }

    // if (!nicename) {
    //   const redirectNicename = _.last(job.pathOut.split('/'));
    //   return res.redirect(`/api/v1/stream/${jobId}/${redirectNicename}`);
    // }
    const job = getJobRes.data;

    // Simple jail for this not to jump out of temp dir
    // const filename = helpers.getFilenameBase(job.input_url);
    const tempDir = `${os.tmpdir()}/vhmc/${jobId}`;
    const ext = job.preset.split(':')[0];
    // const filepath = path.resolve(job.pathOut);
    // const filepath = path.resolve(`${tempDir}/${filename}.${ext}`);
    const filepath = path.resolve(`${tempDir}/output.${ext}`);
    // if (filepath.indexOf(tempDir) !== 0) {
    //   return res.send('Back to jail with you');
    // }

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
  });

}

module.exports = apiDispatcherRetrieve;
