/**
 * @file app.js
 * @description
 *   This file serves as the main entry point for the Express application.
 *   It sets up the Express server by configuring the Handlebars view engine with custom helpers,
 *   specifying directories for layouts and partials, and handling routes to render dynamic content.
 *
 *   Key responsibilities include:
 *     - Importing necessary modules (Express, express-handlebars, and path).
 *     - Configuring Handlebars to use a default layout (main.hbs) and providing custom helpers 
 *       (such as formatDate and ifEqual) for use in templates.
 *     - Serving static assets from the 'public' directory.
 *     - Defining routes for the home ('/') and about ('/about') pages with dynamic data.
 *     - Implementing global error handling to catch and render errors gracefully.
 *
 *   This file is reserved for server-side code, ensuring that all server-related logic is contained here.
 *
 *   In Relation to the Assignment:
 *     - Demonstrates integration of Express with Handlebars for dynamic content rendering.
 *     - Emphasizes the separation of concerns by isolating layout (main.hbs) from page-specific content.
 *     - Follows best practices by organizing middleware, routing, and error handling in a modular way.
 *
 * @module App
 */

// Grab the tools we need from our custom modules file
const modules = require('./modules'); // Loads our module bundle
const express = modules.express; // The Express framework for building the app
const exphbs = modules.exphbs; // Handlebars engine for rendering templates
const path = modules.path; // Helps with file paths

// Make a new Express app—our app starts here
const app = express(); // Creates the app we'll build on

// Set up Handlebars so we can render cool templates
const hbs = exphbs.create({
    extname: 'hbs', // Files end in .hbs (not .handlebars)
    defaultLayout: 'main', // Every page uses main.hbs as the base layout
    layoutsDir: path.join(__dirname, 'views', 'layouts'), // Where layouts (like main.hbs) live
    partialsDir: path.join(__dirname, 'views', 'partials'), // Where reusable bits (partials) are stored

    helpers: { // Custom functions for templates
        formatDate: (date) => { // Turns a date into a nice string (e.g., "2/27/2025")
            return new Date(date).toLocaleDateString();
        }
    }
});

// Tell Express to use Handlebars for rendering
app.engine('hbs', hbs.engine); // Links the .hbs extension to our Handlebars setup
app.set('view engine', 'hbs'); // Sets Handlebars as the default template engine
app.set('views', path.join(__dirname, 'views')); // Points to the views folder for templates

// Serve static files like CSS, JS, and images from 'public' (sets public as the root)
app.use(express.static(path.join(__dirname, 'public'))); // Makes public/ files available 

// Set up the routes—here's what happens when users visit URLs
app.get('/', (req, res) => { // When someone hits the homepage (/)
    res.render('pages/home', { title: 'MoodTodo - Home' }); // Show the home.hbs page with title "Home"
});

app.get(['/home', '/home.html', '/index', '/index.html'], (req, res) => { // Catch these URLs
    res.redirect('/'); // Send them back to the homepage (/)
});

app.get('/about', (req, res) => { // When someone visits /about
    res.render('pages/about', { title: 'About Us' }); // Show the about.hbs page with title "About Us"
});

app.get('/about-us', (req, res) => { // If they type /about-us
    res.redirect('/about'); // Redirect to /about instead
});

// Add routes to serve component templates
app.get('/templates/auth-components/:template', (req, res) => {
    const template = req.params.template;
    res.sendFile(path.join(__dirname, 'views', 'auth-components', template));
});

app.get('/templates/task-components/:template', (req, res) => {
    const template = req.params.template;
    res.sendFile(path.join(__dirname, 'views', 'task-components', template));
});

app.get('/templates/misc-components/:template', (req, res) => {
    const template = req.params.template;
    res.sendFile(path.join(__dirname, 'views', 'misc-components', template));
});


// Catch-all for 404s—when a page isn't found
app.use((req, res) => { // Runs for any unmatched URL
    res.status(404).render('errors/404', { title: 'Page Not Found' }); // Show 404.hbs with a 404 status
});

// Handle 500 errors—when something breaks
app.use((err, req, res, next) => { // Catches errors from earlier in the app
    console.error(err.stack); // Log the error details to the console
    res.status(500).render('errors/500', { title: 'Server Error' }); // Show 500.hbs with a 500 status
});

// Send the app to whoever needs it (like bin/www)
module.exports = app; // Exports the app so bin/www can start it