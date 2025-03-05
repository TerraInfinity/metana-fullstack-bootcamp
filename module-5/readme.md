# REST API: Blog & User Management

This project is a RESTful API for managing users and blog posts. It includes features for user registration, authentication, profile management, and CRUD operations for blog posts.

## Prerequisites
* Node.js (v12.0.0 or higher)
* MongoDB Atlas account or local MongoDB installation
* Postman (for API testing)

## Features

*   **User Management:**
    *   User registration and authentication
    *   Secure password hashing with bcrypt
    *   JWT-based authentication
    *   Admin role for privileged operations
*   **Blog Management:**
    *   Create, read, update, and delete blog posts
    *   Authorization to ensure only authors or admins can modify posts
    *   Data validation for all inputs
*   **Security:**
    *   JWT authentication using Bearer tokens
    *   Password hashing to protect user credentials
    *   Admin role authorization for sensitive operations
*   **API Testing:**
    *   Comprehensive Postman collection for testing all endpoints

## Technologies

*   Node.js
*   Express
*   Mongoose
*   MongoDB
*   JSON Web Tokens (JWT)
*   bcrypt
*   dotenv
*   nodemon

## Setup

1.  **Clone the repository:**

    ```
    git clone --branch module-5 --single-branch https://github.com/TerraInfinity/metana-fullstack-bootcamp.git
    cd metana-fullstack-bootcamp/module-5
    ```

2.  **Install dependencies:**

    ```
    npm install
    ```

3.  **Configure environment variables:**

    *   Create a `.env` file in the project root.
    *   Add the following environment variables:

        ```
        PORT=5000           # Or any port you prefer
        MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster.go6j7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster
        || OR ||
        My default DB URI is, you can use this from .env: MONGO_URI=MONGODB_URI=mongodb+srv://blogadmin:QHKWbNFoLrbrR7jg@cluster.go6j7.mongodb.net/blog-node?retryWrites=true&w=majority&appName=Cluster

        JWT_SECRET=<Your_JWT_Secret>
        || OR ||
        My default is JWT_SECRET=M5yTsEpK6rJfq2XZ9A3DcN7Lgb8WvHh4    
        ```

    *   Replace `<MONGO_URI>` with your MongoDB connection string.
    *   Replace `<JWT_Secret>` with a secure secret key for JWT.

## Environment Variables
All environment variables with descriptions:
* `PORT` - Server port (default: 5000)
* `MONGODB_URI` - MongoDB connection string
* `JWT_SECRET` - Secret key for JWT token generation
* `JWT_EXPIRE` - Token expiration time (e.g., "30d" for 30 days)

## Running the Application

1.  **Start the server using Nodemon:**

    ```
    npm run dev
    ```

    This will start the server on the configured port (default: 5000). Nodemon automatically restarts the server when file changes are detected.

## API Testing with Postman

1.  **Import the Postman collection:**

    *   Open Postman.
    *   Click the "Import" button.
    *   Select the `REST API TESTING (Blog - User).postman_collection.json` file located in the project root.

2.  **Run the tests:**

    *   In Postman, select the imported collection.
    *   Click the "Run" button.
    *   Observe the test results to verify the API functionality.

## API Endpoints

The API includes the following endpoints:

*   `POST   /api/users/register` - Register a new user
*   `POST   /api/users/login` - Authenticate user and return a JWT
*   `GET    /api/users/profile` - Get user profile (requires authentication)
*   `PUT    /api/users/profile` - Update user profile (requires authentication)
*   `GET    /api/users` - Get all users (Admin only)
*   `DELETE /api/users/delete/:id` - Delete a specific user (Admin only)
*   `DELETE /api/users/delete-all` - Delete all non-admin users and their blogs (Admin only).
*   `POST   /api/blogs` - Create a new blog post (requires authentication)
*   `GET    /api/blogs` - Get all blog posts
*   `GET    /api/blogs/:id` - Get a specific blog post
*   `PUT    /api/blogs/:id` - Update a blog post (requires authentication and ownership)
*   `DELETE /api/blogs/:id` - Delete a blog post (requires authentication and ownership or admin privileges)
*   `DELETE /api/blogs/delete-all` - Delete all blogs (Admin only)
*   `DELETE /api/blogs/delete-all/:id` - Delete all blogs for a specific user (Admin only)
*   `DELETE /api/factory-reset` - Delete all data, including admins (Admin only)
*   `GET    /api/users/with-blogs` - Get all users with their associated blogs (Admin only)

## API Examples

### User Registration
**Request:**
```json
POST /api/users/register
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "JWT_TOKEN"
}
```

### Create Blog Post
**Request:**
```json
POST /api/blogs
Authorization: Bearer <JWT_TOKEN>
{
    "title": "My First Blog",
    "content": "Blog content here"
}
```

**Response:**
```json
{
    "id": "blog_id",
    "title": "My First Blog",
    "content": "Blog content here",
    "author": "user_id",
    "createdAt": "timestamp"
}
```

## Error Handling
The API implements standardized error responses:
* `400` - Bad Request (Invalid input data)
* `401` - Unauthorized (Invalid/missing authentication)
* `403` - Forbidden (Insufficient permissions)
* `404` - Not Found (Resource doesn't exist)
* `500` - Server Error

All error responses follow the format:
```json
{
    "message": "Error description here"
}
```

## Data Validation Rules

### User Model
* Name: Required, max 50 characters
* Email: Required, must be unique and valid email format
* Password: Required, minimum 6 characters

### Blog Model
* Title: Required, max 100 characters
* Content: Required
* Author: Required, must be valid user ID

## Development Guidelines

### Running in Development Mode
```bash
npm run dev
```

### Debugging
* Server logs are available in the console
* MongoDB connection status is logged on startup
* JWT token validation errors are logged

### Best Practices
* Always use Bearer token authentication for protected routes
* Keep JWT_SECRET secure and unique per environment
* Use appropriate HTTP methods for CRUD operations

## Security Considerations

### Authentication
* JWT tokens expire after the configured time
* Passwords are hashed using bcrypt with salt rounds of 10
* Admin privileges are required for sensitive operations

### API Security
* CORS is enabled and configurable
* Request body size is limited
* Input validation on all routes
* Protected routes require valid JWT tokens

## Important Notes and Considerations

*   **Admin Account Creation:** After running the `DELETE /api/factory-reset` endpoint, *all data, including admin accounts, will be deleted*.  You will need to manually create a new admin account after a factory reset.
*   **Authorization:**  Be sure to send the JWT in the `Authorization` header as a Bearer token for all protected routes.  For example: `Authorization: Bearer <JWT_TOKEN>`.
*   **Postman Tests:**
    *   The Postman collection provides comprehensive tests for all API endpoints.
    *   If tests are failing, ensure that:
        *   The server is running correctly.
        *   Environment variables are configured correctly in Postman (especially the `base_url`).
        *   You have the correct JWT tokens for testing protected routes.
        *   Check for any typos in the Postman test scripts, and that the variable names align to server data object.
*   **Troubleshooting "DELETE all users and blogs" in Postman:** If the  "DELETE all users and blogs" test is failing ensure that the variable names in POSTMAN is:
    1.  Ensure that the variable name in Postman is `deletedUsersCount` and not `DeletedUsersCount`
    2.  Ensure that the variable name in Postman is `deletedBlogsCount` and not `Beleteablogsunt`

## Troubleshooting

### Common Issues
1. **MongoDB Connection Fails**
   * Verify MongoDB URI is correct
   * Check network connectivity
   * Ensure IP whitelist includes your address

2. **JWT Token Issues**
   * Verify token format: `Bearer <token>`
   * Check token expiration
   * Ensure JWT_SECRET matches environment

3. **Admin Access Issues**
   * Verify user has admin privileges
   * Check token permissions
   * Ensure proper authorization headers

## License

MIT
