const ffbinariesWrapper = require('../lib/ffbinaries');
const fmt = require('../lib/fmt');
const jobLib = require('../lib/job');

const pollingFreqRaw = process.env.POLLING_FREQUENCY_MS;
const pollingFreqParsed = parseInt(pollingFreqRaw, 10);
const pollingFreq = (pollingFreqRaw == pollingFreqParsed) ? pollingFreqParsed : 3000; // eslint-disable-line eqeqeq

const POLLING_FREQUENCY_MS = pollingFreq;
const DB_URL = process.env.DB_URL || 'localhost:5432';
const DB_NAME = process.env.DB_NAME || 'vhmc';
const DB_USER = process.env.DB_USER || '';
const DB_PASS = process.env.DB_PASS || '';

// trace logs :)
console.log('DB_URL', DB_URL);
console.log('DB_NAME', DB_NAME);
console.log('DB_USER', DB_USER);
console.log('DB_PASS', DB_PASS);

function processJob(jobId) {
  console.log(`Processing job ${jobId}`);
  jobLib.start(jobId);
  return checkForNewJobs();
}

function checkForNewJobs() {
  console.log('Checking for new jobs...');
  const jobId = null;
  if (jobId) {
    return processJob(jobId);
  }

  // set up the next check after defined polling frequency timeout
  return setTimeout(checkForNewJobs, POLLING_FREQUENCY_MS);
}

console.log(`[${fmt.timestampNow()}] Ensuring ffmpeg and ffprobe binaries are present.`);

ffbinariesWrapper.ensureBinaries((err) => {
  if (err) {
    console.log(`[${fmt.timestampNow()}] ffmpeg and ffprobe binaries could not be located.`);
    return process.exit(1);
  }
  console.log(`[${fmt.timestampNow()}] ffmpeg and ffprobe binaries are present.`);
  return checkForNewJobs();
});
