const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
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
const PORT = process.env.BACKEND_PORT || 5000;

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/paths', pathRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/pointTypes', pointTypeRoutes);
app.use('/api', thumbnailRoutes); // Add this line to mount thumbnail routes


// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Blog API' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;