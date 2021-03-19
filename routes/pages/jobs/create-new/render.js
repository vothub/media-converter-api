module.exports = (req, res) => {
  res.locals.pageTitle = 'Convert a file - Media Converter';
  res.render('pages/jobs/create-new');
};
