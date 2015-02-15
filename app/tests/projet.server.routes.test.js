'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Projet = mongoose.model('Projet'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projet;

/**
 * Projet routes tests
 */
describe('Projet CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Projet
		user.save(function() {
			projet = {
				name: 'Projet Name'
			};

			done();
		});
	});

	it('should be able to save Projet instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Projet
				agent.post('/projets')
					.send(projet)
					.expect(200)
					.end(function(projetSaveErr, projetSaveRes) {
						// Handle Projet save error
						if (projetSaveErr) done(projetSaveErr);

						// Get a list of Projets
						agent.get('/projets')
							.end(function(projetsGetErr, projetsGetRes) {
								// Handle Projet save error
								if (projetsGetErr) done(projetsGetErr);

								// Get Projets list
								var projets = projetsGetRes.body;

								// Set assertions
								(projets[0].user._id).should.equal(userId);
								(projets[0].name).should.match('Projet Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Projet instance if not logged in', function(done) {
		agent.post('/projets')
			.send(projet)
			.expect(401)
			.end(function(projetSaveErr, projetSaveRes) {
				// Call the assertion callback
				done(projetSaveErr);
			});
	});

	it('should not be able to save Projet instance if no name is provided', function(done) {
		// Invalidate name field
		projet.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Projet
				agent.post('/projets')
					.send(projet)
					.expect(400)
					.end(function(projetSaveErr, projetSaveRes) {
						// Set message assertion
						(projetSaveRes.body.message).should.match('Please fill Projet name');
						
						// Handle Projet save error
						done(projetSaveErr);
					});
			});
	});

	it('should be able to update Projet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Projet
				agent.post('/projets')
					.send(projet)
					.expect(200)
					.end(function(projetSaveErr, projetSaveRes) {
						// Handle Projet save error
						if (projetSaveErr) done(projetSaveErr);

						// Update Projet name
						projet.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Projet
						agent.put('/projets/' + projetSaveRes.body._id)
							.send(projet)
							.expect(200)
							.end(function(projetUpdateErr, projetUpdateRes) {
								// Handle Projet update error
								if (projetUpdateErr) done(projetUpdateErr);

								// Set assertions
								(projetUpdateRes.body._id).should.equal(projetSaveRes.body._id);
								(projetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Projets if not signed in', function(done) {
		// Create new Projet model instance
		var projetObj = new Projet(projet);

		// Save the Projet
		projetObj.save(function() {
			// Request Projets
			request(app).get('/projets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Projet if not signed in', function(done) {
		// Create new Projet model instance
		var projetObj = new Projet(projet);

		// Save the Projet
		projetObj.save(function() {
			request(app).get('/projets/' + projetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projet.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Projet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Projet
				agent.post('/projets')
					.send(projet)
					.expect(200)
					.end(function(projetSaveErr, projetSaveRes) {
						// Handle Projet save error
						if (projetSaveErr) done(projetSaveErr);

						// Delete existing Projet
						agent.delete('/projets/' + projetSaveRes.body._id)
							.send(projet)
							.expect(200)
							.end(function(projetDeleteErr, projetDeleteRes) {
								// Handle Projet error error
								if (projetDeleteErr) done(projetDeleteErr);

								// Set assertions
								(projetDeleteRes.body._id).should.equal(projetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Projet instance if not signed in', function(done) {
		// Set Projet user 
		projet.user = user;

		// Create new Projet model instance
		var projetObj = new Projet(projet);

		// Save the Projet
		projetObj.save(function() {
			// Try deleting Projet
			request(app).delete('/projets/' + projetObj._id)
			.expect(401)
			.end(function(projetDeleteErr, projetDeleteRes) {
				// Set message assertion
				(projetDeleteRes.body.message).should.match('User is not logged in');

				// Handle Projet error error
				done(projetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Projet.remove().exec();
		done();
	});
});