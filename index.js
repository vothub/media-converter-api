'use strict';

const _ = require('lodash');
const express = require('express');
const ffbinLib = require('./lib/ffbinLib');
const fmt = require('./lib/fmt');
const routes = require('./routes');
const config = require('./config');

function startApp () {
  console.log(`[${fmt.date()} ${fmt.time()}] Ensuring ffmpeg and ffprobe binaries are present.`);
  ffbinLib.ensureBinaries(function (err, data) {
    console.log(`[${fmt.date()} ${fmt.time()}] ffmpeg and ffprobe binaries are present.`);
    const app = express();
    app.disable('x-powered-by');

    // register hbs
    const hbs = config.views.engine;
    hbs.registerPartials(config.views.partialsPath);
    app.engine('html', hbs.__express);
    app.set('view engine', 'html');

    routes(app);

    // start app
    app.listen(config.port, function () {
      console.log(`[${fmt.date()} ${fmt.time()}] Great Converto listening on port ${config.port}`);
    });

    return app;
  });

}

startApp();
