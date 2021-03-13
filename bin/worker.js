const ffbinLib = require('../lib/ffbinLib');
const fmt = require('../lib/fmt');
const jobLib = require('../lib/job');

const POLLING_FREQUENCY_MS = 3000;

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

console.log(`[${fmt.date()} ${fmt.time()}] Ensuring ffmpeg and ffprobe binaries are present.`);

ffbinLib.ensureBinaries((err, data) => {
  if (err) {
    console.log(`[${fmt.date()} ${fmt.time()}] ffmpeg and ffprobe binaries could not be located.`);
    return process.exit(1);
  }
  console.log(`[${fmt.date()} ${fmt.time()}] ffmpeg and ffprobe binaries are present.`);

  checkForNewJobs();
});
