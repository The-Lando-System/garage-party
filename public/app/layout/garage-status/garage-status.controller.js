(function() { 'use strict';

angular.module('my-app')
.controller('GarageStatusController', GarageStatusController);

GarageStatusController.$inject = ['AuthService'];

function GarageStatusController(AuthService) {
  
  var vm = this;
  
  vm.garageStatusMessage = "Finding the status of your garage door...";
  vm.headerMessage = "Garage Status";

  vm.showConfirm = showConfirm;
  vm.hideConfirm = hideConfirm;
  vm.navigateToLogin = navigateToLogin;

  var confirmDialog;

  function showConfirm(){
    if(!confirmDialog){
        confirmDialog = document.querySelector('#confirm-dialog-garage-status');
      }
      confirmDialog.showModal();
  };

  function hideConfirm(){
    if(!confirmDialog){
        confirmDialog = document.querySelector('#confirm-dialog-garage-status');
      }
      confirmDialog.close();
  };

  function navigateToLogin(){
    AuthService.logout();
    vm.hideConfirm();
  };
  
  angular.element(document).ready(function () {
    vm.userSession = AuthService.startUserSession();
    if (!vm.userSession.user){
      vm.showConfirm();
    }
  });
  
};

})();