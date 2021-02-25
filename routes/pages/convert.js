module.exports = function (req, res) {
  res.locals.pageTitle = 'Convert a file - VotHub Media Converter API';
  res.render('pages/convert');
};
