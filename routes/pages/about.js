function renderAboutPage(req, res) {
  res.locals.pageTitle = 'About Media Converter';
  return res.render('pages/about');
}

module.exports = renderAboutPage;
