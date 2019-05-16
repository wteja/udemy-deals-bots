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
        this.tempFileOriginalName = 'learnviral'
        this.generateTempFileName()
        this.saveDelay = 5;
        this.furtherPageLimit = 100
    }

    start() {
        return new Promise(async (resolve, reject) => {
            try {
                temp.clearFile(this.tempFileName)

                while (this.working) {
                    console.log("Saving for page " + this.page)

                    const pageUrl = this.page > 1 ? this.baseUrl + `page/${this.page}/` : this.baseUrl
                    const pageInfo = await this.getCourseListPageInfo(pageUrl)
                    const pageLinks = pageInfo.links.join('\n')
                    temp.appendFile(this.tempFileName, pageLinks + '\n')
    
                    if (pageInfo.hasNextPage && (this.isFirstTime || (!this.isFirstTime && this.page < this.furtherPageLimit))) {
                        this.page++
                        await timer.randomDelay()
                    } else {
                        this.page = 1

                        await temp.reverseLines(this.tempFileName)

                        let saveDelay = 0;

                        temp.readLineByLine(this.tempFileName, link => {
                            setTimeout(async () => {
                                const course = await this.getCourseByLink(link)
                                const isExists = await this.repo.isUrlExists(course.url)
                                if (!isExists) {
                                    await this.repo.add(course)
                                }
                            }, saveDelay * 1000)
                            saveDelay += this.saveDelay
                        }).then(async () => {
                            console.log("Save all links successfully.");
                            console.log("Waiting for the new set.");
                            temp.deleteFile(this.tempFileName)
                            this.generateTempFileName()
                            this.isFirstTime = false; // Next time don't need to gather every pages.
                        })
                        .catch(err => reject(err))

                        if(this.isFirstTime) {
                            await timer.delay(3600 * 24)
                        } else {
                            await timer.delay(3600 * 12)
                        }
                    }
                }
    
                resolve()
            } catch (err) {
                reject(err)
            }
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
            const hasNextPage = $activeContentBox.find('.paging .next').length > 0
            const returns = {
                links,
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