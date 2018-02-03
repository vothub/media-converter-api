module.exports = function (req, res) {
  res.locals.pageTitle = 'Great Converto - ffmpeg as a service';
  res.render('pages/home');
};
