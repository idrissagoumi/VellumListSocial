'use strict';

// Projets controller
angular.module('projets').controller('ProjetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projets',
	function($scope, $stateParams, $location, Authentication, Projets) {
		$scope.authentication = Authentication;
		$scope.citys = ['Rabat','Tanger','Tetouan','Fes','Marrakesh','Casablanca','Agadir'];

		// Create new Projet
		$scope.createProject = function() {
			// Create new Projet object
			var projet = new ProjetSchema ({
				projectName: this.projectName,
				projectDescription:this.projectDescription,
				'projectAdresses.city' :$scope.myCity
			});

			// Redirect after save
			projet.$save(function(response) {
				$location.path('projets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Projet
		$scope.removeProject = function(projet) {
			if ( projet ) { 
				projet.$remove();

				for (var i in $scope.projets) {
					if ($scope.projets [i] === projet) {
						$scope.projets.splice(i, 1);
					}
				}
			} else {
				$scope.projet.$remove(function() {
					$location.path('projets');
				});
			}
		};

		// Update existing Projet
		$scope.updateProject = function() {
			var projet = $scope.projet;

			projet.$update(function() {
				$location.path('projets/' + projet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Projets
		$scope.findProjects = function() {
			$scope.projets = Projets.query();
		};

		// Find existing Projet
		$scope.findOneProject = function() {
			$scope.projet = Projets.get({ 
				projetId: $stateParams.projetId
			});
		};
	}
]);
