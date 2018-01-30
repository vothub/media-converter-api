function apiInfoPage (req, res) {
  return res.json({todo: 'Some info about API', routeYoureLookingFor: '/api/convert'});
}

module.exports = apiInfoPage;
