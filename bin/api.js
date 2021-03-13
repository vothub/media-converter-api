'use strict';

const express = require('express');
const fmt = require('../lib/fmt');
const routes = require('../routes');
const config = require('../config');

function startApp () {
  const app = express();
  app.disable('x-powered-by');

  // register hbs
  const hbs = config.views.engine;
  hbs.registerPartials(config.views.partialsPath);
  app.engine('html', hbs.__express);
  app.set('view engine', 'html');

  routes(app);

  if (config.appNetwork === 'private' && !config.appNetworkInterface) {
    console.log('Couldnt determine private interface - restricting to localhost');
    config.appNetworkInterface = '127.0.0.1';
  }
  // start app
  app.listen(config.appPort, config.appNetworkInterface, 0, () => {
    console.log(`[${fmt.date()} ${fmt.time()}] VotHub Media Converter API listening on port ${config.appPort}`);
  });

  return app;
}

startApp();
