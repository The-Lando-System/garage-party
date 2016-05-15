(function() { 'use strict';

angular.module('my-app')
.directive('notification', Notification);

function Notification() {
  return {
    templateUrl: '/notification',
    restrict: 'E'
  };
};

})();