module.exports = function (req, res) {
  res.locals.pageTitle = 'Convert a file - Great Converto';
  res.render('pages/convert');
};
