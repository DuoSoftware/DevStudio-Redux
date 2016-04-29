window.devportal.partials.stepper = function($scope, $auth, $dev, $state, $stateParams, $fileReader, $timeout){
	
	//wizard steps configuration

	$scope.templateScreen;

	$scope.initializeProject = true;

	//wizard step index
	$scope.wizardCurrentStep = 1;

	//new project data initialization variable
	$scope.newProjectData = {
		pdparams:{
			projectType:"",
			description:{},
			requirements:{},
			templates:{}
		}
	};

	$scope.newProjectData.pdparams.requirements.owner = $auth.getUserName();

	//project type configuration
	$scope.projectTypes = [{typeName:"application",typeIcon:"views/images/math-compass.png",typeStyle:""},{typeName:"smoothflow",typeIcon:"views/images/smooth-flow.png",typeStyle:"opacity:0.35;"},{typeName:"bundle",typeIcon:"views/images/package-variant-closed.png",typeStyle:""}];


	$scope.selectedprojectTypeCategory;

	$scope.categoryTemplates;

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

		// fetching all project type categories
		$dev.templates()
			.categories()
			.success(function(data){
				$scope.projectTypeCategories = data;
				console.log($scope.projectTypeCategories);
			})
			.error(function(data){
				$scope.error = "";
			});

	//utility function end

	$scope.fetchRelatedTemplates = function(category){
		var tempcategoryobject = JSON.parse(category);
		selectCategory(tempcategoryobject);

		$scope.templateScreen = tempcategoryobject.folder;
		//folder fetch templates of category
		$dev.templates()
			.templates($scope.templateScreen)
			.success(function(data){$scope.categoryTemplates = data; console.log(data)})
			.error(function(data){$scope.error = "";});
	};

	//wizard initialization variables
	$scope.isLoading = false;

	// wizard forward navigation
	$scope.stepForward = function() {
	    $scope.isLoading = true;
	    logProjectDetails();
	    $timeout(function() {
	      $scope.isLoading = false;
	      $scope.myController.step = $scope.myController.step+1;
	    }, 1000);
  	};

  	// wizard backward navigation
  	$scope.stepBackward = function() {
	    $scope.myController.step = $scope.myController.step-1;
  	};

  	var logProjectDetails = function(){
  		console.log($scope.newProjectData);
  	};


	//available projects details
	$scope.projects = {};

	//contextView default

	$scope.projInitContext = "projOptSelctView";

	$scope.switchProjInitContext = function(slctView){
		$scope.projInitContext = slctView;
	};

	$scope.projectTypeSelect = function(optProject){
		$scope.switchProjInitContext(optProject);
		$scope.projectType = optProject;
	};

	//project types
	// $scope.projectTypes = ["template", "upload", "bundle"];

	$scope.selectProjectType = function(type){
		$scope.projectTypeSelect = true;
		$scope.projectState.pdparams.templates.category = type;
	};

	
	//wizard ui hook for category selection
	var selectCategory = function(category){
		$scope.newProjectData.pdparams.templates.category = category;
	}

	//wizard ui hook for template selection
	$scope.selectTemplate = function(template){
		$scope.newProjectData.pdparams.projectType = "template";
		$scope.newProjectData.pdparams.templates.template = template;
		$scope.initializeProject = false;
		$scope.isLoading = true;
	    $timeout(function() {
	      $scope.isLoading = false;
	      $scope.myController.step = $scope.myController.step+1;
	    }, 1000);
	}

	$scope.getKeys = function(){
		$dev.project()
		.getKeys($scope.newProjectData.pdparams.description.title)
		.success(function(data){
			$scope.newProjectData.pdparams.description.appKey = data.app;
			$scope.newProjectData.pdparams.description.secretKey= data.secret;
		})
		.error(function(data){
			$dev.dialog().alert ("Error getting app/secret keys");
		});
	}

	$scope.submitnewprojectDetails = function(){
		$dev.project()
			.create($scope.newProjectData)
			.success(function(data){
				var key = $scope.newProjectData.pdparams.description.appKey
			})
	};

	// watch for file upload

	$scope.$watch('projectsourceupload.length',function(newVal,oldVal){
		//todo implement upload validation here !
		// if($scope.projectsourceupload === ){
		// 	console.log('not yet bro');
		// }else{
		// 	$scope.newProjectData.pdparams.projectType = "upload";
		// 	console.log('there !');
		// }
	});

	$scope.imagePreview;

	//test file upload
	$scope.$watch('projectImage.length',function(newVal,oldVal){
		console.log($scope.projectImage);
		angular.forEach($scope.projectImage, function(obj){
			$scope.imagePreview = obj;
		});
	});

	$scope.finalizeCreateProject = function(){
		
		$dev.project()
			.create($scope.newProjectData)
			.success(function(data){
				console.log(data);
				var key = $scope.newProjectData.pdparams.description.appKey;
		  //   	$dev.project().iconUpload(key,$scope.fileForm ? $scope.fileForm : "N/A").success(function(){
		  //   		var ptype = $scope.projectState.pdparams.projectType;
		  //   		switch (ptype){
		  //   			case "upload":
				// 			$dev.editor().upload(key, "/upload.zip", $scope.zipFileForm).success(function(){
				// 				nav(key);
				// 			}).error(function(){
				// 				$dev.dialog().alert ("Error Uploading Zip File");
				// 			});		
		  //   				break;
		  //   			default:
		  //   				nav(key);
		  //   				break;
		  //   		}

		  //   	}).error(function(){
				// 	$dev.dialog().alert ("Error uploading icon");
		  //   	});

			})
			.error(function(data){
				// $dev.dialog().alert ("Error Creating Project");
				// $scope.error = "";
				alert('cant create project !');
				console.log(data);
			});
	}
}
