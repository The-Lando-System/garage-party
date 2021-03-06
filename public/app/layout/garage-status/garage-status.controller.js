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
  vm.viewGarageDetails = viewGarageDetails;

  vm.garageDetails = 'Loading garage details...';
  vm.openOrClosed = '...';
  vm.timeSinceLastStateChange = '';
  vm.detailsErrorOrLoading = true;
  vm.showDetails = false;
  vm.garageOpen = false;
  vm.loading = false;

  function viewGarageDetails(){
    vm.showDetails = !vm.showDetails;
  };

  function getGarageDetails(){
    GarageFactory.get(vm.userSession.token)
    .success(data => {
      vm.garageDetails = data[0];

      var now = new Date();
      var stateChangeDate = new Date(vm.garageDetails.actualStateChangeTime);

      vm.timeSinceLastStateChange = msToTime(now - stateChangeDate);

      vm.garageDetails.actualStateChangeTime = new Date(stateChangeDate - (stateChangeDate.getTimezoneOffset()*60*1000)); 

      vm.detailsErrorOrLoading = false;
    })
    .error(data => {
      vm.garageDetails = 'Failed to load garage details!';
    });
  };


  function getGarageStatus(){
    vm.loading = true;
    GarageFactory.getStatus(vm.userSession.token)
    .success(data => {
      if (data.success){
        vm.openOrClosed = data.status;
        vm.garageOpen = data.status === 'Open' ? true : false;
        vm.garageStatusMessage = "Your garage is " + data.status + "!";
        vm.loading = false;
      } else {
        vm.garageStatusMessage = data.message;
        vm.loading = false;
      }
    })
    .error(data => {
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


  function msToTime(ms) {
    var x = ms / 1000;
    var seconds = x % 60;
    x /= 60;
    var minutes = x % 60;
    x /= 60;
    var hours = x % 24;
    x /= 24;
    var days = x;

    return parseInt(days) + " days, " + parseInt(hours) + " hours, " + parseInt(minutes) + " minutes, " + parseInt(seconds) + " seconds";
  }

  
  angular.element(document).ready(function () {
    vm.userSession = AuthService.startUserSession();
    if (!vm.userSession.user){
      vm.showConfirm();
    } else {
      getGarageStatus();
      getGarageDetails();
    }
  });
  
};

})();