import IBot from './IBot';
import LearnViral from './LearnViral';
import BrowserService from '../services/BrowserService';


export default {
    getBots(): Promise<IBot[]> {
        return new Promise((resolve, reject) => {
            const browser = new BrowserService();
            browser.open().then(() => {
                const bots: IBot[] = [
                    new LearnViral(browser)
                ];
                resolve(bots);
            })
            .catch(reject);
        });
    }
};