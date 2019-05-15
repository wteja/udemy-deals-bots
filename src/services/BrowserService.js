const puppeteer = require('puppeteer');
const randomUA = require('modern-random-ua');
const path = require('path');

module.exports = class BrowserService {
    constructor() {
        this.browser = null;
    }
    
    open() {
        return new Promise((resolve, reject) => {
            puppeteer.launch({
                headless: true,
                userDataDir: path.resolve(__dirname, '..', '..', 'userdata')
            })
            .then(browser => {
                this.browser = browser;
                resolve(browser);
            })
            .catch(reject);
        });
    }

    getHtml(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.browser.newPage();
                const userAgent = randomUA.generate();
                await page.setUserAgent(userAgent);
                await page.goto(url);
                const html = await page.evaluate(() => document.body.innerHTML);
                page.close();
                resolve(html);
            } catch (error) {
                reject(error);
            }
        });
    }

    close() {
        if (this.browser) {
            this.browser.close();
        }
    }
};