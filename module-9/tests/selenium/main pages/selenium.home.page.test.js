// selenium.Home.Page.Test.js
const { By } = require('selenium-webdriver');
const path = require('path');
const fs = require('fs');

/**
 * @function seleniumHomePageTest
 * @description Tests the home page response
 * @param {Function} getDependencies - Function that returns { driver, waitForElement, takeScreenshot, TEST_CONFIG }
 * @returns {void}
 */
const seleniumHomePageTest = (getDependencies) => {
    describe('Home Page', () => {
        let driver, waitForElement, takeScreenshot, TEST_CONFIG;

        beforeEach(async() => {
            ({ driver, waitForElement, takeScreenshot, TEST_CONFIG } = getDependencies());
            await driver.get(`${TEST_CONFIG.baseUrl}/home`);
        }, 5000);

        it('should handle home page', async() => {
            const homeElement = await waitForElement(By.id('page-title'), 10000);
            const text = await homeElement.getText();

            try {
                expect(text).toContain('The Bambi Cloud Podcast');
                await driver.sleep(1500);
                await takeScreenshot('home-page', true, 'pages/home page');
            } catch (error) {
                await takeScreenshot('home-page', false, 'pages/home page');
                throw error;
            }
        }, 15000);

        it('should navigate to featured post', async() => {
            try {
                const featuredPostLink = await waitForElement(By.id('featured-post-link'), 10000);
                await featuredPostLink.click();
                await driver.sleep(1500);
                await takeScreenshot('featured-post-navigation', true, 'pages/home page');
            } catch (error) {
                await takeScreenshot('featured-post-navigation', false, 'pages/home page');
                throw error;
            }
        }, 15000);

        it('should click on the first blog post in the grid', async() => {
            try {
                // Using CSS selector to find the first blog post link in the grid
                const firstBlogPost = await waitForElement(By.css('#blog-posts-grid > a:first-child'), 10000);
                await firstBlogPost.click();
                await driver.sleep(1500);
                await takeScreenshot('blog-post-navigation', true, 'pages/home page');
            } catch (error) {
                await takeScreenshot('blog-post-navigation', false, 'pages/home page');
                throw error;
            }
        }, 15000);

        it('should click on menu toggle button', async() => {
            try {
                const menuButton = await waitForElement(By.id('menu-toggle-button'), 10000);
                await menuButton.click();
                await driver.sleep(1500);
                await takeScreenshot('menu-toggle', true, 'pages/home page');
            } catch (error) {
                await takeScreenshot('menu-toggle', false, 'pages/home page');
                throw error;
            }
        }, 15000);

        it('should navigate to about page through menu', async() => {
            try {
                const menuButton = await waitForElement(By.id('menu-toggle-button'), 10000);
                await menuButton.click();
                await driver.sleep(1000);
                const aboutLink = await waitForElement(By.id('menu-about-link'), 10000);
                await aboutLink.click();
                await driver.sleep(1500);
                await takeScreenshot('menu-about-navigation', true, 'pages/home page');
            } catch (error) {
                await takeScreenshot('menu-about-navigation', false, 'pages/home page');
                throw error;
            }
        }, 15000);

        it('should navigate to random blog through menu', async() => {
            try {
                const menuButton = await waitForElement(By.id('menu-toggle-button'), 10000);
                await menuButton.click();
                await driver.sleep(1000);
                const randomBlogLink = await waitForElement(By.id('menu-random-blog-link'), 10000);
                await randomBlogLink.click();
                await driver.sleep(1500);
                await takeScreenshot('menu-random-blog-navigation', true, 'pages/home page');
            } catch (error) {
                await takeScreenshot('menu-random-blog-navigation', false, 'pages/home page');
                throw error;
            }
        }, 15000);

        it('should navigate to create blog through menu', async() => {
            try {
                const menuButton = await waitForElement(By.id('menu-toggle-button'), 10000);
                await menuButton.click();
                await driver.sleep(2000);
                const createBlogLink = await waitForElement(By.id('menu-create-blog-link'), 10000);
                await createBlogLink.click();
                await driver.sleep(2500);
                await takeScreenshot('menu-create-blog-navigation', true, 'pages/home page');
            } catch (error) {
                await takeScreenshot('menu-create-blog-navigation', false, 'pages/home page');
                throw error;
            }
        }, 15000);

        it('should navigate to login through menu', async() => {
            try {
                const menuButton = await waitForElement(By.id('menu-toggle-button'), 10000);
                await menuButton.click();
                await driver.sleep(2000);
                const loginLink = await waitForElement(By.id('menu-login-link'), 10000);
                await loginLink.click();
                await driver.sleep(2500);
                await takeScreenshot('menu-login-navigation', true, 'pages/home page');
            } catch (error) {
                await takeScreenshot('menu-login-navigation', false, 'pages/home page');
                throw error;
            }
        }, 15000);
    });
};

module.exports = seleniumHomePageTest;