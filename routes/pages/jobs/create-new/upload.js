const Busboy = require('busboy');
const fs = require('fs');
const os = require('os');
const inspect = require('util').inspect;
const jobLib = require('../../../../lib/job');
const helpers = require('../../../../lib/helpers');

function handlerMultipart(req, res) {
  const tmpDir = os.tmpdir();
  const destination = `${tmpDir}/vhmc/input`;
  helpers.ensureDirSync(destination);
  console.log('tmpDir: ', destination);

  const busboy = new Busboy({ headers: req.headers });
  const jobData = {
    format: 'mp4'
  };

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(`File [${fieldname}]: filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);

    if (filename) {
      console.log(`Uploading ${filename}`);
      jobData.fileBasename = helpers.getFileBasename(filename);
      jobData.pathIn = `${destination}/${filename}`;
    }

    file.pipe(fs.createWriteStream(`${destination}/${filename}`));
  });

  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    console.log(`Field [${fieldname}]: value: ${inspect(val)}`);
    // todo override data.fileBasename

    if (fieldname === 'vhmc-format') {
      jobData.format = val;
    }
  });

  busboy.on('finish', () => {
    const jobId = jobLib.create(jobData);

    res.redirect(`/jobs/view/${jobId}`);
  });

  // Pass the stream
  req.pipe(busboy);
}

module.exports = handlerMultipart;
