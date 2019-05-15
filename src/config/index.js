const { dbSettings, serverSettings } = require('./config');
const db = require('./mongo');

module.exports = {
    dbSettings,
    serverSettings,
    db
};