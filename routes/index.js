const config = require('../config');

function registerRoutes(app) {
  app.use('/', function (req, res, next) {
    res.locals.baseUrl = config.get('baseUrl') || '';
    next();
  });

  // App status
  app.get('/', require('./home'));

  // API Routes
  app.get('/api', require('./api'));
  app.use('/api/convert', require('./api/convert'));
  app.get('/api/retrieve/:jobId', require('./api/retrieve'));
}

module.exports = registerRoutes;
