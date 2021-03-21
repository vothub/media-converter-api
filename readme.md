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

Media Converter is configured by environment variables.

You can use a `.env` file to set the necessary values.

**Database (both processes)**
- `POSTGRES_HOST` (defaults to `localhost`)
- `POSTGRES_PORT` (defaults to `5432`)
- `POSTGRES_USER` (defaults to empty string)
- `POSTGRES_PASS` (defaults to empty string)
- `POSTGRES_DBNAME` (defaults to `vhmc`)

**API**
- `APP_PORT` (defaults to `3000`)
- `APP_BASE_URL` (defaults to `localhost:3000`)

**Worker**
- `POLLING_FREQUENCY_MS` (defaults to `3000`)


## TODO

- Retry logic
- Add persistent backing storage (scaling restriction)
- Improve documentation - schemas, statuses, data flow, presets, etc.

<!--
- Logging via debug module
- Support for S3 Signed URLs
- Less synchronous :)
- Queue monitoring + manipulation
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
