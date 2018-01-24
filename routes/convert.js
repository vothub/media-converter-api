const ffmpeg = require('../lib/ffmpeg');

function convertRoute(req, res) {
  if (!req.query.file) {
    return res.json('"file" must be specified.');
  }

  if (!req.query.format) {
    return res.json('"format" must be specified.');
  }

  const filepath = req.query.file;

  const opts = {
    // codec: 'libx264'
  };

  ffmpeg.convert(filepath, opts, function (result) {
    console.log(result);
    res.json({status: 'Transcoding started.'});
  });

}

module.exports = convertRoute;
