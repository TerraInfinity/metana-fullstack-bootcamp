# Blog API - Metana Bootcamp Module 5

A RESTful API built with Node.js, Express, and MongoDB for managing users and blog posts.

## Features

- User authentication with JWT
- CRUD operations for users and blogs
- Password hashing for security
- Data validation using Mongoose schemas
- Protected routes for authenticated users

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local installation or MongoDB Atlas)
- Postman (for testing API endpoints)

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blog_api
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```
   Note: Replace the MongoDB URI with your own connection string.

### Running the Server

Development mode with auto-restart:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Users

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Blogs

- `POST /api/blogs` - Create a new blog (Protected)
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get a single blog
- `PUT /api/blogs/:id` - Update a blog (Protected - Author only)
- `DELETE /api/blogs/:id` - Delete a blog (Protected - Author only)

## Testing with Postman

1. Import the Postman collection from the `/postman` directory
2. Test all API endpoints
3. Verify that CRUD operations work as expected
4. Test authentication and authorization

## Project Structure

```
├── config/             # Configuration files
│   └── db.js           # Database connection
├── middleware/         # Custom middleware
│   └── authMiddleware.js # Authentication middleware
├── models/             # Mongoose models
│   ├── userModel.js    # User model
│   └── blogModel.js    # Blog model
├── routes/             # API routes
│   ├── userRoutes.js   # User routes
│   └── blogRoutes.js   # Blog routes
├── utils/              # Utility functions
│   └── generateToken.js # JWT generation
├── .env                # Environment variables (not in version control)
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── server.js           # Entry point
└── README.md           # Project documentation
```

## License

This project is part of the Metana Fullstack Bootcamp.
