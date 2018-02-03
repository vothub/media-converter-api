const Busboy = require('busboy');
const ffmpeg = require('../../lib/ffmpeg');
const jobLib = require('../../lib/job');
const filenameLib = require('../../lib/filename');
const os = require('os');
const fs = require('fs-extra');
const inspect = require('util').inspect;

function handlerMultipart(req, res) {
  const tmpDir = os.tmpDir();
  const destination = tmpDir + '/greatconverto/input';
  fs.ensureDirSync(destination);
  console.log('tmpDir: ', destination);

  const busboy = new Busboy({ headers: req.headers });
  const jobData = {
    format: 'mp4'
  };

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

    if (filename) {
      console.log('Uploading ' + filename);
      jobData.fileBasename = filenameLib.getFileBasename(filename);
      jobData.pathIn = destination + '/' + filename;
    }

    file.pipe(fs.createWriteStream(destination + '/' + filename));
  });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    // todo override data.fileBasename

    if (fieldname === 'converto-format') {
      jobData.format = val;
    }
  });

  busboy.on('finish', function() {
    const jobId = jobLib.create(jobData);
    jobLib.start(jobId);

    res.redirect('/status/' + jobId);
  });

  // Pass the stream
  req.pipe(busboy);
}

module.exports = handlerMultipart;
