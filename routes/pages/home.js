module.exports = function (req, res) {
  res.locals.pageTitle = 'VotHub Media Converter API - ffmpeg as a service';
  res.render('pages/home');
};
