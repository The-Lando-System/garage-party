(function() { 'use strict';

angular.module('my-app')
.directive('confirmDialog', ConfirmDialog);

function ConfirmDialog() {
  return {
    templateUrl: '/confirm-dialog',
    restrict: 'E'
  };
};

})();