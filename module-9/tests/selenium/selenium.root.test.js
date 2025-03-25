/**
 * @file selenium.test.js
 * @description Enhanced Selenium browser tests integrated with Jest (headed mode)
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs').promises;
const path = require('path');
const TestUtils = require('./utils/test-utils'); // Import TestUtils
const seleniumErrorPagesTest = require('./main pages/error pages/selenium.error.pages.test'); // Import the seleniumErrorPagesTest
const seleniumHomePageTest = require('./main pages/selenium.home.page.test'); // Import the seleniumHomePageTest
const seleniumLoginPageTest = require('./main pages/selenium.login.page.test'); // Add this import

// Set ChromeDriver path dynamically to the working location
const CHROMEDRIVER_PATH = path.resolve(__dirname, '..', '..', 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe');

// Configuration
const TEST_CONFIG = {
    baseUrl: 'http://localhost:3000',
    timeoutMin: 3000,
    timeoutMax: 10000,
    screenshotDir: path.join(__dirname, 'screenshots'),
    passDir: 'PASS',
    failDir: 'FAIL',
    windowWidth: 1920,
    windowHeight: 1080
};
console.log('TEST_CONFIG:', TEST_CONFIG); // Debug

let driver;
let testUtils;

// Function to delete all PNG files in the screenshots directory
async function deletePngFiles(directory) {
    const files = await fs.readdir(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            // Recursively delete PNG files in subdirectories
            await deletePngFiles(filePath);
        } else if (file.endsWith('.png')) {
            await fs.unlink(filePath);
            console.log(`Deleted: ${filePath}`);
        }
    }
}

// Call the function before any tests run
(async() => {
    await deletePngFiles(path.join(__dirname, 'screenshots'));
})();

beforeAll(async() => {
    console.log('Starting WebDriver setup...');
    console.log('Using ChromeDriver at:', CHROMEDRIVER_PATH);
    try {
        const service = new chrome.ServiceBuilder(CHROMEDRIVER_PATH);
        const options = new chrome.Options()
            .windowSize({
                width: TEST_CONFIG.windowWidth,
                height: TEST_CONFIG.windowHeight
            })
            // Add Chrome profile settings
            .addArguments('--user-data-dir=C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome\\User Data')
            .addArguments('--profile-directory=Profile 56')
            // Optional: Keep browser open (detach doesn't work directly in JS, but we can manage this differently)
            .detachDriver(); // This keeps the browser open after the script ends (not always supported, depends on version)




        console.log('Chrome options configured:', options);
        console.log('Building WebDriver...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(service)
            .build();

        console.log('WebDriver built successfully');
        console.log('Maximizing window...');
        testUtils = new TestUtils(TEST_CONFIG, driver); // Pass driver to TestUtils
        await driver.manage().window().maximize();
        console.log('Window maximized');
        console.log('TEST_CONFIG:', TEST_CONFIG); // Debug
        await driver.get(TEST_CONFIG.baseUrl);

    } catch (error) {
        console.error('WebDriver setup failed with error:', error.message);
        console.error('Full error details:', error);
        throw error;
    }
}, 30000);

afterAll(async() => {
    if (driver) {
        try {
            await driver.quit();
        } catch (error) {
            console.error('Failed to quit WebDriver:', error);
        }
    }
});

beforeEach(async() => {
    // Navigate to the base URL if needed (uncomment if required)
    // await driver.get(TEST_CONFIG.baseUrl);

    // Wait for an indicator that the page is ready, e.g., document.readyState === 'complete'
    await driver.wait(async() => {
        return await driver.executeScript('return document.readyState') === 'complete';
    }, TEST_CONFIG.timeoutMin, 'Page did not load within the minimum timeout period');
});


describe('Selenium Landing Page Browser Tests', () => {
    jest.setTimeout(20000); // Set timeout to 20 seconds


    it('should load the root route, interact with buttons, and verify redirection to home', async() => {
        try {
            await driver.get(TEST_CONFIG.baseUrl);

            const welcomeElement = await testUtils.waitForElement(By.id('landing-heading'));
            const welcomeText = await welcomeElement.getText();
            expect(welcomeText).toContain('Welcome To The Light Ages');
            await testUtils.takeScreenshot('root-page', true, 'pages');

            const enterButton = await testUtils.waitForElement(By.id('landing-button'));
            await enterButton.click();
            await testUtils.takeScreenshot('enter-site-button-click', true, 'pages');

            const acceptButton = await testUtils.waitForElement(By.id('accept-disclaimer-button'));
            await acceptButton.click();
            await testUtils.takeScreenshot('disclaimer-accept-NSFW-click', true, 'pages');

            // Wait for redirection to /home
            await driver.wait(until.urlIs(`${TEST_CONFIG.baseUrl}/home`), TEST_CONFIG.timeoutMin);

            await testUtils.takeScreenshot('NSFW-disclaimer-to-home-page', true, 'pages');

        } catch (error) {
            await testUtils.takeScreenshot('root-page-error', false, 'pages');
            throw error;
        }
    });
});



describe('Selenium Error Page Tests', () => {
    jest.setTimeout(20000);

    seleniumErrorPagesTest(() => ({
        driver,
        waitForElement: testUtils.waitForElement.bind(testUtils),
        takeScreenshot: testUtils.takeScreenshot.bind(testUtils),
        TEST_CONFIG,
        beforeEachSetup: async() => {
            await driver.get(TEST_CONFIG.baseUrl); // Reset state before each test
        }
    }));
});

describe('Selenium Home Page Tests', () => {
    jest.setTimeout(20000);

    seleniumHomePageTest(() => ({
        driver,
        waitForElement: testUtils.waitForElement.bind(testUtils),
        takeScreenshot: testUtils.takeScreenshot.bind(testUtils),
        TEST_CONFIG,
        beforeEachSetup: async() => {
            await driver.get(TEST_CONFIG.baseUrl); // Reset state before each test
        }
    }));
});

describe('Selenium Login Page Tests', () => {
    jest.setTimeout(20000);

    seleniumLoginPageTest(() => ({
        driver,
        waitForElement: testUtils.waitForElement.bind(testUtils),
        takeScreenshot: testUtils.takeScreenshot.bind(testUtils),
        TEST_CONFIG,
        beforeEachSetup: async() => {
            await driver.get(TEST_CONFIG.baseUrl); // Reset state before each test
        }
    }));
});