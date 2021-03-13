module.exports = (req, res) => {
  res.locals.pageTitle = 'Media Converter API - ffmpeg as a service';
  res.render('pages/home');
};
