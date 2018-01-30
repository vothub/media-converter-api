function handlerJson(req, res) {
  if (!req.query.file) {
    return res.json('"file" <url|base64> must be specified.');
  }

  if (!req.query.formats) {
    return res.json('"formats" <string|array> must be specified.');
  }

  const filepath = req.query.file;

  res.json({todo: 'Currently not implemented'});
}

module.exports = handlerJson;
