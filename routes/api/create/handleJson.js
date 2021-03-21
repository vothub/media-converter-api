// const Busboy = require('busboy');
const bodyParser = require('body-parser');

/**
 * The JSON implementation to handle file uploads
 *
 * File upload will only work when API and Worker threads are running
 * on the same filesystem - just stores file in tmp dir for now
 * TODO: accept base64 as file input
 * TODO: finish this implementation
 */
function handleJson(req, res) {
  bodyParser.json();
  console.log(req.body);
  // const tmpDir = os.tmpdir();
  // const destination = `${tmpDir}/vhmc/uploads`;
  // console.log('tmpDir: ', destination);

  const jobData = {
    input_url: null,
    origin: null,
    owner: null,
    preset: null
  };

  return res.json(jobData);
}

module.exports = handleJson;
