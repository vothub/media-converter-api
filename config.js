var config = {
  'mongoUrl': process.env.MONGO_URI || 'mongodb://localhost:27017/great-converto',
  'baseUrl': process.env.APP_URL || 'http://localhost:3000'
};

module.exports = {
  get: function (path) {
    return config[path];
  }
};
