const { Client } = require('pg');
const config = require('./config');

const pgOpts = {
  host: config.postgresHost,
  port: config.postgresPort,
  user: config.postgresUser,
  password: config.postgresPass,
  database: config.postgresDbName,
};

const client = new Client(pgOpts);

function connectClient() {
  return client.connect()
    .then(() => {
      console.log('DB connection established.');
    })
    .catch((e) => {
      console.log(`DB connection failed: ${e && e.message ? e.message : e}`);
      return process.exit(1);
    });
}

// needs to be triggered explicitly during boot
// needs callback
connectClient();

// function disconnect() {
//   client.end();
// }

/**
 * Get all jobs
 * Supported filters:
 * - status
 * - owner
 */
function execQuery(query, callback) {
  return client.query(query, (err, res) => {
    if (err) {
      console.log(`Error executing query: "${query}". Error: "${err.message}"`);
      return callback({ error: err.message, total: null, data: null });
    }

    const response = {
      error: null,
      total: res.rowCount,
      data: res.rows,
    };
    return callback(response);
  });
}

module.exports = {
  execQuery,
};
