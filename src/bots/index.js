const LearnViral = require('./LearnViral');
const BrowserService = require('../services/BrowserService');

function createBot(type, repo) {
    return new type(repo, new BrowserService())
}

module.exports = {
    getBots(repo) {
        return [
            createBot(LearnViral, repo)
        ]
    }
};