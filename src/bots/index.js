const LearnViral = require('./LearnViral');
const BrowserService = require('../services/BrowserService');

module.exports = {
    getBots(repo) {
        return new Promise((resolve, reject) => {
            const browser = new BrowserService();
            browser.open().then(() => {
                const bots = [
                    new LearnViral(repo, browser)
                ];
                resolve(bots);
            })
                .catch(reject);
        });
    }
};