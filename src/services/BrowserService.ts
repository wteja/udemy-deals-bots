import puppeteer from 'puppeteer';

export default class BrowserService {
    private browser: any = null;

    constructor() {
    }

    
    open() {
        return new Promise((resolve, reject) => {
            puppeteer.launch()
            .then(browser => {
                this.browser = browser;
                resolve(browser);
            })
            .catch(reject);
        });
    }

    getHtml(url: String) {
        return new Promise(async (resolve, reject) => {
            try {
                const page = await this.browser.newPage();
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