var microKernelModule = angular.module('uiMicrokernel', []);

microKernelModule.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


microKernelModule.factory('$v6Cookie', function() {

	function createCookie(name,value,days){
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+ date.toGMTString();
		}
		var cookieString =name+"="+value+expires+";"; 
		document.cookie = cookieString;
	}
	
	return {
			set: function(name,value,days) {
				createCookie(name,value,days);
			},

			get: function (name) {
			    var nameEQ = name + "=";
			    var ca = document.cookie.split(';');
			    for(var i=0;i < ca.length;i++) {
			        var c = ca[i];
			        while (c.charAt(0)==' ') c = c.substring(1,c.length);
			        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			    }
			    return null;
			},

			delete: function (name) {
			    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			}
	};
});


microKernelModule.factory('$v6md5', function() {
	var hex_chr = "0123456789abcdef";
	function rhex(num){
	  str = "";
	  for(j = 0; j <= 3; j++)
	    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
	           hex_chr.charAt((num >> (j * 8)) & 0x0F);
	  return str;
	}

	function str2blks_MD5(str){
	  nblk = ((str.length + 8) >> 6) + 1;
	  blks = new Array(nblk * 16);
	  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
	  for(i = 0; i < str.length; i++)
	    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
	  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
	  blks[nblk * 16 - 2] = str.length * 8;
	  return blks;
	}

	function add(x, y){
	  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	  return (msw << 16) | (lsw & 0xFFFF);
	}

	function rol(num, cnt){
	  return (num << cnt) | (num >>> (32 - cnt));
	}

	function cmn(q, a, b, x, s, t){
	  return add(rol(add(add(a, q), add(x, t)), s), b);
	}

	function ff(a, b, c, d, x, s, t){
	  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	
	function gg(a, b, c, d, x, s, t){
	  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function hh(a, b, c, d, x, s, t){
	  return cmn(b ^ c ^ d, a, b, x, s, t);
	}

	function ii(a, b, c, d, x, s, t){
	  return cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	function calcMD5(str){
	  x = str2blks_MD5(str);
	  a =  1732584193;
	  b = -271733879;
	  c = -1732584194;
	  d =  271733878;

	  for(i = 0; i < x.length; i += 16){
	    olda = a;
	    oldb = b;
	    oldc = c;
	    oldd = d;

	    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
	    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
	    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
	    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
	    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
	    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
	    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
	    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
	    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
	    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
	    c = ff(c, d, a, b, x[i+10], 17, -42063);
	    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
	    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
	    d = ff(d, a, b, c, x[i+13], 12, -40341101);
	    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
	    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

	    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
	    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
	    c = gg(c, d, a, b, x[i+11], 14,  643717713);
	    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
	    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
	    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
	    c = gg(c, d, a, b, x[i+15], 14, -660478335);
	    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
	    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
	    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
	    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
	    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
	    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
	    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
	    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
	    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
	    
	    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
	    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
	    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
	    b = hh(b, c, d, a, x[i+14], 23, -35309556);
	    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
	    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
	    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
	    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
	    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
	    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
	    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
	    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
	    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
	    d = hh(d, a, b, c, x[i+12], 11, -421815835);
	    c = hh(c, d, a, b, x[i+15], 16,  530742520);
	    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

	    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
	    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
	    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
	    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
	    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
	    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
	    c = ii(c, d, a, b, x[i+10], 15, -1051523);
	    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
	    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
	    d = ii(d, a, b, c, x[i+15], 10, -30611744);
	    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
	    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
	    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
	    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
	    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
	    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

	    a = add(a, olda);
	    b = add(b, oldb);
	    c = add(c, oldc);
	    d = add(d, oldd);
	  }
	  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
	}
 
	return {
			hash: function(str) {
				return calcMD5(str);
			}
	};
});

microKernelModule.factory('$helpers', function($rootScope, $v6md5, $v6Cookie) {

	function AsyncTask(action,success,fail){

		var actionFunc = action	;
		var successFunc = success;
		var failFunc = fail;

		function start(data, taskObject) {
			actionFunc(data, taskObject);
		}

		var taskObject = {
			start:function(data){ 
        		start(data, taskObject); 
			},
			endError: function(data){
                 $rootScope.$apply(function() {
            		failFunc(data); 
                });
			},
			endSuccess:function(data){ 
				
                $rootScope.$apply(function() {
            		successFunc(data);
                });
			}
		};

		return taskObject;

	}

	function task(actionFunc,successFunc,failFunc,inputs){
		var newTask = new AsyncTask(actionFunc,successFunc,failFunc);
		newTask.start(inputs);
	}

	return {
		task: function(actionFunc,successFunc,failFunc){ task(actionFunc,successFunc,failFunc); },
		safeApply: function(fn){
             if (fn && typeof fn === 'function'){
	             var phase = $rootScope.$$phase;
	             if (phase == '$apply' || phase == '$digest') {
						fn();
	             } else {
     				$rootScope.$apply(function(){
						fn();	
					});
	             }
	         }
		},
		getHash: function (str){
			return $v6md5.hash(str)
		},
		getCookie: function(name){
			return $v6Cookie.get(name);
		},
		setCookie: function(name,value,days){
			$v6Cookie.set(name,value,days);
		},
		removeCookie: function(name){
			$v6Cookie.delete(name);
		}
	}

});


microKernelModule.factory('$objectstore', function($http, $v6urls,$auth,$backdoor) {
  
	function ObjectStoreClient(_namespace,_class){

		var namespace = _namespace;
		var cls = _class;
		var onGetOne;
		var onGetMany;
		var onComplete;
		var onError;

		function insertLogic(data,parameters){

			var mainObject = null;
			if(angular.isArray(data))
				mainObject = {Parameters : parameters, Objects : data};
			else
				mainObject = {Parameters : parameters, Object : data};


			$http.post($v6urls.objectStore + '/' + namespace + '/' + cls,mainObject, {headers:{"securityToken" : $auth.getSecurityToken()}}).
			  success(function(data, status, headers, config) {
			  	if (onComplete)
			  		onComplete(data);				  	
			  }).
			  error(function(data, status, headers, config) {
			  	if (onError){
			  		$backdoor.log("Error inserting to Object Store");
			  		$backdoor.log(data);
			  		onError(data)
			  	}

			  	/*
			  	if (onComplete){
			  		if (data)
			  			onComplete(data);
			  		else
			  			onComplete({isSuccess:false, message:"Unknown Error!!!"});
			  	}
				*/

			  });
		}

		return {
			getByKeyword: function(keyword,parameters){
				$http.get($v6urls.objectStore + '/' + namespace + '/' + cls + '?keyword=' + keyword,{headers:{"securityToken" : $auth.getSecurityToken()}}).
				  success(function(data, status, headers, config) {
				  	if (onGetMany)
				  		onGetMany(data);				  	
				  }).
				  error(function(data, status, headers, config) {
				  	if (onError){
				  		$backdoor.log("Error retrieveing by keyword from Object Store");
			  			$backdoor.log(data);
				  		onError(data)
				  	}

				  	if (onGetMany)
				  		onGetMany();
				  });
			},
			getByKey: function(key){
				$http.get($v6urls.objectStore + '/' + namespace + '/' + cls + '/' + key,{headers:{"securityToken" : $auth.getSecurityToken()}}).
				  success(function(data, status, headers, config) {
				  	if (onGetOne)
				  		onGetOne(data);				  	
				  }).
				  error(function(data, status, headers, config) {
				  	if (onError){
				  		$backdoor.log("Error retrieveing by unique key from Object Store");
			  			$backdoor.log(data);
				  		onError()
				  	}

				  });
			},
			getAll: function(parameters){
				
			},
			getByFiltering: function(filter,parameters){
				//,"Content-Type":"application/json"
				$http.post($v6urls.objectStore + '/' + namespace + '/' + cls ,{"Query" : {"Type" : "Query", "Parameters": filter}}, {headers:{"securityToken" : $auth.getSecurityToken()}}).
				  success(function(data, status, headers, config) {
				  	if (onGetMany)
				  		onGetMany(data);				  	
				  }).
				  error(function(data, status, headers, config) {
				  	if (onError){
				  		$backdoor.log("Error retrieveing by query from Object Store");
			  			$backdoor.log(data);
				  		onError()
				  	}
				  });
			},
			getClasses: function(namespace){
				$http.post($v6urls.objectStore + '/' + namespace  ,{"Special":{"Type":"getClasses", "Parameters":""}}, {headers:{"securityToken" : $auth.getSecurityToken()}}).
				  success(function(data, status, headers, config) {
				  	if (onGetMany)
				  		onGetMany(data);				  	
				  }).
				  error(function(data, status, headers, config) {
				  	if (onError){
				  		$backdoor.log("Error retrieveing by query from Object Store");
			  			$backdoor.log(data);
				  		onError()
				  	}
				  });
			},
			getFields:function(namespace,cls){
				$http.post($v6urls.objectStore + '/' + namespace + '/' + cls ,{"Special":{"Type":"getFields", "Parameters":""}}, {headers:{"securityToken" : $auth.getSecurityToken()}}).
				  success(function(data, status, headers, config) {
				  	if (onGetMany)
				  		onGetMany(data);				  	
				  }).
				  error(function(data, status, headers, config) {
				  	if (onError){
				  		$backdoor.log("Error retrieveing by query from Object Store");
			  			$backdoor.log(data);
				  		onError()
				  	}
				  });
			},
			getSelected: function(parameters){
				$http.post($v6urls.objectStore + '/' + namespace + '/' + cls ,{"Special":{"Type":"getSelected", "Parameters":parameters}}, {headers:{"securityToken" : $auth.getSecurityToken()}}).
				  success(function(data, status, headers, config) {
				  	if (onGetMany)
				  		onGetMany(data);				  	
				  }).
				  error(function(data, status, headers, config) {
				  	if (onError){
				  		$backdoor.log("Error retrieveing by query from Object Store");
			  			$backdoor.log(data);
				  		onError()
				  	}
				  });
			},
			insert: function(data,parameters){
				insertLogic(data,parameters);
			},
			update: function(data,parameters){
				insertLogic(data,parameters);
			},
			delete: function(data,parameters){

			},
			onGetOne: function(func){ onGetOne = func },
			onGetMany:function(func){ onGetMany = func },
			onComplete:function(func){ onComplete = func },
			onError: function(func){ onError = func}
		}
	}


	return {
  		getClient:function(namespace,cls){
  			var req = new ObjectStoreClient(namespace,cls);
  			return req;
  		}
  	}
});

microKernelModule.factory('$events', function($rootScope){
	return {
		subscribe: function(){

		}
	}
});

microKernelModule.factory('$auth', function($http, $v6urls, $backdoor, $v6Cookie, $rootScope) {
 
 	var sessionInfo;
 	var userName;
 	var securityToken;
	var onLoggedInResultEvent;

	function validateEmail(email) { 
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	} 

	function login(username, password,domain){
		var loginResult = {isSuccess:true, message:"Success", securityToken:"", details:{}};

		if (!validateEmail(username)){
			$rootScope.$emit("auth_onLoginError", {isSuccess: false, message:"Invalid email address format" });
			return;
		}

		domain = username.split("@")[1];

		$http({method: 'GET',url: $v6urls.auth + "/Login/" + username +"/" + password + "/" + domain, headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
		  success(function(data, status, headers, config) {
		  	userName = data.Username;
		  	loginResult.details = data;
		  	loginResult.securityToken = data.SecurityToken;
		  	

		  	sessionInfo = data;
		  	securityToken = data.SecurityToken;
			
			if (!securityToken || securityToken ==="")
				securityToken="test";

			document.cookie="securityToken=" + securityToken;
			$v6Cookie.set("securityToken",  securityToken,1);
			$v6Cookie.set("authData",   JSON.stringify(data),1);
			
			$rootScope.$emit("auth_onLogin", loginResult);
			  	
		  }).
		  error(function(data, status, headers, config) {
		  	loginResult.isSuccess = false;
		  	loginResult.message = data;
	  		
	  		$backdoor.log("Auth service returned an error when logging in.");
  			$backdoor.log(data);


			$rootScope.$emit("auth_onLoginError", loginResult);
		  });

	}

	function logout(){

		$v6Cookie.delete("securityToken");
		$v6Cookie.delete("authData");

		$http({method: 'GET',url: $v6urls.auth + "/LogOut/" + securityToken , headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
		  success(function(data, status, headers, config) {

  			$rootScope.$emit("auth_onLogout", {});
			  	
		  }).
		  error(function(data, status, headers, config) {
	  		$backdoor.log("Auth service returned an error when logging out.");
  			$backdoor.log(data);
			
			$rootScope.$emit("auth_onLogout", {});

			//$rootScope.$emit("auth_onLogoutError", loginResult);
		  });
	}

	return {
  		login: function(username,password, domain){
  			login(username, password, domain)
  		},
  		logout: function(){
  			logout();
  		},
  		onLogoutSuccess: function(func){
  			$rootScope.$on("auth_onLogout", func);
  		},
  		onLogoutError: function(func){
  			$rootScope.$on("auth_onLogoutError", func);
  		},
  		onLoginError: function(func){
			$rootScope.$on("auth_onLoginError", func);
  		},
  		onLoginResult: function(func){
  			$rootScope.$on("auth_onLogin", func);
  		},
  		getSecurityToken:function(){
  			if (securityToken)
  				return securityToken;
  			else
  				return "N/A";
  		},
  		getUserName:function(){
  			if (userName)
  				return userName;
  			else{
				var now = new Date();
				userName = now.getHours() + ":" + now.getMinutes() + ":" +   now.getSeconds();
  				return userName;
  			}
  		},
  		getSession:function(){
  			return sessionInfo;
  		},
  		forceLogin:function(username, password,domain){
		  	userName = username;
		  	var loginResult = {}
		  	loginResult.details = {};

		  	var now = new Date();
			loginResult.securityToken = now.getHours() + ":" + now.getMinutes() + ":" +   now.getSeconds();

		  	sessionInfo = loginResult.details;
		  	securityToken = loginResult.securityToken;

			$v6Cookie.set("securityToken",  securityToken,1);
			$v6Cookie.set("authData",  "{}",1);

			$rootScope.$emit("auth_onLogin", loginResult);				  	

  		},
  		checkSession: function(){
  			securityToken = $v6Cookie.get("securityToken");
			
			if (!securityToken || securityToken === "")
				return false;
			
  			sessionInfo = $v6Cookie.get("authData");
  			if (sessionInfo)
  				sessionInfo = JSON.parse(sessionInfo)

  			return true;
  		}

  	}
});


microKernelModule.factory('$fws', function($rootScope, $v6urls, $auth) {
    
    var socket

	isOnline = false;


	function triggerCommand(command, data){
    	var commandObject = {name:command, type:"command", data:data, token:$auth.getSecurityToken()};
        
        socket.emit("command", commandObject, function() {
        	$rootScope.$apply();
        });
	}

    return {
        connect: function(){
        	if (!isOnline){
				socket = io.connect($v6urls.fws + "/");
				
				socket.on("connected", function(data) {
		        	if (data.isSuccess)
		        	{
			        	socket.on("message", function() {
			                var args = arguments;
			                var command = args[0];
			                
			                if (command.type == "command"){
				                $rootScope.$apply(function() {
				                    //callback.apply(socket, args);
				                    $rootScope.$emit("fwscommand_" + command.name, command.data);
				                });
			            	}
			            	else { 
				                $rootScope.$apply(function() {
				                    //callback.apply(socket, args);
				                    $rootScope.$emit("fwsevent_" + command.name, command.data);
				                });
			            	}
							
							
			            });

			            socket.emit("register",{userName:$auth.getUserName(), securityToken:$auth.getSecurityToken(), resourceClass: "user"},function(regResult){
			            	isOnline = true;
							$rootScope.$emit("fws_core_registered", {});
			            });
					}
					else {
						$rootScope.$emit("fws_core_connection_error", data.message);
					}
				});
        	}
        },
        disconnect:function(){
        	socket.close();
        },
        command:function(command,data){
        	data.from = $auth.getUserName();
        	triggerCommand(command,data);
        },
		forward: function(to, command, data){
			data.from = $auth.getUserName();
			triggerCommand("commandforward",{to:to, command:command, data:data, persistIfOffline:false, alwaysPersist:false});			
		},
        triggerevent:function(event,data){
        	var commandObject = {name:event, type:"event", data:data, token:$auth.getSecurityToken()};
	        
	        socket.emit("command", commandObject, function() {
	        	$rootScope.$apply();
            });
        },
        subscribeEvent:function(event){
        	var commandObject = {name:event, type:"event-subscribe", data: {userName:$auth.getUserName(), event:event}, token:$auth.getSecurityToken()};
	        
	        socket.emit("command", commandObject, function() {
	        	$rootScope.$apply();
            });
        },
        unsubscribeEvent:function(event){ 
        	var commandObject = {name:event, type:"event-unsubscribe", data: {userName:$auth.getUserName(), event:event}, token:$auth.getSecurityToken()};
	        
	        socket.emit("command", commandObject, function() {
	        	$rootScope.$apply();
            });
	    },
        onConnected:function(func){ $rootScope.$on("webrtc_chat_call_establishing", func);},
        onRegistered: function(func){ $rootScope.$on("fws_core_registered", func);},
        onDisconneted:function(func){$rootScope.$on("webrtc_chat_call_establishing", func); },
        onRecieveCommand:function(command,callback){
			$rootScope.$on("fwscommand_" + command, callback);
        },
        onRecieveEvent:function(event,callback){
			$rootScope.$on("fwsevent_" + event, callback);
        },
        isOnline: function(){return isOnline}
    };
});


microKernelModule.factory('$chat', function($rootScope, $fws, $auth) {

	$fws.onRecieveCommand("chatmessage",function(e,data){
		$rootScope.$emit("fws_chat_message", data);
	});


	return {
		onMessage: function(func){ $rootScope.$on("fws_chat_message", func); },
		send:function(to,from,message){
			$fws.command("chatmessage",{to:to, from:from, message:message});
		}
	};
});

microKernelModule.factory('$srs', function($rootScope, $fws, $auth) {

	var state = "idle";

	$fws.onRegistered(function(){
		$fws.onRecieveCommand("resourceAcquired",function(e,data){
			setState("acquired");
			$rootScope.$emit("fws_srs_acquired", data);
		});

		$fws.onRecieveCommand("resourceQueued",function(e,data){
			setState("queued");
			$rootScope.$emit("fws_srs_queued", data);
		});

		$fws.onRecieveCommand("resourceReleased",function(e,data){
			setState("idle");
			$rootScope.$emit("fws_srs_released", data);
		});

	});

	function setState(_s){
		state = _s;
		$rootScope.$emit("fws_srs_state", {state: state});
	}

	return {
		onStateChanged: function(func){ $rootScope.$on("fws_srs_state", func); },
		onResourceAcquired: function(func){ $rootScope.$on("fws_srs_acquired", func); },
		onResourceQueued: function(func){ $rootScope.$on("fws_srs_queued", func); },
		onResourceReleased: function(func){ $rootScope.$on("fws_srs_released", func); },
		getResource:function(to,from,message){
			if (state == "idle"){
				$fws.command("getresource",{type:"agent", requestor:$auth.getUserName(), criteria:[
						{category:"language", values:[{key:"sinhala", value:80}]}
					]
				});
			}
		},
		releaseResource: function(id){
			if (state === "acquired"){
				var reqObj ={id:id, requestor:$auth.getUserName() };
				$fws.command("releaseresource", reqObj);
				var x = 12;
			}
		},
		getState: function(){
			return {state: state};
		}
	};
});

microKernelModule.factory('$agent', function($rootScope, $fws, $auth) {

	$fws.onRecieveCommand("agentResponse",function(e,data){
		handleResponse(data);
	});
	
	
	$fws.onRecieveCommand("agentCommand",function(e,data){
		handleResponse(data);
	})

	$fws.onRecieveCommand("onDockerMap",function(e,data){
		$rootScope.$emit("fws_agent_cluster", data);
	})

	function handleResponse(data){
				//{serverId:"xxx", category:"yyy", matrics:{}}
		$rootScope.$emit("fws_agent_info", data);

		switch(data.class){
			case "log":
				$rootScope.$emit("fws_agent_log", data);
				break;
			case "stat":
				$rootScope.$emit("fws_agent_stat", data);
				break;
			case "tenant":
				$rootScope.$emit("fws_agent_tenant", data);
				break;
			case "agent":
				filterAgentInfo(data.data)
				break;
			case "response":
				if (response.type =="tenantSave")
					$rootScope.$emit("fws_agent_response_tenantSave", data);
				else if (response.type =="agentSave")
					$rootScope.$emit("fws_agent_response_agentSave", data);

				break;
			case "config":
				filterGlobalConfig(data.data.config);
				break;
		}
	}

	function filterGlobalConfig(rawData){

		var data = [];
		var s_config = {name:"config", caption:"Configuration", displayType:"configs", contents:[]}

		count=0;		
		for (cItem in rawData){
			count++;
			var cObj = rawData[cItem];
			var newObj = {name:"Section " + count, displayType:"config", displayId:"", caption:"Section " + count, parameters:[]}

			for (prop in cObj){
				newObj.parameters.push({key:prop , value : cObj[prop]})
			}

			s_config.contents.push(newObj)
		}

		data.push(s_config);

		$rootScope.$emit("fws_agent_displayinfo", data);

	}

	function filterAgentInfo(rawData){
		/*
		data = [
			{name:"commands", caption:"Commands", displayType:"commands", contents:[
				{name:"", displayType:"command", displayId:"redis1@duov6.com:createDocker", caption:"Create Docker", parameters:["Docker Name", "Server Type"]},
				{name:"", displayType:"command", displayId:"redis1@duov6.com:deleteDocker", caption:"Delete Docker", parameters:["Docker Name", "Server Type"]}
			]},
			{name:"config", caption:"Configuration", displayType:"configs", contents:[
				{name:"", displayType:"config", displayId:"redis1@duov6.com:serverConfig", caption:"Server Configuration", parameters:["One","Two","Three"]}
			]},
			{name:"info", caption:"Information", displayType:"info", contents:[
				{name:"", displayType:"chart", displayId:"redis1@duov6.com:requests", caption:"Request Calculation", type:"line", parameters:[{x:1, y:5},{x:20, y:20},{x:40, y:10},{x:60, y:40},{x:80, y:5},{x:100, y:60}]},
				{name:"", displayType:"logs", displayId:"redis1@duov6.com:logs", caption:"Logs"}
			]}
		];
*/

		var data = [];

		var s_command = {name:"commands", caption:"Commands", displayType:"commands", contents:[]}
		for (dIndex in rawData.commandMaps){
			var mObj = rawData.commandMaps[dIndex];
			if (mObj) if (mObj.code) if (mObj.code !=""){
				var newObj = {name:mObj.code, displayType:"command", displayId:mObj.code, caption:mObj.name, parameters:[]};

				for (pIndex in mObj.parameters){
					var pObj = mObj.parameters[pIndex];

					newObj.parameters.push({key:pIndex , value : pObj})
				}
				s_command.contents.push(newObj);
			}
		}

		dIndex =0;
		var s_config = {name:"config", caption:"Configuration", displayType:"configs", contents:[]}
		for (dIndex in rawData.configMetadata){

			var cObj = rawData.configMetadata[dIndex];
			var newObj = {name:cObj.code, displayType:"config", displayId:cObj.code, caption:cObj.name, parameters:[]}

			for (pIndex in cObj.parameters){
				var pObj = cObj.parameters[pIndex]

				newObj.parameters.push({key:pIndex , value : pObj})
			}
			s_config.contents.push(newObj)
			
			if (dIndex == rawData.configMetadata.length -1)
				break;
		}

		dIndex =0;
		var s_info = {name:"info", caption:"Information", displayType:"info", contents:[]}
		for (dIndex in rawData.statMetadata){
			var cObj = rawData.statMetadata[dIndex];
			var newObj = {name:cObj.xAxis, displayType:"chart", displayId:cObj.xAxis, caption:cObj.name, parameters:[], config: cObj};
			s_info.contents.push(newObj)

			if (dIndex == rawData.statMetadata.length -1)
				break;
		}
		s_info.contents.push({name:"", displayType:"logs", displayId:"logs", caption:"Logs"});

		data.push(s_command);
		data.push(s_config);
		data.push(s_info);

		$rootScope.$emit("fws_agent_displayinfo", data);
	}

	function getClusterInfo(){

		$fws.command("getdockermap",{});
	}


	function getDisplayInfo(type, id){
		var data = [];

		switch (type){
			case "tenant":
				data = [
					{name:"commands", caption:"User Info", displayType:"commands", contents:[]},
					{name:"config", caption:"Tenant Stats", displayType:"configs", contents:[]},
					{name:"info", caption:"Tenant Info", displayType:"info", contents:[]}
				];
				$rootScope.$emit("fws_agent_displayinfo", data);
				break;
			case "agent":
				$fws.forward(id, "agentCommand", {command: "getinfo", data: {}});
				break;
			case "config":
				var sendData = {};
				sendData.class = id;
				$fws.command("getglobalconfig",sendData);
				break;
		}
		
	}

	function getConfigInfo(id){
		$rootScope.$emit("fws_agent_config", {});
	}

	function saveConfig(id, data){
		var resData = {};
		$rootScope.$emit("fws_agent_response_tenantSave", resData);
	}

	function command(command,data){

	}

	return {
		onClusterInfo: function(func){$rootScope.$on("fws_agent_cluster", func);},
		onDisplayInfo: function(func){$rootScope.$on("fws_agent_displayinfo", func);},

		onAgentLogInfo: function(func){$rootScope.$on("fws_agent_log", func);},
		onAgentStatInfo: function(func){$rootScope.$on("fws_agent_stat", func);},
		
		on:function(serverId){
			$fws.forward(serverId, "agentCommand", {command: "switch", data: {state:"on", enableStats: false}});
		},
		off:function(serverId){
			$fws.forward(serverId, "agentCommand", {command: "switch", data: {state:"off"}} );
		},
		
		getClusterInfo: function(){getClusterInfo();},
		getDisplayInfo: function(type,id){getDisplayInfo(type,id);},

		saveConfig: function(id,data){saveConfig(id,data);},
		agentCommand: function(command,data){ command(command,data);}
	};
});

microKernelModule.factory('$webrtc', function($fws, $auth,$rootScope, $helpers) {
	//idle,establishing, outgoing,incoming,oncall

	var isStreamStarted = false;

	var localStream, localPeerConnection;
	
	var remoteStream; //, remotePeerConnection;

	var localVideo,remoteVideo;

	var partnerDescription,localDescription;
	
	var toUserName;

	var sendChannel, receiveChannel;

	var servers = null;

	var currentState = "idle";

	if (navigator.webkitGetUserMedia) {
		RTCPeerConnection = webkitRTCPeerConnection;
	} else if(navigator.mozGetUserMedia){
		RTCPeerConnection = mozRTCPeerConnection;
		RTCSessionDescription = mozRTCSessionDescription;
		RTCIceCandidate = mozRTCIceCandidate;
	}

	$fws.onRecieveCommand("webrtc",function(e,data){
		handleState(data.from, data.state,data.data);
	});

	$fws.onRecieveCommand("webrtc_candidate",function(e,data){
		var candidate = new RTCIceCandidate({sdpMLineIndex:data.label, candidate:data.candidate});
		localPeerConnection.addIceCandidate(candidate);
	});

	function handleState(from, state,data){

		switch(state){
			case "idle":
				switch(currentState){
					case "establishing":
						$rootScope.$emit("webrtc_chat_call_establishing_error", data);
						break;
					case "outgoing":
						$rootScope.$emit("webrtc_chat_call_cancled", data);
						break;
					case "incoming":
						$rootScope.$emit("webrtc_chat_rejected", data);
						break;
					case "oncall":
						stopLocalStream();
						stopRemoteStream();
						$rootScope.$emit("webrtc_chat_ended", data);
						break;
				}
				break;
			case "establishing":
				if (currentState == "idle"){
					$rootScope.$emit("webrtc_chat_call_establishing", data);
				}
				break;
			case "outgoing":
				if (currentState == "establishing"){
					$rootScope.$emit("webrtc_chat_call_establishing_success", data);
				}
				break;
			case "incoming":
				if (currentState == "idle"){
					partnerDescription = data;
					toUserName = data.from;

					localPeerConnection = new RTCPeerConnection(servers);
					localPeerConnection.addStream(localStream);

					localPeerConnection.onicecandidate = gotLocalIceCandidate;
					localPeerConnection.onaddstream = gotRemoteStream;

					forwardCommand(from, "outgoing", {});
					$rootScope.$emit("webrtc_chat_ringing", data);
				}
				break;
			case "oncall":
				switch(currentState){
					case "outgoing":
						partnerDescription = data;
						//handle answer for outgoing call
						answerOtherSide();
						$rootScope.$emit("webrtc_chat_reciever_answered", data);
						break;
					case "incoming":
						
						$rootScope.$emit("webrtc_chat_answered", data);
						break;
				}
				
				break;
		}

		currentState = state;
		$rootScope.$emit("webrtc_chat_state_change", state);

	}

	//to, command, data, persistIfOffline, alwaysPersist

	function forwardCommand(to, state, args){
		$fws.command("commandforward",{to:to, command:"webrtc", data:{state:state, data:args, from:$auth.getUserName()}, persistIfOffline:false, alwaysPersist:false});
	}




	function startLocalStream(){
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		
		navigator.getUserMedia({audio:true, video:true}, function(stream){
			if (window.URL) {
				localVideo.src = URL.createObjectURL(stream);
			} else {
				localVideo.src = stream;
			}

			localStream = stream;
			isStreamStarted = true;
		},
		function(error) {
			
		});
	}

	function stopLocalStream(){
		localVideo.src = undefined;
		localStream.stop();
	}

	function stopRemoteStream(){
		remoteVideo.src = undefined;
		remoteStream.stop();
	}

	function getLocalSDP(to, task) {

		toUserName = to;

		/*
		if(navigator.webkitGetUserMedia) {
			if (localStream.getVideoTracks().length > 0) {
				log('Using video device: ' + localStream.getVideoTracks()[0].label);
			}
			if (localStream.getAudioTracks().length > 0) {
				log('Using audio device: ' + localStream.getAudioTracks()[0].label);
			}
		}
		*/

		localPeerConnection = new RTCPeerConnection(servers);
		localPeerConnection.addStream(localStream);

		localPeerConnection.onicecandidate = gotLocalIceCandidate;
		localPeerConnection.onaddstream = gotRemoteStream;
	
	

		try {
		
			sendChannel = localPeerConnection.createDataChannel("sendDataChannel",{reliable: true});
			
		} catch (e) {
			alert('Failed to create data channel. ');
			
		}

		sendChannel.onopen = handleSendChannelStateChange;
		sendChannel.onmessage = handleMessage;
		sendChannel.onclose = handleSendChannelStateChange;

		var localDescFunc =	function (description){
		localPeerConnection.setLocalDescription(description);
		
		task.endSuccess({sdp:description.sdp, type:"offer", from:$auth.getUserName()});
		//task.endSuccess(description);

		}

		localPeerConnection.createOffer(localDescFunc, onSignalingError);
	}



	function handleReceiveChannelStateChange() {
		var readyState = sendChannel.readyState;
		console.log('Send channel state is: ' + readyState);
		if (readyState == "open") {

		} else {
		}
	}


	function handleSendChannelStateChange() {
		var readyState = sendChannel.readyState;
		console.log('Send channel state is: ' + readyState);
		if (readyState == "open") {

		} else {
		}
	}

	function handleMessage(event) {
		console.log('Received message: ' + event.data);
	}


	function answerOtherSide(){
		var desc = new RTCSessionDescription();
		desc.sdp = partnerDescription.sdp;
		desc.type = partnerDescription.type;
		localPeerConnection.setRemoteDescription(desc);
		localPeerConnection.createAnswer(gotRemoteDescription, onSignalingError);		
	}

	function gotRemoteDescription (description){
		localPeerConnection.setRemoteDescription(description);
	}


	function answerThisSide(task){
		var desc = new RTCSessionDescription();
		desc.sdp = partnerDescription.sdp;
		desc.type = partnerDescription.type;


		/*
		localPeerConnection = new RTCPeerConnection(servers);
		localPeerConnection.addStream(localStream);

		localPeerConnection.onicecandidate = gotLocalIceCandidate;
		localPeerConnection.onaddstream = gotRemoteStream;
		*/

		localPeerConnection.setRemoteDescription(desc);
		
		try {
		
			sendChannel = localPeerConnection.createDataChannel("sendDataChannel",{reliable: true});
			
		} catch (e) {
			alert('Failed to create data channel. ');
			
		}

		sendChannel.ondatachannel = function (event) {
			trace('Receive Channel Callback');
			receiveChannel = event.channel;
			receiveChannel.onmessage = handleMessage;
			receiveChannel.onopen = handleReceiveChannelStateChange;
			receiveChannel.onclose = handleReceiveChannelStateChange;
		};



		localPeerConnection.createAnswer(			
			function (description){
				localPeerConnection.setLocalDescription(description);		
				
				task.endSuccess({sdp:description.sdp, type:"answer"});
			}, function (error){
				console.log("Call Answer ERROR!!!");
			});		


	}


	function hangup() {
		localPeerConnection.close();
	}

	function gotRemoteStream(event){
		if (window.URL) {
			// Chrome
			var url= window.URL.createObjectURL(event.stream);
			console.log("Remote Stream Url : " + url);
			remoteVideo.src = url;

		} else {
			// Firefox
			remoteVideo.src = event.stream;
		}

		remoteStream = event.stream;
	}


	function gotLocalIceCandidate(event){
		if (event)
		if (event.candidate) {
			//localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));

			var sendData = {
							type: 'candidate',
							label: event.candidate.sdpMLineIndex,
							id: event.candidate.sdpMid,
							candidate: event.candidate.candidate
						};

			$fws.command("commandforward",{to:toUserName, command:"webrtc_candidate", data:sendData, persistIfOffline:false, alwaysPersist:false});


		}
	}


	function onSignalingError(error){
		console.log(error);
	}

	return {
		onCallEstablishing: function(func){$rootScope.$on("webrtc_chat_call_establishing", func);},
		onCallEstablishError: function(func){$rootScope.$on("webrtc_chat_call_establishing_error", func);},
		onCallEstablishSuccess: function(func){$rootScope.$on("webrtc_chat_call_establishing_success", func);},
		onCallCallCancelled: function(func){$rootScope.$on("webrtc_chat_call_cancled", func);},
		onRecieverAnswered: function(func){$rootScope.$on("webrtc_chat_reciever_answered", func);},
		onRejected: function(func){$rootScope.$on("webrtc_chat_rejected", func);},
		onRinging: function(func){$rootScope.$on("webrtc_chat_ringing", func);},
		onAnswered: function(func){$rootScope.$on("webrtc_chat_answered", func);},
		onEnded: function(func){$rootScope.$on("webrtc_chat_ended", func);},
		onStateChange: function(func){$rootScope.$on("webrtc_chat_state_change", func);},
		getState: function(){ return currentState;},
		
		call: function(to, args){ 
			
			$helpers.task(function(data, task){
				//call method to get current SDP
				getLocalSDP(to, task);
			}, function(data){
				forwardCommand(to, "incoming", data);  
				handleState($auth.getUserName(), "establishing",{});

			}, function(data){

			});
		},
		
		reject: function(to, args){ 
			forwardCommand(to, "idle", args); 
			handleState($auth.getUserName(), "idle",{});
		},
		
		answer:function(to, args){ 

			$helpers.task(function(data, task){
				//call method to get current SDP
				//getLocalSDP("", task);

				answerThisSide(task);

			}, function(data){
				
				//handle answer for incoming call
				//createRemoteAnswer();

				forwardCommand(to, "oncall", data); 
				handleState($auth.getUserName(), "oncall",data);
			}, function(data){

			});
		},
		
		end:function(to, args){ 
			hangup();

			forwardCommand(to, "idle", args);  
			handleState($auth.getUserName(), "idle",{});
		},

		setVideoTags: function(localVideoTag,remoteVideoTag){
			localVideo = document.getElementById(localVideoTag);
			remoteVideo = document.getElementById(remoteVideoTag);
		},

		startLocalStream: function(){
			startLocalStream();
		},

		startRemoteStream: function(){

		},
		stopLocalStream: function(){
			stopLocalStream();
		},
		stopRemoteStream:function(){
			stopRemoteStream();
		}
	};
});

microKernelModule.factory('$presence', function($fws,$rootScope, $auth) {
	
	function setOnline(){
		$fws.connect();	
	}
	
	$fws.onRegistered(function(){
		$fws.subscribeEvent("userstatechanged");
		$rootScope.$emit("fws_pres_state", {state:"online"});
	});

	$fws.onRecieveCommand("usersloaded", function(e,data){
		$rootScope.$emit("fws_pres_users", data);
	});
	
	$fws.onRecieveEvent("userstatechanged", function(e,data){
		$rootScope.$emit("fws_pres_user_state", data);
	});

	return {
		setOnline:function(){setOnline();},
		setOffline:function(){},
		onOnlineUsersLoaded:function(func){ $rootScope.$on("fws_pres_users", func);},
		onUserStateChanged:function(func){ $rootScope.$on("fws_pres_user_state", func); },
		onStateChanged:function(func){ $rootScope.$on("fws_pres_state", func);},
		getOnlineUsers: function(){
			$fws.command("getallusers",{from:$auth.getUserName()});
		},
		getUsers:function(){}
	};
});

microKernelModule.factory('$notifications', function($fws) {
	return {
		onRecieve: function(func){}
	};
});


microKernelModule.factory('$uploader', function ($http, $v6urls, $rootScope) {
    function upload(namespace, cls, file){
    	
		uploadUrl = $v6urls.objectStore + "/" + namespace + "/" + cls + "/" + file.name + "/";
		var fd = new FormData();
		fd.append('file', file);

		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
		.success(function(e){
			$rootScope.$emit("uploader_success", e);
		})
		.error(function(e){
			$rootScope.$emit("uploader_fail", e);
		});
    }

    return {
    	upload: function(namespace, cls, file){ upload(namespace, cls, file)},
    	onSuccess:function(func){
    		var of = $rootScope.$on("uploader_success", function (e,data){
    			func(e,data);
    			of();
    		});
    	},
    	onError:function(func){
    		var of = $rootScope.$on("uploader_fail", function (e,data){
    			func(e,data);
    			of();
    		});
    	}
    };
});

microKernelModule.factory('$processDispatcher', function($http, $v6urls,$auth,$backdoor) {
  
	function ProcessQueueClient(){

		var onDispatched;
		var onComplete;
		var onError;

		function execute(opParams, contParams, timestamp){
			$http.get($v6urls.processDispatcher ,{headers:{"securityToken" : $auth.getSecurityToken()}}).
			  success(function(data, status, headers, config) {
			  	if (onDispatched)
			  		onDispatched(data);				  	
			  }).
			  error(function(data, status, headers, config) {
			  	if (onError){
			  		onError(data)
			  	}
			  });
		}

		return {
			dispatch: function(opParams, contParams){
				execute(opParams,contParams);
			},
			schedule: function(timestamp, opParams, contParams){
				execute(opParams,contParams, timestamp);
			},
			onDispatched:function(func){ onDispatched = func },
			onComplete:function(func){ onComplete = func },
			onError: function(func){ onError = func}
		}
	}


	return {
  		getClient:function(){
  			var req = new ProcessQueueClient();
  			return req;
  		}
  	}
});


microKernelModule.factory('$backdoor', function() {
   
   	var logLines = [];
	var onItemAdded;

	function timeStamp() {
		var now = new Date();
		var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
		var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
		 
		var suffix = ( time[0] < 12 ) ? "AM" : "PM";
		 
		time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
		 
		time[0] = time[0] || 12;
		 
		for ( var i = 1; i < 3; i++ )
			if ( time[i] < 10 )
				time[i] = "0" + time[i];
		 
		return date.join("/") + " " + time.join(":") + " " + suffix;
	} 

    return {
		log: function(data){
			var newLine = timeStamp() + "           " +  data;

			logLines.push(newLine);

			if (onItemAdded){
				onItemAdded(newLine, logLines);
			}
		},
		onUpdate: function(func){
			onItemAdded = func;
		}
    };
});



microKernelModule.factory('$apps', function($compile, $rootScope,$compile,$presence, $chat, $webrtc, $auth, $backdoor, $objectstore, $agent, $srs, $uploader, $helpers){

	var allApps = [];
	var runningInstances = [];

	function AppDownloader(successCallback, errorCallback){

		var descriptor = {};
		var resources = [];

		var appCode="";

		function getDescriptor(scall){
			var client = $objectstore.getClient("duosoftware.com","appdescriptor");

			client.onGetOne(function(data){
				if (data){
					descriptor = data;
					scall();		
				}
			});	

			client.onError(function(data){
				errorCallback(data);
			});


			client.getByKey(appCode);
		}

		function getResources(callback){
			var errorLog="";
			var successResources = [];
			
			getOne(descriptor.resources, function(res){
				
				if (res)
					successResources.push({id:res.name, data:res.data});
				
				if (callback && (currentIndex == descriptor.resources.length -1)){
					if (errorLog.length >0)
						alert ("Error downloading the following resources : \n\n" + errorLog);

					resources = successResources;
					callback();
				}


			}, function(errmsg){
				errorLog += "Error downloading : " + errmsg + "\n";

				if (callback && (currentIndex == descriptor.resources.length -1)){
					if (errorLog.length >0)
						alert ("Error downloading the following resources : \n\n" + errorLog);

					callback();
				}
			})
		}

		var currentIndex = -1 ;
		var currentResource;

		function getOne(res, scall, ecall){
			
			currentIndex++;
			
			if (currentIndex == res.length){
				scall();
				return;
			}

			currentResource = res[currentIndex];

			var client = $objectstore.getClient("duosoftware.com","appresources");

			client.onGetOne(function(data){
				if (data){
					scall(data);
				}
				getOne(res,scall,ecall);
			});	

			client.onError(function(data){
				ecall(currentResource.id);
				getOne(res,scall,ecall);
			});

			var resId = $helpers.getHash(appCode + "#" + currentResource.id);

			client.getByKey(resId);

		}

		function getResource(resId){
			for (rIndex in resources)
			if (resources[rIndex].id == resId)
				return resources[rIndex];
		}


		return {
			download: function(ac){
				appCode = ac;

				var downloadedApp = localStorage.getItem("appcache_" + appCode);

				if (downloadedApp){
					successCallback(JSON.parse(downloadedApp));
					return;
				}

				getDescriptor(function(){
					getResources(function(){
						
						var model = getResource(descriptor.data.mainScript);
						var view = getResource(descriptor.data.mainView);

						if (model && view){
							var successObject = {view:view.data,model:model.data, resources:resources};
							localStorage.setItem("appcache_" + appCode, JSON.stringify(successObject));
							successCallback(successObject);
						}
						else
							errorCallback("mainView and mainModel are not defined in application");
					})
				});

			}
		}
	}

	function getAppsForUser(func){
		var client = $objectstore.getClient("duosoftware.com","application");

		client.onGetMany(function(data){
			if (data)
				allApps = data;

			$rootScope.$emit("apps_onUserRetrieved" , {apps : data});
		});	

		client.getByKeyword("*");
	}


	$rootScope.$on("apps_appOpened", function(e,data){

		var appIndex = -1;

		for (aIndex in allApps)
		if (allApps[aIndex].ApplicationID == data.appCode){
			appIndex = aIndex;
			break;
		}

		if (appIndex != -1)
			data.app = allApps[aIndex];

		runningInstances.push(data);

		$rootScope.$emit("apps_appOpenedShell" , data);
	});

	$rootScope.$on("apps_appClosed", function(e,data){
		
		var removeIndex = -1;
		var removeObject = {};

		for (aIndex in runningInstances)
		if (runningInstances[aIndex].instance.getInstanceId() == data.instance.getInstanceId()){
			removeIndex = aIndex;
			removeObject = runningInstances[aIndex];
			break;
		}

		if (removeIndex != -1){
			//runningInstances = 
			runningInstances.splice(removeIndex,1);
		}

		$rootScope.$emit("apps_appClosedShell" , removeObject);
	});


	return {
		onAppsRetrieved: function(func){
			$rootScope.$on("apps_onUserRetrieved", func);
		},
		onExecuteError:function(func){
			$rootScope.$on("apps_executeError", func);
		},
		onRendered: function(func){},
		onAppClosed: function(func){
			$rootScope.$on("apps_appClosedShell", func);
		},
		onAppOpened: function(func){
			$rootScope.$on("apps_appOpenedShell", func);
		},
		executeMVC: function(sc, renderElement, appCode, view, model, resources){

            var engineHtml = "<duoapp app-code='"+ appCode + "'></duoapp>";
            var content = $compile(engineHtml)(sc);
            $("#" + renderElement).html(content);

            $rootScope.$emit("apps_loaded_" + appCode, {view:view,model:model, resources:resources ? resources : []});
          
        },
		executeTest: function(sc,appCode, view, model, resources){
            $rootScope.$emit("apps_loaded_" + appCode, {view:view,model:model, resources:resources});
        },
        executeIFrameChild: function(sc,appCode){
            $rootScope.$emit("apps_loaded_" + appCode, {});
        },
        executeIFrameParent: function(id,app, url, errorCallback){
			if (!window.apphook)
				window.apphook = {};

			var appCode = app.ApplicationID;
            new AppDownloader(function(successData){
				window.apphook.TEST_APP = {
					app:app,
					data:successData,
					services:{
						$rootScope:$rootScope,
						$compile:$compile,
						$presence:$presence, 
						$chat:$chat, 
						$webrtc:$webrtc, 
						$auth:$auth, 
						$backdoor:$backdoor, 
						$objectstore:$objectstore, 
						$agent:$agent, 
						$srs:$srs, 
						$uploader:$uploader
					}
				};

				$iframe = $('#' + id);
		        $iframe.attr('src',url);

            },errorCallback).download(appCode);
        },
        execute: function(sc, renderElement, appCode, errorCallback){
            var engineHtml = "<duoapp app-code='"+ appCode + "'></duoapp>";
            var content = $compile(engineHtml)(sc);
            $("#" + renderElement).html(content);

            new AppDownloader(function(successData){
            	$rootScope.$emit("apps_loaded_" + appCode, successData);
            },errorCallback).download(appCode);
        },
        getRunningApps: function(){
        	return runningInstances;	
        },
		setLayout: function(layout){

		},
		sendData: function(appCode,data){
			$rootScope.$emit("apps_ipc_" + appCode, data);
		},
		getAppsForUser: function(){
			getAppsForUser();
		},
		terminate: function(appObject){
			$rootScope.$emit("apps_appClosed", appObject);
		},
		onRenderTrigger: function(appCode, func){
			$rootScope.$on("apps_render_trigger_" + appCode, func);
		}
	}
});



microKernelModule.factory('$v6urls', function() {
   
	var urls={
		auth:"http://192.168.1.201:3048",
		objectStore:"http://45.55.83.253:3000",
		fws:"http://192.168.1.201:4000",
		processDispatcher: "http://192.168.1.201:5000"
	};

    return urls;
});



function CurrentApp(appCode,resources, appService, $compile, sc,$rootScope, $helpers){

	var instanceId = Number(new Date());
	var termFunc = null;

	var isChildMode = false;
	var renderDiv;
	var outResult = {};


	function getResource(resId){
		for (index in resources)
			if (resources[index].id == resId)
				return resources[index];
	}

	return {
		sendData: function(sendAppCode,data){

		},
		onRecieveData: function(func){

		},
		close: function(){
			if (renderDiv){
				renderDiv.html("");
				renderDiv.css("visibility", "hidden");	
			}

			$rootScope.$emit("apps_appClosed_" + appCode, {instance:this, data:outResult});
			$rootScope.$emit("apps_appClosed", {instance:this, data:outResult});
			
			if (termFunc)
				termFunc(this, data);
		},
		getInstanceId : function(){
			return instanceId;
		},
		onClosed: function(func){
				termFunc = null;
		}, 
		navigate:function(view,model, closeFunc, indata){
			
			var viewRes = getResource(view);
			var modelRes = getResource(model);

			var childAppCode = "child_" + view + "_" + appCode;

            var engineHtml = "<duoapp app-code='" + childAppCode + "'></duoapp>";
            var content = $compile(engineHtml)(sc);

            var renderDiv = $("#idRenderDivFor_" + appCode);
            renderDiv.html(content);
			renderDiv.css("visibility", "visible");

            var o1 = $rootScope.$on("apps_render_trigger_" + childAppCode, function(e,data){
            	data.instance.setRenderDiv(renderDiv);
            });

            var o2 = $rootScope.$on("apps_appClosed_" + childAppCode, function(e,data){
            	if (closeFunc)
	        		$helpers.safeApply(function(){
	        			closeFunc(data);            			
	        		});
            	
            	o1();
            	o2();
            });

            $rootScope.$emit("apps_loaded_" + childAppCode, {view:viewRes.data,model:modelRes.data, inputData:indata});
		},
		setRenderDiv: function(div){
			renderDiv = div;
		},
		setOutput: function(data){
			if (data)
				outResult = data;
		}

	};
}


microKernelModule.directive("duoapp", ["$rootScope","$compile","$presence", "$chat", "$webrtc", "$auth", "$backdoor", "$objectstore", "$agent", "$srs", "$uploader","$apps","$helpers","$events" ,function($rootScope,$compile,$presence, $chat, $webrtc, $auth, $backdoor, $objectstore, $agent, $srs, $uploader, $apps, $helpers,$events) {
  return {
    restrict: "E",

    template: "",

    transclude: true,
    scope: {
      appCode: "@"
    },
    link: function(scope,element){
    	scope.state = "loading";

    	var offFn = $rootScope.$on("apps_loaded_" + scope.appCode,function(event,data){
			scope.state = "loaded";

			var $appInputs = data.inputData ? data.inputData : {};
			
	    	var $instance = new CurrentApp(scope.appCode, data.resources, $apps,$compile, scope, $rootScope, $helpers);
	    	scope.model = null;

			eval("scope.model = " + data.model + "()")
	          //for(var propt in data.controller)
	            //scope[propt] = data.controller[propt];

	      	var childSection = "<div id='idRenderDivFor_" + scope.appCode +"' style='z-order:999999;position:absolute;left:0px;top:0px;height:100%;width:100%;background:white;visibility:hidden;'></div>";

	      	var content = $compile(data.view + childSection)(scope);	      	
	      	element.html(content);
			
			$rootScope.$emit("apps_appOpened", {appCode: scope.appCode, instance: $instance});
	  		$rootScope.$emit("apps_render_trigger_" + scope.appCode, {appCode: scope.appCode, instance: $instance});	

			if (scope.model && scope.model.onOpened){
	           $helpers.safeApply(scope.model.onOpened);
			};

			offFn();
    	});
	
    }
  };
}]);

microKernelModule.directive("iduoapp", ["$rootScope","$compile","$presence", "$chat", "$webrtc", "$auth", "$backdoor", "$objectstore", "$agent", "$srs", "$uploader","$apps","$helpers" ,function($rootScope,$compile,$presence, $chat, $webrtc, $auth, $backdoor, $objectstore, $agent, $srs, $uploader, $apps, $helpers) {
  return {
    restrict: "E",

    template: "",

    transclude: true,
    scope: {
      appCode: "@"
    },
    link: function(scope,element){
    	scope.state = "loading";

    	
		var hook = parent.apphook["TEST_APP"];
		var services = hook.services;
		var hookData = hook.data;
		var app = hook.app;
    	
    	var offFn;
    	offFn = $rootScope.$on("apps_loaded_" + scope.appCode,function(event,data){

			var $appInputs = hookData.inputData ? hookData.inputData : {};
    		var $instance = new CurrentApp(scope.appCode, hookData.resources, $apps,$compile, scope, $rootScope, $helpers);

			for(var propt in services){
				this[propt] = hook.services[propt];
			}
    		scope.state = "loaded";

	    	scope.model = null;

			eval("scope.model = " + hookData.model + "()")
	          //for(var propt in data.controller)
	            //scope[propt] = data.controller[propt];

	      	var childSection = "<div id='idRenderDivFor_" + scope.appCode +"' style='z-order:999999;position:absolute;left:0px;top:0px;height:100%;width:100%;background:white;visibility:hidden;'></div>";

	      	var content = $compile(hookData.view + childSection)(scope);	      	
	      	element.html(content);

			$rootScope.$emit("apps_appOpened", {appCode: scope.appCode, instance: $instance});

			if (scope.model && scope.model.onOpened){
	           $helpers.safeApply(scope.model.onOpened);
			};
	
			offFn();
    	});

      	$rootScope.$emit("apps_render_trigger_" + scope.appCode, {});    

    }
  };
}]);