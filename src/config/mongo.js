const mongo = require('mongodb');

const getMongoUrl = options => {
    return `mongodb+srv://${options.user}:${options.password}@${options.server}/${options.db}`
}

const connect = (options, mediator) => {
    mediator.once('boot.ready', _ => {
        const uri = getMongoUrl(options);console.log(uri)
        mongo.connect(uri, {
            useNewUrlParser: true
        }).
            then(client => {
                const db = client.db(options.db);
                mediator.emit('db.ready', db);
            })
            .catch(err => mediator.emit('db.error', err))
    })
}

module.exports = {
    connect
}