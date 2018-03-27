const pg = require('pg-promise')();
const dbConfig = 'postgres://robby@localhost:5432/phonebook';
const db = pg(dbConfig);

module.exports = db;
