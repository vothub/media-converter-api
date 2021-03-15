'use strict';

const express = require('express');
const config = require('../lib/config');
const fmt = require('../lib/fmt');
const routes = require('../routes');

function startApp () {
  const app = express();
  app.disable('x-powered-by');

  // register hbs
  const hbs = config.views.engine;
  hbs.registerPartials(config.views.partialsPath);
  app.engine('hbs', hbs.__express);
  app.set('view engine', 'hbs');

  routes(app);

  if (config.appNetwork === 'private' && !config.appNetworkInterface) {
    console.log('Interface not specified - restricting to localhost');
    config.appNetworkInterface = '127.0.0.1';
  }
  // start app
  app.listen(config.appPort, config.appNetworkInterface, 0, () => {
    console.log(`[${fmt.timestampNow()}] Media Converter listening on port ${config.appPort}`);
  });

  return app;
}

startApp();
