const Busboy = require('busboy');
const fs = require('fs');
const os = require('os');
const inspect = require('util').inspect;
const JobModel = require('../../../models/job');
const helpers = require('../../../lib/helpers');

/**
 * The multipart implementation to handle file uploads
 *
 * File upload only work when API and Worker threads are running
 * on the same filesystem - just stores file in tmp dir for now
 */
function handleMultipart(req, res) {
  const tmpDir = os.tmpdir();
  const destination = `${tmpDir}/vhmc/uploads`;
  console.log('tmpDir: ', destination);

  const jobData = {
    input_url: null,
    origin: null,
    owner: null,
    preset: null
  };

  // first create a job!
  helpers.ensureJobTmpDirExists('uploads', (err) => {
    const busboy = new Busboy({ headers: req.headers });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      console.log(`File [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);

      if (filename) {
        console.log(`Uploading ${filename}`);
        jobData.input_url = `${destination}/${filename}`;
      }

      file.pipe(fs.createWriteStream(`${destination}/${filename}`));
    });

    busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
      console.log(`Field [${fieldname}]: value: ${inspect(val)}`);
      // todo override data.fileBasename

      if (fieldname === 'vhmc-input-url' && typeof val === 'string' && val.length) {
        jobData.input_url = val;
      }
      if (fieldname === 'vhmc-preset' && typeof val === 'string' && val.length) {
        jobData.preset = val;
      }
      if (fieldname === 'vhmc-owner' && typeof val === 'string' && val.length) {
        jobData.owner = val;
      }
      if (fieldname === 'vhmc-origin' && typeof val === 'string' && val.length) {
        jobData.origin = val;
      }
    });

    busboy.on('finish', () => {
      // const jobId = JobModel.createJob(jobData);
      JobModel.createJob(jobData, (createJobResponse) => {
        console.log('createJobResponse', createJobResponse);
        res.redirect(`/jobs/view/${createJobResponse.data}`);
      });
    });

    // Pass the stream
    req.pipe(busboy);
  });
}

module.exports = handleMultipart;
