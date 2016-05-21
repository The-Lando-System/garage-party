(function() { 'use strict';

angular.module('my-app')
.controller('HomeController', HomeController);

HomeController.$inject = ['AuthService','$scope'];

function HomeController(AuthService,$scope) {
	var vm = this;
	vm.headerMessage = "Garage Party!";

	vm.showLoginDialog = showLoginDialog;
	vm.hideLoginDialog = hideLoginDialog;

	var loginDialog;

	function showLoginDialog(){
		if(!loginDialog){
  			loginDialog = document.querySelector('#login-dialog');
  		}
  		loginDialog.showModal();
	};

	function hideLoginDialog(){
		if(!loginDialog){
  			loginDialog = document.querySelector('#login-dialog');
  		}
  		loginDialog.close();
	};

	$scope.$on('login', function(event, success) {
	    if (success){
	      vm.userSession = AuthService.startUserSession();
	    }
	  });

   	$scope.$on('logout', function(event, success) {
	  if (success){
	    vm.userSession = AuthService.endUserSession();
	  }
	});


	angular.element(document).ready(function () {
	    vm.userSession = AuthService.startUserSession();
	});
};

})();