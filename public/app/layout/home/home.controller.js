(function() { 'use strict';

angular.module('my-app')
.controller('HomeController', HomeController);

HomeController.$inject = ['AuthService'];

function HomeController(AuthService) {
	var vm = this;
	vm.headerMessage = "Garage Party!";

	angular.element(document).ready(function () {
	    vm.userSession = AuthService.startUserSession();
	});
};

})();