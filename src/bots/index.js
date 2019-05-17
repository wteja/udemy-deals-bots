const LearnViral = require('./LearnViral');
const BrowserService = require('../services/BrowserService');

module.exports = {
    getBots(repo) {
        return new Promise((resolve, reject) => {
            const browser = new BrowserService()
            browser.openBrowser().then(() => {
                resolve([
                    new LearnViral(repo, browser)
                ])
            })
            .catch(reject)
        })
    }
};