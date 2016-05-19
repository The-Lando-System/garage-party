(function() { 'use strict';

angular.module('my-app')
.controller('GarageStatusController', GarageStatusController);

GarageStatusController.$inject = ['AuthService','GarageFactory'];

function GarageStatusController(AuthService,GarageFactory) {
  
  var vm = this;
  
  vm.garageStatusMessage = "Finding the status of your garage door...";
  vm.headerMessage = "Garage Status";

  vm.showConfirm = showConfirm;
  vm.hideConfirm = hideConfirm;
  vm.navigateToLogin = navigateToLogin;

  function getGarageStatus(){
    GarageFactory.getStatus(vm.userSession.token,vm.userSession.user.username)
    .success(function(data){
      if (data.success){
        vm.garageStatusMessage = "Your garage is " + data.status + "!";
      } else {
        vm.garageStatusMessage = data.message;
      }
    })
    .error(function(data){
      vm.garageStatusMessage = "Failed to find garage door status!";
      console.log('Error: ' + data);
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