const Busboy = require('busboy');
const ffmpeg = require('../../../lib/ffmpeg');
const jobLib = require('../../../lib/job');
const os = require('os');
const fs = require('fs-extra');
const inspect = require('util').inspect;

function handlerMultipart(req, res) {
  const tmpDir = os.tmpDir();
  const destination = tmpDir + '/greatconverto/input';
  fs.ensureDirSync(destination);
  console.log('tmpDir: ', destination);

  var busboy = new Busboy({ headers: req.headers });
  var jobData = {
    format: 'mp4'
  };

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

    if (filename) {
      console.log('Uploading ' + filename);
      jobData.filenameBase = filename;
      jobData.pathIn = destination + '/' + filename;
    }

    file.pipe(fs.createWriteStream(destination + '/' + filename));
  });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    // todo override data.filenameBase
  });

  busboy.on('finish', function() {
    var jobId = jobLib.create(jobData);
    jobLib.start(jobId);
    res.send('Done uploading. Job ID: #' + jobId);
  });

  // Pass the stream
  req.pipe(busboy);
}

module.exports = handlerMultipart;
