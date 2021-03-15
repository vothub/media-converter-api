# Media Converter

[![media-converter.vothub.com](https://img.shields.io/website.svg?down_color=red&down_message=down&label=media-converter.vothub.com&up_color=green&up_message=ok&url=https%3A%2F%2Fmedia-converter.vothub.com)](https://media-converter.vothub.com)
[![Issues](https://img.shields.io/github/issues/vothub/media-converter-api.svg)](https://github.com/vothub/media-converter-api/issues)
[![Build status](https://img.shields.io/circleci/project/github/vothub/media-converter-api/master.svg)](https://circleci.com/gh/vothub/media-converter-api/tree/master)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://spdx.org/licenses/MIT)


This service transcodes media files from one format to another.

It uses server and worker components to manage concurrency.

*TL;DR: ffmpeg as a service.*

Development still at an early stage.


## Quickstart
```
# Clone the repo
git clone https://github.com/vothub/media-converter-api.git
cd media-converter-api

# Install dependencies
npm install

# Start the app
npm start
```

This starts the application at `http://localhost:3000`
with a single worker thread and a single server thread.

## Configuration

- `PORT`
- `BASE_URL`
- `NETWORK`


## TODO

- Add database for persistence
- Support for S3 Signed URLs
- Logging via debug module
- Documentation - job schema, statuses, data flow, presets
- Less synchronous :)

<!--
- Queue monitoring
- Auth
- Documentation - deployments, multiple nodes
- Add web hooks / callback URLs for notifications
- Support image conversions
- Support PDF/doc conversions
- Support waveform generation
- Support screenshot generation (from videos and text documents)
-->

<!--
JSON API
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
