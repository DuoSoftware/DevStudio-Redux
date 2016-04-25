window.devportal.partials.home = function($scope, $dev, $state, $mdDialog, $timeout, $q, $log){

	var originatorEv;

	// $scope.appInventoryCollection = [
	// 	{
	// 		appID:"DW_app_id_001",
	// 		appTitle:"My Studio",
	// 		appStatus:"Published",
	// 		appDescription:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
	// 		appIcon:"images/1454585549_laptop.png",
	// 	},
	// 	{
	// 		appID:"DW_app_id_002",
	// 		appTitle:"My Light",
	// 		appStatus:"Published",
	// 		appDescription:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
	// 		appIcon:"images/1454585579_match.png",
	// 	},
	// 	{
	// 		appID:"DW_app_id_003",
	// 		appTitle:"My Games",
	// 		appStatus:"Published",
	// 		appDescription:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, laboris nisi.",
	// 		appIcon:"images/1454585589_bowling.png",
	// 	},
	// 	{
	// 		appID:"DW_app_id_004",
	// 		appTitle:"My Entertainment",
	// 		appStatus:"Published",
	// 		appDescription:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
	// 		appIcon:"images/1454585599_theatre.png",
	// 	}
	// ];

	//home page auto complete config data
	$scope.simulateQuery = false;
	$scope.isDisabled = false;
	$scope.noCache = true;
	$scope.searchText = null;
	$scope.selectedItemChange = selectedItemChange;
	$scope.searchTextChange = searchTextChange;

	//load all projects from the object store
	$dev.project().all().success(function(data){
		$scope.projects = data;
		console.log($scope.projects);
		$dev.states().setIdle();
	}).error(function(data){
		$dev.dialog().alert ("Error Retrieving all projects");
		$dev.states().setIdle();
	});

	// Store retrived projects in local storage

	function ls(p){localStorage.setItem("project:" + p.appKey, JSON.stringify(p));};

	//bind querySearch function
	$scope.querySearch = querySearch;

	function querySearch (query){
		var results = query ? $scope.projects.filter( createFilterFor(query) ) : $scope.projects,
				deferred;
		if ($scope.simulateQuery) {
			deferred = $q.defer();
			$timeout(function() { deferred.resolve(results); }, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}

	//function to handle text change

	function searchTextChange(text) {
		$log.info('Text changed to' + text);
	}

	//function to handle item change

	function selectedItemChange(item) {
		$log.info('Item changed to' + JSON.stringify(item));
	}

	//create filter function for a query string

	function createFilterFor(query) {
		var lowerCaseQuery = angular.lowercase(query);
		return function filterFn(item){
			return (item.value.indexOf(lowerCaseQuery) === 0);
		};
	}

	//Create a new project on the fly

	$scope.newProject = function(project){
		console.log("This project needs to be created !"+ project);
	};

	$scope.openInventoryAppActions = function($mdOpenMenu, ev){
		console.log('here we are !');
		originatorEv = ev;
		$mdOpenMenu(ev);
	};

	$scope.download = function(p){$dev.project().download(p.appKey, p.name + ".zip");};
	$scope.edit = function(p){ls(p); $state.go(p.editor ? p.editor : "edit", {appKey: p.appKey});};
	$scope.publish = function(p){ls(p);$state.go("publish", {appKey:p.appKey});};
	$scope.run = function(p){ls(p);$state.go("run",{appKey:p.appKey});};
	$scope.share = function(p){ls(p);$state.go("share",{appKey:p.appKey});};
	$scope.delete = function(p){};
	$scope.navigateProjectInfo = function(p){ls(p);$state.go("projectdetail",{appKey:p.appKey});};

	$dev.navigation().title();
}
