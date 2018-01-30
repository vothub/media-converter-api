const handlerJson = require('./json');
const handlerMultipart = require('./multipart');
const handlerGet = require('./get');

function apiDispatcherConvert(req, res) {
  const contentType = req.headers['content-type'] || '';
  console.log('contentType', contentType);

  // any method - json data
  if (contentType.indexOf('application/json') !== -1) {
    return handlerJson(req, res);
  }

  // any method - form data
  if (contentType.indexOf('multipart/form-data') !== -1) {
    return handlerMultipart(req, res);
  }

  // GET fallback
  if (req.method === 'GET') {
    return handlerGet(req, res);
  }

  // other methods throw error
  return res.status(400).send('Content-type must equal "application/json" or "multipart/form-data". Provided: "' + contentType + '"');
}

module.exports = apiDispatcherConvert;
