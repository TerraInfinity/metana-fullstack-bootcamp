// selenium.Home.Page.Test.js
const { By } = require('selenium-webdriver');
const path = require('path');
const fs = require('fs');

/**
 * @function seleniumLoginPageTest
 * @description Tests the home page response
 * @param {Function} getDependencies - Function that returns { driver, waitForElement, takeScreenshot, TEST_CONFIG }
 * @returns {void}
 */
const seleniumLoginPageTest = (getDependencies) => {
    describe('Login Page', () => {
        let driver, waitForElement, takeScreenshot, TEST_CONFIG;
        const randomEmail = `test${Math.random().toString(36).substring(2)}@example.com`;
        const randomPassword = 'TestPassword123!';
        const randomName = `Test User ${Math.random().toString(36).substring(2)}`;

        beforeEach(async() => {
            ({ driver, waitForElement, takeScreenshot, TEST_CONFIG } = getDependencies());
            await driver.get(`${TEST_CONFIG.baseUrl}/login`);
        }, 5000);

        it('should handle login page', async() => {
            const loginElement = await waitForElement(By.id('page-title'), 10000);
            const text = await loginElement.getText();

            try {
                // Check for presence of login buttons
                const googleButton = await waitForElement(By.id('login-google-button'), 5000);
                expect(await googleButton.isDisplayed()).toBe(true);

                const githubButton = await waitForElement(By.id('login-github-button'), 5000);
                expect(await githubButton.isDisplayed()).toBe(true);

                const twitterButton = await waitForElement(By.id('login-twitter-button'), 5000);
                expect(await twitterButton.isDisplayed()).toBe(true);

                const emailLink = await waitForElement(By.id('use-email-link'), 5000);
                expect(await emailLink.isDisplayed()).toBe(true);

                await driver.sleep(1500);
                await takeScreenshot('login-page', true, 'pages/login page');
            } catch (error) {
                await takeScreenshot('login-page', false, 'pages/login page');
                throw error;
            }
        }, 15000);

        it('should handle Google login button click', async() => {
            try {
                const googleButton = await waitForElement(By.id('login-google-button'), 5000);
                await googleButton.click();
                await driver.sleep(1500);
                await takeScreenshot('google-login-click', true, 'pages/login page');

                // Wait for either Google account selection or successful redirect
                await driver.sleep(2000); // Wait for redirect
                try {
                    // Try to find Terra's account on Google selection page
                    const terraAccount = await waitForElement(
                        By.xpath("//div[@data-identifier='terra@terrainfinity.ca']"),
                        5000
                    );
                    await takeScreenshot('google-account-expected', true, 'pages/login page');

                    await terraAccount.click();
                    await driver.sleep(3000);
                } catch (error) {
                    // Check if we're redirected to homepage
                    const currentUrl = await driver.getCurrentUrl();
                    if (currentUrl.endsWith('/home')) {
                        await takeScreenshot('google-login-success', true, 'pages/login page');
                    } else {
                        throw new Error('Neither Google account selection nor homepage redirect was successful');
                    }
                }

                // Add logout steps
                const menuToggle = await waitForElement(By.id('menu-toggle-button'), 5000);
                await menuToggle.click();
                await driver.sleep(1000);

                const logoutButton = await waitForElement(By.id('menu-logout-button'), 5000);
                await logoutButton.click();
                await driver.sleep(1500);
            } catch (error) {
                await takeScreenshot('google-login-error', false, 'pages/login page');
                throw error;
            }
        }, 20000);

        it('should handle GitHub login button click', async() => {
            try {
                const githubButton = await waitForElement(By.id('login-github-button'), 5000);
                await githubButton.click();
                await driver.sleep(1500);
                await takeScreenshot('github-login-click', true, 'pages/login page');

                // Add logout steps
                const menuToggle = await waitForElement(By.id('menu-toggle-button'), 5000);
                await menuToggle.click();
                await driver.sleep(1000);

                const logoutButton = await waitForElement(By.id('menu-logout-button'), 5000);
                await logoutButton.click();
                await driver.sleep(1500);
            } catch (error) {
                await takeScreenshot('github-login-click', false, 'pages/login page');
                throw error;
            }
        }, 10000);
        /* Temporary disabled for development
                it('should handle Twitter login button click', async() => {
                    try {
                        const twitterButton = await waitForElement(By.id('login-twitter-button'), 5000);
                        await twitterButton.click();
                        await driver.sleep(1500);
                        await takeScreenshot('twitter-login-click', true, 'pages/login page');

                        // Add logout steps
                        const menuToggle = await waitForElement(By.id('menu-toggle-button'), 5000);
                        await menuToggle.click();
                        await driver.sleep(1000);

                        const logoutButton = await waitForElement(By.id('menu-logout-button'), 5000);
                        await logoutButton.click();
                        await driver.sleep(1500);
                    } catch (error) {
                        await takeScreenshot('twitter-login-click', false, 'pages/login page');
                        throw error;
                    }
                }, 10000);
        */
        it('should handle email login link click', async() => {
            try {
                const emailLink = await waitForElement(By.id('use-email-link'), 5000);
                await emailLink.click();
                await driver.sleep(1500);
                await takeScreenshot('email-login-click', true, 'pages/login page');

                const emailInput = await waitForElement(By.id('email-input'), 5000);
                await emailInput.sendKeys(randomEmail);

                const passwordInput = await waitForElement(By.id('password-input'), 5000);
                await passwordInput.sendKeys(randomPassword);

                // Take screenshot of filled form
                await takeScreenshot('email-login-form-filled', true, 'pages/login page');

                // Submit the form
                const submitButton = await waitForElement(By.id('auth-submit-button'), 5000);
                await submitButton.click();
                await driver.sleep(1500);

                // Wait for and check the error message
                const errorMessage = await waitForElement(By.id('auth-error-message'), 5000);
                expect(await errorMessage.isDisplayed()).toBe(true);

                // Take screenshot of the error state
                await takeScreenshot('authentication-failed', true, 'pages/login page');
            } catch (error) {
                await takeScreenshot('authentication-failed', false, 'pages/login page');
                throw error;
            }
        }, 15000);

        it('should handle registration form toggle and display', async() => {
            try {
                const emailLink = await waitForElement(By.id('use-email-link'), 5000);
                await emailLink.click();
                await driver.sleep(1500);

                // Click the toggle button to switch to registration
                const toggleButton = await waitForElement(By.id('auth-toggle-button'), 5000);
                await toggleButton.click();
                await driver.sleep(1500);
                // Verify all form elements are present and displayed
                const nameInput = await waitForElement(By.id('name-input'), 5000);
                expect(await nameInput.isDisplayed()).toBe(true);
                expect(await nameInput.getAttribute('placeholder')).toBe('Name');

                const emailInput = await waitForElement(By.id('email-input'), 5000);
                expect(await emailInput.isDisplayed()).toBe(true);
                expect(await emailInput.getAttribute('placeholder')).toBe('Email');

                const passwordInput = await waitForElement(By.id('password-input'), 5000);
                expect(await passwordInput.isDisplayed()).toBe(true);
                expect(await passwordInput.getAttribute('placeholder')).toBe('Password');

                const confirmPasswordInput = await waitForElement(By.id('confirm-password-input'), 5000);
                expect(await confirmPasswordInput.isDisplayed()).toBe(true);
                expect(await confirmPasswordInput.getAttribute('placeholder')).toBe('Confirm Password');

                const submitButton = await waitForElement(By.id('auth-submit-button'), 5000);
                expect(await submitButton.isDisplayed()).toBe(true);
                expect(await submitButton.getText()).toBe('Register');

                await takeScreenshot('registration-form-display', true, 'pages/login page');

                // Use the shared variables instead of generating new ones
                await nameInput.sendKeys(randomName);
                await emailInput.sendKeys(randomEmail);
                await passwordInput.sendKeys(randomPassword);
                await confirmPasswordInput.sendKeys(randomPassword);

                await driver.sleep(1500);
                await takeScreenshot('registration-form-filled', true, 'pages/login page');

                // Submit the form
                await submitButton.click();
                await driver.sleep(3000);
                await takeScreenshot('registration-form-submitted', true, 'pages/login page');

                // Add logout steps
                const menuToggle = await waitForElement(By.id('menu-toggle-button'), 5000);
                await menuToggle.click();
                await driver.sleep(1000);

                const logoutButton = await waitForElement(By.id('menu-logout-button'), 5000);
                await logoutButton.click();
                await driver.sleep(1500);

            } catch (error) {
                await takeScreenshot('registration-form-error', false, 'pages/login page');
                throw error;
            }
        }, 15000);

        it('should handle demo admin login', async() => {
            try {

                const emailLink = await waitForElement(By.id('use-email-link'), 5000);
                await emailLink.click();
                await driver.sleep(1500);
                await takeScreenshot('admin-login-click', true, 'pages/login page');

                const emailInput = await waitForElement(By.id('email-input'), 5000);
                await emailInput.sendKeys('admin2@crystal.ai');

                const passwordInput = await waitForElement(By.id('password-input'), 5000);
                await passwordInput.sendKeys('HanumanChalisa2024!!!');

                // Take screenshot of filled form
                await takeScreenshot('admin-login-form-filled', true, 'pages/login page');

                // Submit the form
                const submitButton = await waitForElement(By.id('auth-submit-button'), 5000);
                await submitButton.click();
                await driver.sleep(1500);

                // Add logout steps
                const menuToggle = await waitForElement(By.id('menu-toggle-button'), 5000);
                await menuToggle.click();
                await driver.sleep(1000);

                const logoutButton = await waitForElement(By.id('menu-logout-button'), 5000);
                await logoutButton.click();
                await driver.sleep(1500);

            } catch (error) {
                await takeScreenshot('admin-login-error', false, 'pages/login page');
                throw error;
            }
        }, 15000);

    });
}

module.exports = seleniumLoginPageTest;