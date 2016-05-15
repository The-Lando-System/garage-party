(function() { 'use strict';

angular.module('my-app')
.factory('AuthService', AuthService);

AuthService.$inject = ['$cookies','$location','jwtHelper','$rootScope'];

function AuthService($cookies,$location,jwtHelper,$rootScope) {

	var authService = {};

	authService.startUserSession = function() {
		var token = $cookies.get('token') ? $cookies.get('token') : false;
		var user = token ? jwtHelper.decodeToken(token)._doc : false;
		var isAdmin = false;
		if (user.role){
			isAdmin = user.role === 'admin' ? true : false;
		}
		return {
			token    : token,
			user     : user,
			isAdmin  : isAdmin
		};
	};

	authService.endUserSession = function() {
		return {
			token    : false,
			user     : false,
			isAdmin  : false
		};
	};

	authService.logout = function(){
		$cookies.remove('token');
		$location.path('login');
		$rootScope.$broadcast('logout', true);
	};

	authService.createSession = function(token){
		$cookies.put('token',token);
		$location.path('home');
		$rootScope.$broadcast('login', true);
	};

	return authService;

};

})();