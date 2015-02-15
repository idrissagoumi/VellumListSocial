'use strict';

(function() {
	// Projets Controller Spec
	describe('Projets Controller Tests', function() {
		// Initialize global variables
		var ProjetsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Projets controller.
			ProjetsController = $controller('ProjetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Projet object fetched from XHR', inject(function(Projets) {
			// Create sample Projet using the Projets service
			var sampleProjet = new Projets({
				name: 'New Projet'
			});

			// Create a sample Projets array that includes the new Projet
			var sampleProjets = [sampleProjet];

			// Set GET response
			$httpBackend.expectGET('projets').respond(sampleProjets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projets).toEqualData(sampleProjets);
		}));

		it('$scope.findOne() should create an array with one Projet object fetched from XHR using a projetId URL parameter', inject(function(Projets) {
			// Define a sample Projet object
			var sampleProjet = new Projets({
				name: 'New Projet'
			});

			// Set the URL parameter
			$stateParams.projetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/projets\/([0-9a-fA-F]{24})$/).respond(sampleProjet);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projet).toEqualData(sampleProjet);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Projets) {
			// Create a sample Projet object
			var sampleProjetPostData = new Projets({
				name: 'New Projet'
			});

			// Create a sample Projet response
			var sampleProjetResponse = new Projets({
				_id: '525cf20451979dea2c000001',
				name: 'New Projet'
			});

			// Fixture mock form input values
			scope.name = 'New Projet';

			// Set POST response
			$httpBackend.expectPOST('projets', sampleProjetPostData).respond(sampleProjetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Projet was created
			expect($location.path()).toBe('/projets/' + sampleProjetResponse._id);
		}));

		it('$scope.update() should update a valid Projet', inject(function(Projets) {
			// Define a sample Projet put data
			var sampleProjetPutData = new Projets({
				_id: '525cf20451979dea2c000001',
				name: 'New Projet'
			});

			// Mock Projet in scope
			scope.projet = sampleProjetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/projets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/projets/' + sampleProjetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projetId and remove the Projet from the scope', inject(function(Projets) {
			// Create new Projet object
			var sampleProjet = new Projets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Projets array and include the Projet
			scope.projets = [sampleProjet];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/projets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjet);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projets.length).toBe(0);
		}));
	});
}());