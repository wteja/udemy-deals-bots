const dbSettings = {
    db: process.env.DB || 'udemy_deals',
    user: process.env.DB_USER || 'udemy_deals',
    password: process.env.DB_PASS || 'LXgxXoQ4TDHy2FV7',
    repls: process.env.DB_REPLS || 'Cluster0-shard-0',
    authSource: process.env.DB_AUTH_SOURCE || 'test',
    retryWrite: process.env.DB_RETRY_WRITE || 'true',
    server: process.env.DB_SERVER || 'primary-cluster-4zuff.gcp.mongodb.net'
};

const serverSettings = {
    port: process.env.PORT || 3000
};

module.exports = Object.create({
    dbSettings,
    serverSettings
});