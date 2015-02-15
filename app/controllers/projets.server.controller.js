'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Projet = mongoose.model('Projet'),
	_ = require('lodash');

/**
 * Create a Projet
 */
exports.create = function(req, res) {
	var projet = new Projet(req.body);
	projet.user = req.user;

	projet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projet);
		}
	});
};

/**
 * Show the current Projet
 */
exports.read = function(req, res) {
	res.jsonp(req.projet);
};

/**
 * Update a Projet
 */
exports.update = function(req, res) {
	var projet = req.projet ;

	projet = _.extend(projet , req.body);

	projet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projet);
		}
	});
};

/**
 * Delete an Projet
 */
exports.delete = function(req, res) {
	var projet = req.projet ;

	projet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projet);
		}
	});
};

/**
 * List of Projets
 */
exports.list = function(req, res) { 
	Projet.find().sort('-created').populate('user', 'displayName').exec(function(err, projets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(projets);
		}
	});
};

/**
 * Projet middleware
 */
exports.projetByID = function(req, res, next, id) { 
	Projet.findById(id).populate('user', 'displayName').exec(function(err, projet) {
		if (err) return next(err);
		if (! projet) return next(new Error('Failed to load Projet ' + id));
		req.projet = projet ;
		next();
	});
};

/**
 * Projet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.projet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
