/**
 * @file user.test.js
 * @description This file contains tests for user-related API endpoints using Jest and Supertest.
 */

const request = require('supertest');
const app = require('../../server'); // Adjust path if needed
const coreUserModel = require('../../models/coreUserModel'); // Adjust path if needed

// Increase Jest timeout for tests
jest.setTimeout(30000); // 30 seconds

// Start the server for all tests
let server;

beforeAll((done) => {
    console.log('[SETUP] Starting server on port 3001...');
    console.log('Getting ready: Turning on a fake website server to test with...');

    // 3001 instead of 3000 to avoid conflicts with selenium
    server = app.listen(3001, () => {
        console.log('[SETUP] Server started successfully');
        done();
    });
});

afterAll((done) => {
    console.log('Cleaning up: Shutting down the fake server...');
    server.close(() => done());
});

// Mock the database connection to prevent real DB calls
jest.mock('../../config/db', () => {
    const mockModel = {
        findOne: jest.fn().mockImplementation((query) => {
            console.log(`[MOCK DB] findOne called with query: ${JSON.stringify(query)}`);
            return Promise.resolve(null); // Default return, overridden in tests
        }),
        findByPk: jest.fn().mockImplementation((id) => {
            console.log(`[MOCK DB] findByPk called with id: ${id}`);
            return Promise.resolve(null); // Default return
        }),
        create: jest.fn().mockImplementation((data) => {
            console.log(`[MOCK DB] create called with data: ${JSON.stringify(data)}`);
            return Promise.resolve(data); // Default return, overridden in tests
        }),
        update: jest.fn(),
        belongsTo: jest.fn(),
        hasMany: jest.fn()
    };
    // Mock init to return the mockModel itself
    mockModel.init = jest.fn((attributes, options) => mockModel);
    return {
        sequelize: {
            define: jest.fn(() => mockModel), // Return mockModel for all define calls
            authenticate: jest.fn().mockResolvedValue(),
            sync: jest.fn().mockResolvedValue(),
            close: jest.fn().mockResolvedValue()
        },
        connectDB: jest.fn().mockResolvedValue()
    };
});

// Mock user models and other dependencies as needed
jest.mock('../../models/coreUserModel', () => ({
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
}));

// Mock Passport to match api.test.js's working setup
jest.mock('../../config/passport', () => ({
    initialize: jest.fn(() => (req, res, next) => {
        console.log('[MOCK PASSPORT] passport.initialize called');
        next();
    }),
    use: jest.fn(), // Mock strategy registration
    serializeUser: jest.fn((user, done) => done(null, user.id)), // Mock serialization
    deserializeUser: jest.fn((id, done) => {
        const mockUser = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Test User' };
        require('../../models/coreUserModel').findByPk.mockResolvedValue(mockUser);
        done(null, mockUser);
    })
}));

// Mock jsonwebtoken for token generation
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mocked-token'), // Mock token creation
    verify: jest.fn((token, secret, callback) => callback(null, { id: '123e4567-e89b-12d3-a456-426614174000', role: 'user' }))
}));

// Set environment variables for JWT (if needed by server.js)
process.env.JWT_SECRET = 'test_secret';

// Define mock users with different roles
const mockUsers = {
    user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123', // Use plain password for registration
        role: 'user',
        matchPassword: jest.fn().mockResolvedValue(true)
    },
    editor: {
        id: '223e4567-e89b-12d3-a456-426614174001',
        name: 'Editor User',
        email: 'editoruser@example.com',
        password: 'password123',
        role: 'editor',
        matchPassword: jest.fn().mockResolvedValue(true)
    },
    creator: {
        id: '323e4567-e89b-12d3-a456-426614174002',
        name: 'Creator User',
        email: 'creatoruser@example.com',
        password: 'password123',
        role: 'creator',
        matchPassword: jest.fn().mockResolvedValue(true)
    },
    admin: {
        id: '423e4567-e89b-12d3-a456-426614174003',
        name: 'Admin User',
        email: 'adminuser@example.com',
        password: 'password123',
        role: 'admin',
        matchPassword: jest.fn().mockResolvedValue(true)
    }
};

// Mock pathsModel to handle belongsTo
jest.mock('../../models/common/pathsModel', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    belongsTo: jest.fn(), // Required for the association
    hasMany: jest.fn() // Add if other associations exist
}));

// Mock coreBlogModel since it's in the dependency chain
jest.mock('../../models/coreBlogModel', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn()
}));

// Mock blogCommentModel to ensure consistency
jest.mock('../../models/blogModel/blogCommentModel', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    belongsTo: jest.fn(),
    hasMany: jest.fn()
}));

// Registration tests
describe('User Registration', () => {
    /**
     * @test
     * @description Tests user registration for different roles.
     */
    it('should register a new user (user role)', async() => {
        console.log('[TEST] Starting registration test for user role');
        console.log('Starting test: Can a regular person sign up?');
        console.log('Step 1: Pretending to save a new user named Test User with email testuser@example.com...');
        coreUserModel.create.mockResolvedValue(mockUsers.user);
        console.log(`[TEST] Mocked create to return: ${JSON.stringify(mockUsers.user)}`);

        console.log('[TEST] Sending POST /api/users/register');
        console.log('Step 2: Asking the fake server to sign up Test User...');
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: mockUsers.user.name,
                email: mockUsers.user.email,
                password: mockUsers.user.password
            });

        console.log(`[TEST] Received response - Status: ${res.status}, Body: ${JSON.stringify(res.body)}`);
        console.log('Step 3: Checking what the server said back...');
        console.log(`The server replied with: "Sign-up worked!" and gave us: ${JSON.stringify(res.body)}`);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test User');
        expect(res.body).toHaveProperty('email', 'testuser@example.com');
        expect(res.body).toHaveProperty('role', 'user');
        expect(res.body).toHaveProperty('token');
    });

    it('should register a new user (editor role)', async() => {
        coreUserModel.create.mockResolvedValue(mockUsers.editor);
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: mockUsers.editor.name,
                email: mockUsers.editor.email,
                password: mockUsers.editor.password
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Editor User');
        expect(res.body).toHaveProperty('email', 'editoruser@example.com');
        expect(res.body).toHaveProperty('role', 'editor');
        expect(res.body).toHaveProperty('token');
    });

    it('should register a new user (creator role)', async() => {
        coreUserModel.create.mockResolvedValue(mockUsers.creator);
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: mockUsers.creator.name,
                email: mockUsers.creator.email,
                password: mockUsers.creator.password
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Creator User');
        expect(res.body).toHaveProperty('email', 'creatoruser@example.com');
        expect(res.body).toHaveProperty('role', 'creator');
        expect(res.body).toHaveProperty('token');
    });

    it('should register a new user (admin role)', async() => {
        coreUserModel.create.mockResolvedValue(mockUsers.admin);
        const res = await request(app)
            .post('/api/users/register')
            .send({
                name: mockUsers.admin.name,
                email: mockUsers.admin.email,
                password: mockUsers.admin.password
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Admin User');
        expect(res.body).toHaveProperty('email', 'adminuser@example.com');
        expect(res.body).toHaveProperty('role', 'admin');
        expect(res.body).toHaveProperty('token');
    });
});

// Login tests
describe('User Login', () => {
    /**
     * @test
     * @description Tests user login for different roles.
     */
    it('should return a token for valid login (user role)', async() => {
        console.log('Starting test: Can a regular user log in with the right info?');
        console.log('Step 1: Pretending to find Test User when they try to log in...');
        coreUserModel.findOne.mockResolvedValue(mockUsers.user);
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'testuser@example.com', password: 'password123' });
        console.log('Step 2: Asking the fake server to log in Test User with email testuser@example.com...');
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        console.log('Step 3: Checking what the server said back...');
        console.log(`The server replied with: "Login worked!" and gave us: ${JSON.stringify(res.body)}`);
    });

    it('should return a token for valid login (editor role)', async() => {
        coreUserModel.findOne.mockResolvedValue(mockUsers.editor);
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'editoruser@example.com', password: 'password123' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should return a token for valid login (creator role)', async() => {
        coreUserModel.findOne.mockResolvedValue(mockUsers.creator);
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'creatoruser@example.com', password: 'password123' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should return a token for valid login (admin role)', async() => {
        coreUserModel.findOne.mockResolvedValue(mockUsers.admin);
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'adminuser@example.com', password: 'password123' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async() => {
        coreUserModel.findOne.mockResolvedValue(null);
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'testuser@example.com', password: 'wrongpass' });
        expect(res.status).toBe(401);
    });
});