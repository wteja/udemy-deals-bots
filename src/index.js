require('dotenv').config()
const { EventEmitter } = require('events');
const botFactory = require('./bots')
const config = require('./config')
const repository = require('./repository')
const fs = require('fs')
const path = require('path')
const mediator = new EventEmitter()

// Prepare directories
const vitalDirs = [
    path.resolve(__dirname, '..', 'temp'),
    path.resolve(__dirname, '..', 'userdata')
]
vitalDirs.forEach(dirPath => {
    if (!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath)
})

let bots = [];

mediator.on('db.ready', db => {
    repository.connect(db)
        .then(async repo => {
            bots = await botFactory.getBots(repo)
            bots.forEach(bot => bot.start())

            console.log("Bots are runnings...")
        })
})

mediator.on('db.error', err => {
    console.log(err)
    process.exit(1)
});

config.db.connect(config.dbSettings, mediator);

mediator.emit('boot.ready');