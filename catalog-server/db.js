const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('C:/Users/hp/catalog.db');

module.exports = db;

