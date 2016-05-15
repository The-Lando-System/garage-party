(function() { 'use strict';

angular.module('my-app')
.directive('jumbotron', Jumbotron);

function Jumbotron() {
  return {
    templateUrl: '/jumbotron',
    restrict: 'E'
  };
};

})();