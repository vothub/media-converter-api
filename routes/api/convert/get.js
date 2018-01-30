function handlerGet(req, res) {
  let form = '<html><head></head><body>';
  form += '<form method="POST" enctype="multipart/form-data">';
  // form += '<input type="text" name="textfield"><br />';
  form += '<input type="file" name="converto-file"><br />';
  form += '<select name="converto-format">';
  form += '<option>mp4</option>';
  form += '<option>mp3</option>';
  form += '<option>gif</option>';
  form += '<option>flv</option>';
  form += '<option>ogv</option>';
  form += '<option>ogg</option>';
  form += '</select><br />';
  form += '<input type="submit">';
  form += '</form>';
  form += '<small>Max size: 50MB</small>';
  form += '</body></html>';

  res.send(form);
}



module.exports = handlerGet;
