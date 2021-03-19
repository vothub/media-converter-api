/* eslint-disable global-require */
const express = require('express');
const config = require('../lib/config');

function registerRoutes(app) {
  app.use('/public', express.static('public'));

  app.use('/', (req, res, next) => {
    res.locals.baseUrl = config.baseUrl;
    next();
  });

  // API
  app.post('/api/v1/create', require('./api/create'));

  app.get('/api/v1/status', require('./api/status'));
  app.get('/api/v1/status/:jobId', require('./api/status'));

  app.get('/api/v1/stream', require('./api/stream'));
  app.get('/api/v1/stream/:jobId', require('./api/stream'));
  app.get('/api/v1/stream/:jobId/:nicename', require('./api/stream'));

  // UI
  // app.get('/', require('./pages/home'));
  app.get('/', require('./pages/jobs/list'));
  app.get('/jobs', (req, res) => res.redirect('/'));
  app.get('/jobs/create-new', require('./pages/jobs/create-new/render'));
  app.post('/jobs/create-new/upload', require('./pages/jobs/create-new/upload'));
  app.get('/jobs/view/:jobId', require('./pages/jobs/view'));
  app.get('/api', require('./pages/api'));
}

module.exports = registerRoutes;
