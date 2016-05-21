(function() { 'use strict';

angular.module('my-app')
.controller('LoginController', LoginController);

LoginController.$inject = ['$http','$window','$location','jwtHelper','AuthService'];

function LoginController($http,$window,$location,jwtHelper,AuthService) {
	
	var loginVm = this;

	loginVm.authFail = false;
	loginVm.login = login;
	loginVm.hideLoginDialog = hideLoginDialog;

	function login(formIsValid){
		if (formIsValid){
			$http.post('/authenticate',loginVm.creds)
			.success(function(data){
				if (data.success){
					AuthService.createSession(data.token);
					loginVm.userSession = AuthService.startUserSession();
					hideLoginDialog();
				} else {
					loginVm.authFail = true;
					loginVm.errorMessage = data.message;
				}
			})
			.error(function(data){
				console.log('Error: ' + data);
			});
		}
	};

	var loginDialog;

	function hideLoginDialog(){
		if(!loginDialog){
  			loginDialog = document.querySelector('#login-dialog');
  		}
  		loginDialog.close();
	};

	angular.element(document).ready(function () {
		loginVm.userSession = AuthService.startUserSession();
		if (loginVm.userSession.user) {
			$location.path('home');
		}
	});
};

})();