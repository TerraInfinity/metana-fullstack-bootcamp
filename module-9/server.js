/**
 * Server configuration file.
 * This file sets up the Express application, connects to the database,
 * and imports route handlers for various functionalities, including OAuth support.
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const passport = require('./config/passport');

const userRoutes = require('./routes/backend/userRoutes');
const commentRoutes = require('./routes/backend/commentRoutes');
const blogRoutes = require('./routes/backend/blogRoutes');
const pathRoutes = require('./routes/backend/maintenance/pathRoutes');
const pointTypeRoutes = require('./routes/backend/maintenance/pointTypeRoutes');
const thumbnailRoutes = require('./routes/backend/thumbnailRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.REACT_APP_BACKEND_PORT || 5000;

// Connect to PostgreSQL
console.log('Attempting to connect to the database...');
connectDB()
    .then(() => {
        console.log('Database connection successful.');
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process if the connection fails
    });



// Compute CORS origin and trim any whitespace
const corsOrigin = `${process.env.REACT_APP_FRONTEND_ORIGIN}` + ':' + `${process.env.REACT_APP_FRONTEND_PORT}`.trim();
console.log('CORS Origin configured as:', corsOrigin);

// Middleware
app.use(cors({
    origin: corsOrigin, // e.g., http://localhost:3000
    credentials: true // Allow cookies/credentials if needed
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/paths', pathRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/pointTypes', pointTypeRoutes);
app.use('/api', thumbnailRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Blog API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});



// Start the server only if run directly
if (require.main === module) {
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${process.env.REACT_APP_BACKEND_PORT || 5000}`);
    });
}
module.exports = app;