window.devportal.partials.stepper = function($scope,$rootScope, $http, $dev, $state, $rootScope, $stateParams, $auth, $objectstore,$helpers, $fileReader){
	
	//wizard steps
	$scope.wizardSteps = [
		{'step':1,'steplabel':'project details','validity':false},
		{'step':2,'steplabel':'project documentation','validity':false},
		{'step':3,'steplabel':'project type','validity':false},
		{'step':4,'steplabel':'complete setup','validity':false}
	];

	//wizard current step
	$scope.wizardCurrentStep = 1;

	//utility function start

		//fetch existing projects
		$dev.project().all().success(function(data){
			$scope.projects = data;
			console.log($scope.projects);
			$dev.states().setIdle();
		}).error(function(data){
			$dev.dialog().alert ("Error Retrieving all projects");
			$dev.states().setIdle();
		});

		//fetch project categories
		$scope.appCategories = window.devportal.categories;

	//utility function end
	

	//initial hidden variable
	$scope.projectTypeSelect = false;

	//project type selection variable
	$scope.typeOptionSeclected = "Application";

	$scope.initiatesource = false;
	$scope.selectApplicationType = "";

	$scope.projectCreationData = {};

	//available projects details
	$scope.projects = {};

	//project type view show

	$scope.projectTypeView = "mainTypeView";

	$scope.changeProjectTypeView = function(contextView){
		$scope.projectTypeView = contextView;
	};

	//project types
	$scope.projectTypes = ["template", "upload", "bundle"];

	$scope.selectProjectType = function(type){
		$scope.projectTypeSelect = true;
		$scope.projectState.pdparams.templates.category = type;
	};


	var lsState = localStorage.getItem("createProjectState");
	if (lsState) {
		$scope.projectState = JSON.parse(lsState);
	}
	else {
		$scope.projectState = {
			state:"predevelop",
			pdparams: { projectType:"template", description: {},requirements: {}, templates:{}}
		};
	}

	$scope.$watch("projectState.pdparams.templates.category", function(){
		if ($scope.projectState.pdparams.templates.category)
		$dev.templates()
			.templates($scope.projectState.pdparams.templates.category.folder)
			.success(function(data){$scope.catTemplates = data;})
			.error(function(data){$scope.error = "";});
	});


	//objectstore fetch template and category
	$dev.templates()
		.categories()
		.success(function(data){$scope.categories = data;})
		.error(function(data){$scope.error = "";});
	

	//wizard ui hook for category selection
	$scope.selectCategory = function(cat){$scope.projectState.pdparams.templates.category = cat;}

	//wizard ui hook for template selection
	$scope.selectTemplate = function(cat){$scope.projectState.pdparams.templates.template = cat;}


	// $scope.$watch("projectState.pdparams.wpi", function(){
	// 	if (!$scope.projectState.pdparams.wpi) $scope.projectState.pdparams.wpi = 0;
	// 	$scope.projectState.pdparams.wizardPage = $scope.wizardPages[$scope.projectState.pdparams.wpi];
	// 	localStorage.setItem("createProjectState", JSON.stringify($scope.projectState));
	// });

	$scope.getKeys = function(){
		$dev.project()
		.getKeys($scope.projectState.pdparams.description.title)
		.success(function(data){
			$scope.projectState.pdparams.description.appKey = data.app;
			$scope.projectState.pdparams.description.secretKey= data.secret;
		})
		.error(function(data){
			$dev.dialog().alert ("Error getting app/secret keys");
		});
	}

	$scope.displayProjectDetails = function(){
		console.log($scope.projectState.pdparams);
	}

}
