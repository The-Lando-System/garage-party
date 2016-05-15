(function() { 'use strict';

angular.module('my-app')
.controller('NavbarController', NavbarController);

NavbarController.$inject = ['AuthService','$scope'];

function NavbarController(AuthService,$scope) {
  
  var vm = this;
  vm.logout = logout;
  vm.showConfirm = showConfirm;
  vm.hideConfirm = hideConfirm;
  vm.confirmId = 'navbar';

  var confirmDialog;

  function showConfirm(){
    if(!confirmDialog){
        confirmDialog = document.querySelector('#confirm-dialog-' + vm.confirmId);
      }
      confirmDialog.showModal();
  };

  function hideConfirm(){
    if(!confirmDialog){
        confirmDialog = document.querySelector('#confirm-dialog-' + vm.confirmId);
      }
      confirmDialog.close();
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

  function logout(){
    //var confirmLogout = confirm('Are you sure you want to logout?');
    vm.showConfirmNo = true;
    vm.confirmTitle = "Logout?";
    vm.confirmText = "Do you want to logout?";
    vm.confirmYes = confirmLogout;
    vm.confirmNo = vm.hideConfirm;
    //$scope.$apply();
    vm.showConfirm();
  };

  function confirmLogout(){
    AuthService.logout();
    vm.userSession = AuthService.endUserSession();
    vm.hideConfirm();
  };

  angular.element(document).ready(function () {
    vm.userSession = AuthService.startUserSession();
  });
  
};

})();