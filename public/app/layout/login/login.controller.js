(function() { 'use strict';

angular.module('my-app')
.controller('LoginController', LoginController);

LoginController.$inject = ['$http','$window','$location','jwtHelper','AuthService'];

function LoginController($http,$window,$location,jwtHelper,AuthService) {
	
	var vm = this;

	vm.headerMessage = "Login";
	vm.authFail = false;
	vm.login = login;

	function login(formIsValid){
		if (formIsValid){
			$http.post('/authenticate',vm.creds)
			.success(function(data){
				if (data.success){
					AuthService.createSession(data.token);
					vm.userSession = AuthService.startUserSession();
				} else {
					vm.authFail = true;
					vm.errorMessage = data.message;
				}
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
		}
	};

	angular.element(document).ready(function () {
		vm.userSession = AuthService.startUserSession();
		if (vm.userSession.user) {
			$location.path('home');
		}
	});
};

})();