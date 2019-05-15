const cheerio = require('cheerio');
const htmlToText = require('html-to-text');
const timer = require('../utilities/timer');
const courseHelper = require('../utilities/course');

module.exports = class LearnViral {

    constructor(repo, browser) {
        this.repo = repo;
        this.browser = browser;
        this.baseUrl = `https://udemycoupon.learnviral.com/coupon-category/free100-discount/`;
        this.page = 1;
        this.working = true;
    }

    start() {
        return new Promise(async (resolve, reject) => {
            // while(this.working) {
            //     const pageUrl = this.page > 1 ? this.baseUrl + `page/${this.page}/` : this.baseUrl;
            //     const pageInfo = await this.getCourseListPageInfo(pageUrl);

            //     await timer.randomDelay();

            //     const courses = await this.getAllCoursesByLinks(pageInfo.links);

            //     if(pageInfo.hasNextPage) {
            //         this.page++;
            //     } else {
            //         this.page = 1;
            //     }
            //     await timer.randomDelay(10, 30);
            // }

            const course = await this.getCourseByLink("https://udemycoupon.learnviral.com/coupon/essentials-of-non-disclosure-agreements-ndas/");
            const isExists = await this.repo.isUrlExists(course.url);
            if(!isExists) {
                const result = await this.repo.add(course);
                console.log(result);
            }

            resolve();
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.working = false;
            resolve();
        });
    }

    getCoursesLinks() {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }

    getCourseListPageInfo(url) {
        return new Promise(async (resolve, reject) => {
            const html = await this.browser.getHtml(url);
            const $ = cheerio.load(html);
            const $content = $('#content');
            const $activeContentBox = $content.find('.content-box:nth-child(2)');
            const $couponCodeLinks = $activeContentBox.find('.entry-title a');
            const links = $couponCodeLinks.toArray().map(a => a.attribs.href);
            const hasNextPage = $activeContentBox.find('.paging .next').length > 0;
            const returns = {
                links,
                hasNextPage
            };
            resolve(returns);
        });
    }

    getAllCoursesByLinks(links) {
        return new Promise(async (resolve, reject) => {
            const promises = links.map(async link => {
                await timer.randomDelay();
                return this.getCourseByLink(link);
            });
            Promise.all(promises)
                .then(results => {
                    console.log(results);
                })
                .catch(reject);
        });
    }

    getCourseByLink(link) {
        return new Promise(async (resolve, reject) => {
            const html = await this.browser.getHtml(link);
            const $ = cheerio.load(html);
            const title = $('.blog .entry-title a').text().replace('[Free] ', '');
            const $textBox = $('.blog .text-box');
            $textBox.find('h2').remove();
            const description = htmlToText.fromString($textBox.html());
            const couponUrl = $('.coupon-code-link').attr('href');
            const course = courseHelper.create(title, description, couponUrl);
            resolve(course);
        });
    }

}