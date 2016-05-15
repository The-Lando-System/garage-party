(function() { 'use strict';

angular.module('my-app')
.directive('navbar', Navbar);

function Navbar() {
  return {
    restrict: 'E',
    templateUrl: '/navbar',
    controller: 'NavbarController',
    controllerAs: 'vm'
  };
};

})();