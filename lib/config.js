const appPortRaw = process.env.PORT;
const appPortParsed = parseInt(appPortRaw, 10);
const appPort = (appPortRaw == appPortParsed) ? appPortParsed : 3000; // eslint-disable-line eqeqeq
const baseUrl = process.env.BASE_URL || `http://localhost:${appPort}`;

const dbUrl = process.env.DB_URL || 'localhost:5432';
const dbName = process.env.DB_NAME || 'vhmc';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';

const config = {
  baseUrl,
  appPort,
  dbUrl,
  dbName,
  dbUser,
  dbPass,
};

module.exports = config;
