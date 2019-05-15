const { EventEmitter } = require('events');
const botFactory = require('./bots')
const config = require('./config')
const repository = require('./repository')
const mediator = new EventEmitter()

let bots = [];

mediator.on('db.ready', db => {
    repository.connect(db)
        .then(async repo => {
            bots = await botFactory.getBots(repo)
            bots.forEach(bot => bot.start())
        })
})

mediator.on('db.error', err => console.log(err));

config.db.connect(config.dbSettings, mediator);

mediator.emit('boot.ready');