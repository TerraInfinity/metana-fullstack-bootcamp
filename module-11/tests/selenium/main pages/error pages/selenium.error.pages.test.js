// selenium.error.pages.test.js
const { By } = require('selenium-webdriver');

/**
 * @function seleniumErrorPagesTest
 * @description Tests error page responses
 * @param {Function} getDependencies - Function that returns { driver, waitForElement, takeScreenshot, TEST_CONFIG }
 * @returns {void}
 */
const seleniumErrorPagesTest = (getDependencies) => {
    describe('404 Not Found', () => {
        it('should handle 404 page', async() => {
            const { driver, waitForElement, takeScreenshot, TEST_CONFIG } = getDependencies();
            await driver.get(`${TEST_CONFIG.baseUrl}/non-existent-page`);
            const errorElement = await waitForElement(By.tagName('h1'));
            const text = await errorElement.getText();
            expect(text).toContain('404');
            await takeScreenshot('404-success', true, 'error pages');
        }, 15000);
    });

    describe('403 Restricted Access', () => {
        it('should handle 403 page', async() => {
            const { driver, waitForElement, takeScreenshot, TEST_CONFIG } = getDependencies();
            await driver.get(`${TEST_CONFIG.baseUrl}/403`);
            const errorElement = await waitForElement(By.tagName('h1'));
            const text = await errorElement.getText();
            expect(text).toContain('403');
            await takeScreenshot('403-success', true, 'error pages');
        }, 15000);
    });

    describe('500 Server Error', () => {
        it('should handle 500 page', async() => {
            const { driver, waitForElement, takeScreenshot, TEST_CONFIG } = getDependencies();
            await driver.get(`${TEST_CONFIG.baseUrl}/500`);
            const errorElement = await waitForElement(By.tagName('h1'));
            const text = await errorElement.getText();
            expect(text).toContain('500');
            await takeScreenshot('500-success', true, 'error pages');
        }, 15000);
    });

    describe('401 Unauthorized Access', () => {
        it('should handle 401 page', async() => {
            const { driver, waitForElement, takeScreenshot, TEST_CONFIG } = getDependencies();
            await driver.get(`${TEST_CONFIG.baseUrl}/401`);
            const errorElement = await waitForElement(By.tagName('h1'));
            const text = await errorElement.getText();
            expect(text).toContain('401');
            await takeScreenshot('401-success', true, 'error pages');
        }, 15000);
    });
};

module.exports = seleniumErrorPagesTest;