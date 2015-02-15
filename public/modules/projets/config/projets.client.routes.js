'use strict';

//Setting up route
angular.module('projets').config(['$stateProvider',
	function($stateProvider) {
		// Projets state routing
		$stateProvider.
		state('listProjets', {
			url: '/projets',
			templateUrl: 'modules/projets/views/list-projets.client.view.html'
		}).
		state('createProjet', {
			url: '/projets/create',
			templateUrl: 'modules/projets/views/create-projet.client.view.html'
		}).
		state('viewProjet', {
			url: '/projets/:projetId',
			templateUrl: 'modules/projets/views/view-projet.client.view.html'
		}).
		state('editProjet', {
			url: '/projets/:projetId/edit',
			templateUrl: 'modules/projets/views/edit-projet.client.view.html'
		});
	}
]);