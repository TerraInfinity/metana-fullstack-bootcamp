/**
 * @file passport.js
 * @description Configuration for OAuth authentication using Passport.js. 
 * This file sets up strategies for Google, GitHub, and Twitter, 
 * handling user authentication and session management.
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const TwitterStrategy = require('@superfaceai/passport-twitter-oauth2').Strategy;
const User = require('../models/coreUserModel');

// Base URL configuration with fallback
const BASE_URL = process.env.REACT_APP_BACKEND_ORIGIN ?
    `${process.env.REACT_APP_BACKEND_ORIGIN}:${process.env.REACT_APP_BACKEND_PORT || 5000}` :
    'http://localhost:5000';

/**
 * Common authentication handler for all OAuth providers.
 * This function processes the user profile returned by the OAuth provider,
 * checks if the user exists in the database, and creates a new user if not.
 * 
 * @async
 * @function handleAuth
 * @param {string} provider - The name of the OAuth provider ('google', 'github', 'twitter').
 * @param {Object} profile - The user profile data returned by the OAuth provider.
 * @param {Function} done - Callback function provided by Passport to signal completion.
 * @returns {Promise<void>} - Resolves with the authentication result.
 * @throws {Error} - Throws an error if the profile data is invalid or if authentication fails.
 */
const handleAuth = async(provider, profile, done) => {
    try {
        // Validate profile data
        if (!profile || !profile.id) {
            throw new Error('Invalid profile data received');
        }

        let user = await User.findOne({
            where: {
                providerId: profile.id,
                provider,
            },
        });

        const email = (profile.emails && profile.emails.length > 0 && profile.emails[0].value) ||
            (provider === 'github' ? `${profile.username}@github.com` :
                provider === 'twitter' ? `${profile.username}@x.com` : null);

        if (!user) {
            if (!email) {
                throw new Error('No email provided and no fallback available');
            }

            user = await User.create({
                email,
                providerId: profile.id,
                provider,
                name: profile.displayName || profile.username || 'Unknown User',
                lastLogin: new Date(),
            });
            console.log(`Created new ${provider} user:`, user.toJSON());
        } else {
            // Update last login
            await user.update({ lastLogin: new Date() });
            console.log(`Found existing ${provider} user:`, user.toJSON());
        }

        return done(null, user);
    } catch (err) {
        console.error(`Error in ${provider} OAuth:`, err);
        return done(err, null);
    }
};

/**
 * Google OAuth strategy configuration.
 * This strategy uses the handleAuth function to process authentication results 
 * and manage user sessions.
 */
passport.use(new GoogleStrategy({
        clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/users/auth/google/callback`,
        scope: ['profile', 'email'],
    }, (accessToken, refreshToken, profile, done) =>
    handleAuth('google', profile, done)
));

/**
 * GitHub OAuth strategy configuration.
 * This strategy utilizes the handleAuth function to handle authentication results 
 * and user session management.
 */
passport.use(new GitHubStrategy({
        clientID: process.env.REACT_APP_GITHUB_CLIENT_ID,
        clientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/users/auth/github/callback`,
        scope: ['user:email'],
    }, (accessToken, refreshToken, profile, done) =>
    handleAuth('github', profile, done)
));

/**
 * Twitter OAuth strategy configuration.
 * This strategy employs the handleAuth function to process authentication results 
 * and manage user sessions.
 */
passport.use(new TwitterStrategy({
        clientID: process.env.REACT_APP_TWITTER_CLIENT_ID,
        clientSecret: process.env.REACT_APP_TWITTER_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/users/auth/twitter/callback`,
        clientType: 'confidential',
        scope: ['tweet.read', 'users.read'],
    }, (accessToken, refreshToken, profile, done) =>
    handleAuth('twitter', profile, done)
));

/**
 * Passport session serialization.
 * This function stores the user ID in the session to minimize overhead.
 * 
 * @param {Object} user - The user object to be serialized.
 * @param {Function} done - Callback function to complete the serialization process.
 */
passport.serializeUser((user, done) => {
    done(null, user.id);
});

/**
 * Passport session deserialization.
 * This function retrieves the full user object from the database based on the stored user ID.
 * 
 * @async
 * @param {number|string} id - The user ID stored in the session.
 * @param {Function} done - Callback function to complete the deserialization process.
 * @returns {Promise<void>} - Resolves with the deserialization result.
 */
passport.deserializeUser(async(id, done) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return done(new Error('User not found'));
        }
        done(null, user);
    } catch (err) {
        console.error('Error deserializing user:', err);
        done(err, null);
    }
});

module.exports = passport;