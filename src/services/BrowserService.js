const puppeteer = require('puppeteer');
const randomUA = require('modern-random-ua');
const path = require('path');

module.exports = class BrowserService {

    openBrowser() {
        return new Promise((resolve, reject) => {
            try {
                let puppeteerOptions = {
                    headless: true,
                    userDataDir: path.resolve(__dirname, '..', '..', 'userdata'),
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
                };

                puppeteer.launch(puppeteerOptions)
                    .then(browser => {
                        resolve(browser)
                    })
                    .catch(reject)
            } catch (err) {
                resolve(err)
            }
        });
    }

    getHtml(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const browser = await this.openBrowser();
                const page = await browser.newPage();
                const userAgent = randomUA.generate();
                await page.setUserAgent(userAgent);
                await page.goto(url);
                const html = await page.evaluate(() => document.body.innerHTML);
                page.close();
                browser.close();
                resolve(html);
            } catch (error) {
                reject(error);
            }
        });
    }
};