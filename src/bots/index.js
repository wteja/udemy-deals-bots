const LearnViral = require('./LearnViral');
const BrowserService = require('../services/BrowserService');

function createBot(type, repo) {
    const browser = new BrowserService()
    return new type(repo, browser)
}

module.exports = {
    getBots(repo) {
        return [
            createBot(LearnViral, repo)
        ]
    }
};