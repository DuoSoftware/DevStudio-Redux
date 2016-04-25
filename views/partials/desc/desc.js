window.devportal.partials.desc = function($scope,$rootScope, $http, $dev, $state, $rootScope, $stateParams, $auth, $objectstore,$helpers, $fileReader){
	$scope.appKey = $stateParams.appKey;
	$scope.appCategories = window.devportal.categories;
	$scope.imageSrc = "appicons/default.png";

	$dev.project().get($stateParams.appKey).success(function(data){
		$scope.appDesc = data;
		$scope.imageSrc = "appicons/" + $scope.appKey +".png";
		console.log($scope.imageSrc);
		$dev.states().setIdle();
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving Project Details");
		$dev.states().setIdle();
	});


	$scope.edit = function(){$dev.navigation().edit($scope.appKey);}
	$scope.save = function(){
		$dev.project().edit($scope.appKey,$scope.appDesc).success(function(){
			localStorage.setItem("project:" + $scope.appKey, JSON.stringify($scope.appDesc));

			if ($scope.fileForm)
			$dev.project().iconUpload($scope.appKey,$scope.fileForm).success(angular.noop).error(function(){
				$dev.dialog().alert("Error uploading app icon");
			});
		}).error(function(){
			$dev.dialog().alert("Error updating app description");
		});
	}

    $scope.onFileSelect = function(file){
    	$scope.fileForm = file;
        $fileReader.readAsDataUrl(file, $scope).then(function(result,b,c) {
      		$scope.imageSrc = result;
      	});
    }

	$dev.navigation().title($scope.appKey);
}
