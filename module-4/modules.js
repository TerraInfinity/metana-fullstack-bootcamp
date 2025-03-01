// In this file we require all of our modules and group them.
// Here we require the people file.
const http = require('http');

// Import required modules: Express for the web framework, express-handlebars for templating, and path for file path utilities.
const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const apiRoutes = require('./routes/api');

module.exports = {
    http: http,
    express: express,
    exphbs: exphbs,
    fs: fs,
    _: _,
    path: path,
    apiRoutes: apiRoutes,
    // Add other modules if needed. e.g.,

};

const os = require('os');
console.log(os.platform(), os.homedir());