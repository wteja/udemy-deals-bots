import IBot from "./IBot";
import Course from "../models/Course";
import BrowserService from '../services/BrowserService';
import cheerio from 'cheerio';

export default class LearnViral implements IBot {

    baseUrl: String = "";

    constructor(private browser: BrowserService) {
        this.baseUrl = `https://udemycoupon.learnviral.com/coupon-category/free100-discount/`;
    }

    public start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const html = await this.browser.getHtml(this.baseUrl);
            resolve();
        });
    }

    public stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    public getCourses(): Promise<Course[]> {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
    
}