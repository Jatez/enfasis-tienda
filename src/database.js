const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '34.70.173.38',
  database: 'enfasis2',
  password: 'enfasis2*',
  port: 5432,
});

module.exports = pool;