const path = require('path');
const fs = require('fs').promises;
const { until } = require('selenium-webdriver');

class TestUtils {
    constructor(config, driver) {
        this.config = config;
        this.driver = driver;
        // Validate config at construction
        if (!config || typeof config.screenshotDir !== 'string') {
            throw new Error(`Invalid config: screenshotDir must be a string, got: ${config?.screenshotDir}`);
        }
        if (typeof this.config.passDir !== 'string') {
            throw new Error(`passDir must be a string, got: ${this.config.passDir}`);
        }
        if (typeof this.config.failDir !== 'string') {
            throw new Error(`failDir must be a string, got: ${this.config.failDir}`);
        }
    }

    async takeScreenshot(filename, isSuccess, subDir = '') {
        if (typeof filename !== 'string') {
            throw new Error(`filename must be a string, got: ${filename}`);
        }
        if (typeof isSuccess !== 'boolean') {
            throw new Error(`isSuccess must be a boolean, got: ${isSuccess}`);
        }
        if (subDir !== undefined && typeof subDir !== 'string') {
            throw new Error(`subDir must be a string or undefined, got: ${subDir}`);
        }

        const dir = isSuccess ? this.config.passDir : this.config.failDir;
        const subDirStr = subDir || '';
        // Debugging logs added
        console.log('screenshotDir:', this.config.screenshotDir);
        console.log('dir:', dir);
        console.log('subDirStr:', subDirStr);
        const fullDir = path.join(this.config.screenshotDir, dir, subDirStr);
        console.log(`Saving screenshot to: ${fullDir}`);

        await fs.mkdir(fullDir, { recursive: true });

        const screenshot = await this.driver.takeScreenshot();
        const filePath = path.join(fullDir, `${filename}.png`);
        await fs.writeFile(filePath, screenshot, 'base64');
        console.log(`Screenshot saved to: ${filePath}`);
    }

    async waitForElement(locator, timeout = this.config.timeout) {
        return await this.driver.wait(until.elementLocated(locator), timeout);
    }
}

module.exports = TestUtils;