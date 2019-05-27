const cheerio = require('cheerio')
const htmlToText = require('html-to-text')
const timer = require('../utilities/timer')
const temp = require('../utilities/temp')
const courseHelper = require('../utilities/course')

module.exports = class LearnViral {

    constructor(repo, browser) {
        this.repo = repo
        this.browser = browser
        this.baseUrl = `https://udemycoupon.learnviral.com/coupon-category/free100-discount/`
        this.page = 1
        this.working = true
        this.isFirstTime = true
        this.isRunOnce = false;
        this.tempFileOriginalName = 'learnviral'
        this.generateTempFileName()
        this.delayNewSet = 3600;
        this.furtherPageLimit = 10;
    }

    start() {
        return new Promise(async (resolve, reject) => {
            try {

                while (this.working) {

                    if (!this.isRunOnce) {
                        if(this.isFirstTime) {
                            this.page = await this.getLastPageNumber();
                            this.isFirstTime = false;
                        } else {
                            this.page = this.furtherPageLimit;
                        }
                        this.isRunOnce = true;
                    }

                    const pageUrl = this.page > 1 ? this.baseUrl + `page/${this.page}/` : this.baseUrl
                    const pageInfo = await this.getCourseListPageInfo(pageUrl)

                    await timer.randomDelay()

                    for (let i = 0, n = pageInfo.links.length; i < n; i++) {
                        const course = await this.getCourseByLink(pageInfo.links[i]);
                        const isExists = await this.repo.isUrlExists(course.url)
                        if (!isExists) {
                            await this.repo.add(course)

                            await timer.randomDelay()
                        }
                    }

                    this.page--;
                    if (!pageInfo.hasPrevPage || this.page <= 0) {
                        this.isRunOnce = false;
                        await timer.delay(this.delayNewSet)
                    } else {
                        await timer.randomDelay()
                    }

                }

                resolve()
            } catch (err) {
                reject(err)
            }
        })
    }

    getLastPageNumber() {
        return new Promise(async (resolve, reject) => {
            const html = await this.browser.getHtml(this.baseUrl)
            const $ = cheerio.load(html)
            const $content = $('#content')
            const $activeContentBox = $content.find('.content-box:nth-child(2)')
            const $nextPage = $activeContentBox.find('.paging .next')
            const lastPageNumber = $nextPage.prev().text().replace(',', '');
            resolve(lastPageNumber)
        })
    }

    generateTempFileName() {
        this.tempFileName = this.tempFileOriginalName + new Date().valueOf()
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.working = false
            resolve()
        })
    }

    getCoursesLinks() {
        return new Promise((resolve, reject) => {
            resolve([])
        })
    }

    getCourseListPageInfo(url) {
        return new Promise(async (resolve, reject) => {
            const html = await this.browser.getHtml(url)
            const $ = cheerio.load(html)
            const $content = $('#content')
            const $activeContentBox = $content.find('.content-box:nth-child(2)')
            const $couponCodeLinks = $activeContentBox.find('.entry-title a')
            const links = $couponCodeLinks.toArray().map(a => a.attribs.href)
            const hasPrevPage = $activeContentBox.find('.paging .prev').length > 0
            const hasNextPage = $activeContentBox.find('.paging .next').length > 0
            const returns = {
                links,
                hasPrevPage,
                hasNextPage
            }
            resolve(returns)
        })
    }

    getCourseByLink(link) {
        return new Promise(async (resolve, reject) => {
            const html = await this.browser.getHtml(link)
            const $ = cheerio.load(html)
            const title = $('.blog .entry-title a').text().replace('[Free] ', '')
            const $textBox = $('.blog .text-box')
            $textBox.find('h2').remove()
            const description = htmlToText.fromString($textBox.html())
            const thumbnailUrl = $('.store-image img').attr('src')
            const couponUrl = $('.coupon-code-link').attr('href')
            const course = courseHelper.create(title, description, couponUrl, thumbnailUrl)
            resolve(course)
        })
    }

}