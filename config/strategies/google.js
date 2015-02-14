'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function() {
	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID:'736341876521-v8fvqrra6b3frlsfpa4m5cfrrrjb8tdm.apps.googleusercontent.com' ,
			clientSecret: 'TjnbyWVq_9-wfqkHIIt1raBE',
			callbackURL: 'http://localhost:3000/auth/google/callback',
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'google',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};
