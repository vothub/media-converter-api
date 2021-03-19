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

function processJob(jobId) {
  console.log(`Processing job ${jobId}`);
  return jobLib.start(jobId, () => {
    // once finished look for a new job
    return checkForNewJobs();
  });
}

// claim first unassigned job
function getFirstJobId(jobsArray) {
  if (!Array.isArray(jobsArray) || !jobsArray.length) {
    return null;
  }
  const validJobs = jobsArray.filter(job => !!job.job_id);
  if (!validJobs.length) {
    return null;
  }

  return validJobs[0].job_id;
}

// async fn but no callback - detached on purpose
function checkForNewJobs() {
  console.log('Checking for new jobs...');
  return jobLib.getAllJobs({ status: 'new' }, (jobs) => {
    if (jobs.error) {
      console.log('Error when fetching jobs!', jobs.error);
    } else if (!Array.isArray(jobs.data) || !jobs.data.length) {
      console.log('No new jobs found');
    }
    const firstJobId = getFirstJobId(jobs.data);
    if (firstJobId) {
      console.log(`First available job: ${firstJobId}`)
      return processJob(firstJobId);
    }

    // set up the next check after defined polling frequency timeout
    return setTimeout(checkForNewJobs, POLLING_FREQUENCY_MS);
  });
}

/**
 * Main function - entry point
 */
function main() {
  console.log(`[${fmt.timestampNow()}] Ensuring ffmpeg and ffprobe binaries are present.`);

  ffbinariesWrapper.ensureBinaries((err) => {
    if (err) {
      console.log(`[${fmt.timestampNow()}] ffmpeg and ffprobe binaries could not be located.`);
      return process.exit(1);
    }
    console.log(`[${fmt.timestampNow()}] ffmpeg and ffprobe binaries are present.`);
    return checkForNewJobs();
  });
}

main();
