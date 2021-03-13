module.exports = (req, res) => {
  res.locals.pageTitle = 'Convert a file - Media Converter API';
  res.render('pages/convert');
};
