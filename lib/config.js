/**
 * Casts strings to numbers
 */
function parseNumber(inputRaw) {
  const inputParsed = parseInt(inputRaw, 10);
  return (inputRaw == inputParsed) ? inputParsed : false; // eslint-disable-line eqeqeq
}

const appPort = parseNumber(process.env.PORT) || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${appPort}`;

const postgresHost = process.env.POSTGRES_HOST || 'localhost';
const postgresPort = parseNumber(process.env.POSTGRES_PORT) || 5432;
const postgresUser = process.env.POSTGRES_USER || '';
const postgresPass = process.env.POSTGRES_PASS || '';
const postgresDbName = process.env.POSTGRES_DBNAME || 'vhmc';

const config = {
  baseUrl,
  appPort,
  postgresHost,
  postgresPort,
  postgresDbName,
  postgresUser,
  postgresPass,
};

module.exports = config;
