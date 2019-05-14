const cheerio = require('cheerio');
const htmlToText = require('html-to-text');
const timer = require('../utilities/timer');

module.exports = class LearnViral {

    constructor(browser) {
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
            console.log(course);

            // const test [{
            //     title:
            //     'The Complete Oracle SQL Course: Beginner to Advanced!',
            //     description: 'May 12, 2019 // Duration: 3 hrs 33 mins // Lectures: 39 //',
            //     link:
            //     'https://www.udemy.com/the-complete-oracle-sql-course-beginner-to-advanced/' }];



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
            const couponLink = $('.coupon-code-link').attr('href');
            const courses = {
                title,
                description,
                link: couponLink
            };
            resolve(courses);
        });
    }

}