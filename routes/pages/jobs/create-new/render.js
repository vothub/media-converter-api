const presets = require('../../../../models/presets');

module.exports = (req, res) => {
  res.locals.pageTitle = 'Create a new job - Media Converter';
  res.render('pages/jobs/create-new', { presets });
};
