(function() { 'use strict';

angular.module('my-app')
.controller('GarageStatusController', GarageStatusController);

GarageStatusController.$inject = ['AuthService','GarageFactory'];

function GarageStatusController(AuthService,GarageFactory) {
  
  var vm = this;
  
  vm.garageStatusMessage = "Finding the status of your garage door...";

  vm.showConfirm = showConfirm;
  vm.hideConfirm = hideConfirm;
  vm.navigateToLogin = navigateToLogin;
  vm.garageOpen = false;
  vm.loading = false;

  function getGarageStatus(){
    vm.loading = true;
    GarageFactory.getStatus(vm.userSession.token)
    .success(function(data){
      if (data.success){
        vm.garageOpen = data.status === 'Open' ? true : false;
        vm.garageStatusMessage = "Your garage is " + data.status + "!";
        vm.loading = false;
      } else {
        vm.garageStatusMessage = data.message;
        vm.loading = false;
      }
    })
    .error(function(data){
      vm.garageStatusMessage = "Failed to find garage door status!";
      console.log('Error: ' + data);
      vm.loading = false;
    });
  };
  
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
    } else {
      getGarageStatus();
    }
  });
  
};

})();