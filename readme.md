# Great Converto

[![Issues](https://img.shields.io/github/issues/vot/great-converto.svg)](https://github.com/vot/great-converto/issues)
[![Build status](https://img.shields.io/circleci/project/github/vot/great-converto/master.svg)](https://circleci.com/gh/vot/great-converto/tree/master)
[![MIT License](https://img.shields.io/badge/license-LGPL--3.0-blue.svg)](https://spdx.org/licenses/MIT)


This service transcodes media files.

*TL;DR: ffmpeg as a service.*

Development still at an early stage.


## Usage

Checkout, install dependencies with `npm install` and start the app with `npm start`.

This starts server at `http://localhost:3000`.


<!--
## TODO

- Support image conversions
- Support PDF/doc conversions
- Support waveform generation
- Support screenshot generation
- Add web hooks for notifications

JSON Api
{
  file: {url},
  targets: ['gif', 'webm'],
  opts: {
    screenshots: 5,
    screenshotFormat: 'png'
  }
}
{
  file: {url},
  targets: 'jpg',
  opts: {
    pages: '1-3'
  }
}
{
  file: {base64},
  targets: 'jpg'
}
{
  file: {url},
  targets: 'html'
}


-->
