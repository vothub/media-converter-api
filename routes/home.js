module.exports = function (req, res) {
  let rtn = 'Great Converto is alive!';
  rtn += '<br /><a href="/api/v1/convert">Start converting</a>'
  res.send(rtn);
};
