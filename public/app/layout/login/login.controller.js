(function() { 'use strict';

angular.module('my-app')
.controller('LoginController', LoginController);

LoginController.$inject = ['$http','$window','$location','jwtHelper','AuthService'];

function LoginController($http,$window,$location,jwtHelper,AuthService) {
	
	var loginVm = this;

	loginVm.authFail = false;
	loginVm.login = login;
	loginVm.hideLoginDialog = hideLoginDialog;
	loginVm.loading = false;

	function login(formIsValid){
		if (formIsValid){

			loginVm.loading = true;

			$http.post('/authenticate',loginVm.creds)
			.success(function(data){
				if (data.success){
					AuthService.createSession(data.token);
					loginVm.userSession = AuthService.startUserSession();
					hideLoginDialog();
					loginVm.loading = false;
				} else {
					loginVm.authFail = true;
					loginVm.errorMessage = data.message;
					loginVm.loading = false;
				}
			})
			.error(function(data){
				console.log('Error: ' + data);
				loginVm.loading = false;
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

};

})();