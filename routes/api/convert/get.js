function handlerGet(req, res) {

  let form = '<html><head></head><body>';
  form += '<form method="POST" enctype="multipart/form-data">';
  form += '<input type="text" name="textfield"><br />';
  form += '<input type="file" name="filefield"><br />';
  form += '<input type="submit">';
  form += '</form>';
  form += '</body></html>';

  res.send(form);
}



module.exports = handlerGet;
