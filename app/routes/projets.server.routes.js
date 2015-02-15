'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projets = require('../../app/controllers/projets.server.controller');

	// Projets Routes
	app.route('/projets')
		.get(projets.list)
		.post(users.requiresLogin, projets.create);

	app.route('/projets/:projetId')
		.get(projets.read)
		.put(users.requiresLogin, projets.hasAuthorization, projets.update)
		.delete(users.requiresLogin, projets.hasAuthorization, projets.delete);

	// Finish by binding the Projet middleware
	app.param('projetId', projets.projetByID);
};
