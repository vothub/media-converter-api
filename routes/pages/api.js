function apiInfoPage (req, res) {
  res.locals.pageTitle = 'Media Converter API';
  return res.render('pages/api');
}

module.exports = apiInfoPage;
