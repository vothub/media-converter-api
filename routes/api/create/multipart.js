const Busboy = require('busboy');
const fs = require('fs-extra');
const os = require('os');
const inspect = require('util').inspect;

const jobLib = require('../../../lib/job');
const filenameLib = require('../../../lib/filename');
const config = require('../../../config');

function handlerMultipart(req, res) {
  const tmpDir = os.tmpDir();
  const destination = tmpDir + '/vhmc/input';
  fs.ensureDirSync(destination);
  console.log('tmpDir: ', destination);

  const busboy = new Busboy({ headers: req.headers });
  const jobData = {
    format: 'mp4'
  };

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

    if (filename) {
      console.log('Uploading ' + filename);
      jobData.fileBasename = filenameLib.getFileBasename(filename);
      jobData.pathIn = destination + '/' + filename;
    }

    file.pipe(fs.createWriteStream(destination + '/' + filename));
  });

  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    // todo override data.fileBasename

    if (fieldname === 'format') {
      jobData.format = val;
    }
  });

  busboy.on('finish', function() {
    const jobId = jobLib.create(jobData);
    jobLib.start(jobId);

    res.json({id: jobId, url: config.baseUrl + '/api/v1/status/' + jobId});
  });

  // Pass the stream
  req.pipe(busboy);
}

module.exports = handlerMultipart;
