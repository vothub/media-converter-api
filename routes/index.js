const express = require('express');
const config = require('../lib/config');

function registerRoutes(app) {
  app.use('/public', express.static('public'));

  app.use('/', function (req, res, next) {
    res.locals.baseUrl = config.baseUrl;
    next();
  });

  // App status
  app.get('/', require('./pages/home'));
  app.get('/convert', require('./pages/convert'));
  app.post('/create', require('./pages/create'));
  app.get('/status/:jobId', require('./pages/status'));
  app.get('/api', require('./pages/api'));

  app.post('/api/v1/create', require('./api/create'));
  app.get('/api/v1/status', require('./api/status'));
  app.get('/api/v1/status/:jobId', require('./api/status'));
  app.get('/api/v1/stream', require('./api/stream'));
  app.get('/api/v1/stream/:jobId', require('./api/stream'));
  app.get('/api/v1/stream/:jobId/:nicename', require('./api/stream'));
}

module.exports = registerRoutes;
