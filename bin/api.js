process.env.VHMC_PROCESS_TYPE = 'api';

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const config = require('../lib/config');
const helpers = require('../lib/helpers');

function startApp () {
  const app = express();
  app.disable('x-powered-by');

  hbs.registerPartials(path.join(__dirname, '../views/partials'));
  hbs.registerHelper('stringifyJson', helpers.stringifyJson);
  hbs.registerHelper('formatDateTimeString', helpers.formatDateTimeString);
  app.engine('hbs', hbs.__express);
  app.set('view engine', 'hbs');

  app.use('/public', express.static('public'));

  app.use('/', (req, res, next) => {
    res.locals.baseUrl = config.baseUrl;
    next();
  });

  /* eslint-disable global-require */
  // API
  app.post('/api/v1/create', require('../routes/api/create'));

  app.get('/api/v1/status', require('../routes/api/status'));
  app.get('/api/v1/status/:jobId', require('../routes/api/status'));

  app.get('/api/v1/stream', require('../routes/api/stream'));
  app.get('/api/v1/stream/:jobId', require('../routes/api/stream'));
  app.get('/api/v1/stream/:jobId/:nicename', require('../routes/api/stream'));

  // UI
  app.get('/', require('../routes/pages/jobs/queue'));
  app.get('/jobs', (req, res) => res.redirect('/'));
  app.get('/jobs/create-new', require('../routes/pages/jobs/create-new/render'));
  app.get('/jobs/view/:jobId', require('../routes/pages/jobs/view'));
  app.get('/api', require('../routes/pages/api'));
  app.get('/about', require('../routes/pages/about'));

  // start app
  app.listen(config.appPort, () => {
    console.log(`[${helpers.formatDateTimeString()}] Media Converter listening on port ${config.appPort}`);
  });

  return app;
}

startApp();
