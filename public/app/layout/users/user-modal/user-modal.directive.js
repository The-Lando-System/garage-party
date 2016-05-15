(function() { 'use strict';

angular.module('my-app')
.directive('userModal', UserModal);

function UserModal() {
  return {
    restrict: 'E',
    templateUrl: '/user-modal'
  };
};

})();