// jest.config.js
module.exports = {
    testEnvironment: 'node', // For React components
    setupFiles: ['./jest.setup.js'], // Keep if you need it
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest' // Process JS/JSX with Babel
    },
    moduleFileExtensions: ['js', 'jsx'], // Recognize these extensions
    testMatch: [
        '**/tests/jest/**/*.test.js', // Your test file pattern
        '**/tests/selenium/selenium.root.test.js' // Ensure this runs last
    ],
    transformIgnorePatterns: ['/node_modules/(?!uuid/dist/.*)'] // Target uuid's dist folder

};