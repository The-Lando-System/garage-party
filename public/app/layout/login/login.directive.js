(function() { 'use strict';

angular.module('my-app')
.directive('login', Login);

function Login() {
  return {
    restrict: 'E',
    templateUrl: '/login',
    controller: 'LoginController',
    controllerAs: 'loginVm'
  };
};

})();