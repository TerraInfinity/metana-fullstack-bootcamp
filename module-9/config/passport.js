const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const TwitterStrategy = require('@superfaceai/passport-twitter-oauth2').Strategy;
const User = require('../models/coreUserModel');

// Base URL for callback (optional, adjust based on your env setup)
const BASE_URL = `${process.env.REACT_APP_BACKEND_ORIGIN}:${process.env.REACT_APP_BACKEND_PORT}` || 'http://localhost:5000';

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/users/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by provider and providerId
        let user = await User.findOne({
          where: {
            providerId: profile.id,
            provider: 'google',
          },
        });

        if (!user) {
          // Create new user if none exists
          user = await User.create({
            email: profile.emails[0].value,
            providerId: profile.id,
            provider: 'google',
            name: profile.displayName,
          });
          console.log('Created new Google user:', user.toJSON());
        } else {
          console.log('Found existing Google user:', user.toJSON());
        }

        done(null, user);
      } catch (err) {
        console.error('Error in Google OAuth:', err);
        done(err, null);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.REACT_APP_GITHUB_CLIENT_ID,
      clientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/users/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          where: {
            providerId: profile.id,
            provider: 'github',
          },
        });

        if (!user) {
          user = await User.create({
            email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
            providerId: profile.id,
            provider: 'github',
            name: profile.displayName || profile.username,
          });
          console.log('Created new GitHub user:', user.toJSON());
        } else {
          console.log('Found existing GitHub user:', user.toJSON());
        }

        done(null, user);
      } catch (err) {
        console.error('Error in GitHub OAuth:', err);
        done(err, null);
      }
    }
  )
);

// Twitter Strategy (X.com)
passport.use(
  new TwitterStrategy(
    {
      clientID: process.env.REACT_APP_TWITTER_CLIENT_ID,
      clientSecret: process.env.REACT_APP_TWITTER_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/users/auth/twitter/callback`,
      clientType: 'confidential',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          where: {
            providerId: profile.id,
            provider: 'twitter',
          },
        });

        if (!user) {
          user = await User.create({
            email: profile.emails?.[0]?.value || `${profile.username}@x.com`,
            providerId: profile.id,
            provider: 'twitter',
            name: profile.displayName || profile.username,
          });
          console.log('Created new Twitter user:', user.toJSON());
        } else {
          console.log('Found existing Twitter user:', user.toJSON());
        }

        done(null, user);
      } catch (err) {
        console.error('Error in Twitter OAuth:', err);
        done(err, null);
      }
    }
  )
);

// Serialize and deserialize user for session support (optional)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id); // Use findByPk for Sequelize
    done(null, user);
  } catch (err) {
    console.error('Error deserializing user:', err);
    done(err, null);
  }
});

module.exports = passport;