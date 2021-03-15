module.exports = (req, res) => {
  res.locals.pageTitle = 'Media Converter - ffmpeg as a service';
  res.render('pages/home');
};
