# Media Converter API

[![GreatConverto.com](https://img.shields.io/website-up-down-green-red/https/greatconverto.com.svg?label=greatconverto.com)](https://greatconverto.com)
[![Issues](https://img.shields.io/github/issues/vothub/media-converter-api.svg)](https://github.com/vothub/media-converter-api/issues)
[![Build status](https://img.shields.io/circleci/project/github/vothub/media-converter-api/master.svg)](https://circleci.com/gh/vothub/media-converter-api/tree/master)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://spdx.org/licenses/MIT)


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
