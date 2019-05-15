const cheerio = require('cheerio')
const htmlToText = require('html-to-text')
const timer = require('../utilities/timer')
const courseHelper = require('../utilities/course')

module.exports = class LearnViral {

    constructor(repo, browser) {
        this.repo = repo
        this.browser = browser
        this.baseUrl = `https://udemycoupon.learnviral.com/coupon-category/free100-discount/`
        this.page = 1
        this.working = true
    }

    start() {
        return new Promise(async (resolve, reject) => {
            try {
                let pageLinks = []
                while (this.working) {
                    const pageUrl = this.page > 1 ? this.baseUrl + `page/${this.page}/` : this.baseUrl
                    const pageInfo = await this.getCourseListPageInfo(pageUrl)
                    pageLinks = pageLinks.concat(pageInfo.links)
    
                    await timer.randomDelay(5, 10)
    
                    if (pageInfo.hasNextPage) {
                        this.page++
                        await timer.randomDelay(5, 10)
                    } else {
                        this.page = 1
    
                        pageLinks.reverse() // Reverse to save old data first.
                        
                        for (let i = 0, n = pageLinks.length; i < n; i++) {
                            const course = await this.getCourseByLink(pageLinks[i])
                            const isExists = await this.repo.isUrlExists(course.url)
                            if (!isExists) {
                                await this.repo.add(course)
                            }
                            await timer.randomDelay(5, 10)
                        }
    
                        pageLinks = [] // Clear all links.
    
                        await timer.delay(60 * 60 * 6)
                    }
                }
    
                resolve()
            } catch (err) {
                reject(err)
            }
        })
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
        console.log('Save link: ' + link)
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