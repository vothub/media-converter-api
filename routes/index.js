const config = require('../config');

function registerRoutes(app) {
  app.use('/', function (req, res, next) {
    res.locals.baseUrl = config.get('baseUrl') || '';
    next();
  });

  // App status
  app.get('/', require('./home'));

  // API Routes
  app.get('/api', function (req, res) {return res.redirect('/api/v1')});
  app.get('/api/v1', require('./api'));

  app.use('/api/v1/convert', require('./api/convert'));

  app.get('/api/v1/status', require('./api/status'));
  app.get('/api/v1/status/:jobId', require('./api/status'));

  app.get('/api/v1/retrieve', require('./api/retrieve'));
  app.get('/api/v1/retrieve/:jobId', require('./api/retrieve'));
  app.get('/api/v1/retrieve/:jobId/:nicename', require('./api/retrieve'));
}

module.exports = registerRoutes;
