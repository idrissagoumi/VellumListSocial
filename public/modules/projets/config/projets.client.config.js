'use strict';

// Configuring the Articles module
angular.module('projets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Projets', 'projets', 'dropdown', '/projets(/create)?');
		Menus.addSubMenuItem('topbar', 'projets', 'List Projets', 'projets');
		Menus.addSubMenuItem('topbar', 'projets', 'New Projet', 'projets/create');
	}
]);