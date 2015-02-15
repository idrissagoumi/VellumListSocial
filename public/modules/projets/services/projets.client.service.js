'use strict';

//Projets service used to communicate Projets REST endpoints
angular.module('projets').factory('Projets', ['$resource',
	function($resource) {
		return $resource('projets/:projetId', { projetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);