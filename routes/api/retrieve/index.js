function apiDispatcherRetrieve (req, res) {
  const jobId = req.params.jobId;

  res.json({todo: 'Return job #' + jobId + ' here.'});
}

module.exports = apiDispatcherRetrieve;
