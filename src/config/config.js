const dbSettings = {
    db: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER
};

const serverSettings = {
    port: process.env.PORT || 3000
};

module.exports = Object.create({
    dbSettings,
    serverSettings
});