window.devportal.partials.projectdetail = function($scope, $rootScope, $http, $dev, $state, $stateParams, $auth, $objectstore, $helpers, $mdDialog, $mdMedia){
	
	$scope.appKey = $stateParams.appKey;
	
	$scope.appCategories = window.devportal.categories;

	$scope.editInfoBtnVisible = true;

	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

	$dev.project().get($stateParams.appKey).success(function(data){
		$scope.appDesc = data;
		console.log($scope.appDesc);
		$dev.states().setIdle();
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving Project Details");
		$dev.states().setIdle();
	});

	$scope.editProjectInfo = function(ev){

	    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

	    $mdDialog.show({
	    	scope: $scope.$new(),
			templateUrl: './views/partials/projectdetail/editProjectInfo.tmpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			fullscreen: useFullScreen
	    })
	    .then(function(answer) {
	      $scope.status = 'You said the information was.';
	    }, function() {
	      $scope.status = 'You cancelled the dialog.';
	    });

	    $scope.$watch(function() {
	      return $mdMedia('xs') || $mdMedia('sm');
	    }, function(wantsFullScreen) {
	      $scope.customFullscreen = (wantsFullScreen === true);
	    });
	};

	$scope.edit = function(){$dev.navigation().edit($scope.appKey);}
	$dev.navigation().title($scope.appKey, "Publish");
}

