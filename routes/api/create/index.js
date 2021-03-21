const handleJson = require('./handleJson');
const handleMultipart = require('./handleMultipart');

function apiDispatcherConvert(req, res) {
  const contentType = req.headers['content-type'] || '';

  // json data
  if (contentType.startsWith('application/json')) {
    return handleJson(req, res);
  }

  // multipart data
  if (contentType.startsWith('multipart/form-data')) {
    return handleMultipart(req, res);
  }

  // other methods throw error
  return res.status(400).send(`Content-type must equal "application/json" or "multipart/form-data". Provided: "${contentType}"`);
}

module.exports = apiDispatcherConvert;
