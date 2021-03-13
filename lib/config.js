const _ = require('lodash');
const path = require('path');
const os = require('os');
const hbs = require('hbs');

const appPortRaw = process.env.PORT;
const appPortParsed = parseInt(appPortRaw, 10);
const appPort = (appPortRaw == appPortParsed) ? appPortParsed : 3000; // eslint-disable-line eqeqeq
const baseUrl = process.env.BASE_URL || `http://localhost:${appPort}`;

const appNetworkRaw = (process.env.NETWORK || '').trim();
const appNetwork = ['public', 'private'].indexOf(appNetworkRaw) === -1 ? 'local' : appNetworkRaw;

const networks = {
  public: '0',
  private: false,
  local: '127.0.0.1'
};

// fixing for DO setup
const privateInterface = os.networkInterfaces().eth1;
if (privateInterface) {
  networks.private = _.map(_.find(privateInterface, { family: 'IPv4' }), 'address');
}

const appNetworkInterface = networks[appNetwork];

const config = {
  baseUrl,
  appPort,
  appNetwork,
  appNetworkInterface,
  paths: {
    public: path.join(__dirname, '../public'),
    views: path.join(__dirname, '../views'),
    data: path.join(__dirname, '../data'),
    // logfile: path.join(__dirname, 'requestlog.json')
  }
};

config.views = {
  engine: hbs,
  partialsPath: `${config.paths.views}/partials`
};

// ensure request log file
// try {
//   fse.accessSync(config.paths.logfile);
// } catch (e) {
//   fse.writeJsonSync(config.paths.logfile, {});
// }

module.exports = config;
