// jest.setup.js
const { ReadableStream } = require('web-streams-polyfill');
global.ReadableStream = ReadableStream;