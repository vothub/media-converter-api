const presets = require('../../../../models/job').AVAILABLE_PRESETS;

module.exports = (req, res) => {
  res.locals.pageTitle = 'Convert a file - Media Converter';

  res.render('pages/jobs/create-new', { presets });
};
