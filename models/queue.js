function claimFirstAvailableJob(workerId, callback) {
  // find first job
}

function identifyStuckJobs() {
  // find jobs stuck in processing for more than ~5 minutes (relative to filesize)
  // if timeout hit and the worker stopped sending updates set the job run status to failed
  //
}

function insertNewJobsIntoQueue() {
  // find all jobs with "new" status
  // and create a queue record for them if they don't have one
}

function moveQueueItemToTheTop() {
  // moves a specific queue item to the top of the queue
}

const QueueModel = {
  claimFirstAvailableJob,
  identifyStuckJobs,
  insertNewJobsIntoQueue,
  moveQueueItemToTheTop,
};

module.exports = QueueModel;
