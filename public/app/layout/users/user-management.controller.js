(function() { 'use strict';

angular.module('my-app')
.controller('UserMgmtController', UserMgmtController);

UserMgmtController.$inject = ['$location','jwtHelper','AuthService','UserFactory','$scope'];

function UserMgmtController($location,jwtHelper,AuthService,UserFactory,$scope) {

	var vm = this;
	vm.headerMessage = "Manage Users";
	vm.newUser = { role: "user" };
	vm.editedUser = {};
	vm.userToDelete = {};
	vm.getUsers = getUsers;
	vm.deleteUser = deleteUser;
	vm.prepareDeleteUser = prepareDeleteUser;
	vm.showNewUserModal = showNewUserModal;
	vm.hideNewUserModal = hideNewUserModal;
	vm.showEditUserModal = showEditUserModal;
	vm.hideEditUserModal = hideEditUserModal;
	vm.createUser = createUser;
	vm.updateUser = updateUser;
	vm.showSnackbar = showSnackbar;
	vm.showConfirm = showConfirm;
	vm.hideConfirm = hideConfirm;
	vm.confirmId = 'user-mgmt';
	vm.showConfirmNo = false;

	vm.loading = false;

	vm.confirmTitle = "Hello!";

	vm.hideConfirm = hideConfirm;

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


	function getUsers(){
		vm.loading = true;
		UserFactory.get(vm.userSession.token)
		.success(function(data){
			vm.users = data;
			vm.loading = false;
		})
		.error(function(data){
			console.log('Error: ' + data);
			vm.loading = false;
		});
	};


	function deleteUser(){
		vm.hideConfirm();
		vm.loading = true;
		UserFactory.delete(vm.userSession.token,vm.userToDelete._id)
		.success(function(data){
			console.log(data);
			showSnackbar(data.message);
			getUsers();
			vm.loading = false;
		})
		.error(function(data){
			console.log('Error: ' + data);
			vm.loading = false;
		});
	};


	function prepareDeleteUser(user){
		vm.userToDelete = user;
		vm.showConfirmNo = true;
		vm.confirmTitle = "You sure?";
		vm.confirmText = "You want to delete " + vm.userToDelete.username + "?";
		vm.confirmYes = deleteUser;
		vm.confirmNo = vm.hideConfirm;
		//$scope.$apply();
		vm.showConfirm();
	};

	function createUser(){
		vm.loading = true;
		UserFactory.create(vm.userSession.token,vm.newUser)
		.success(function(data){
			showSnackbar(data.message);
			getUsers();
			vm.loading = false;
		})
		.error(function(data){
			showSnackbar(data.message);
			console.log('Error: ' + data);
			vm.loading = false;
		});
		hideNewUserModal();
	};

	function updateUser(){
		vm.loading = true;
		UserFactory.edit(vm.userSession.token,vm.editedUser._id,vm.editedUser)
		.success(function(data){
			showSnackbar(data.message);
			vm.loading = false;
		})
		.error(function(data){
			showSnackbar(data.message);
			vm.loading = false;
		});
		hideEditUserModal();
	};

  function showNewUserModal(){
  	if(!vm.newUserDialog){
  		vm.newUserDialog = document.querySelector('#new-user-dialog');
  	}
  	vm.newUserDialog.showModal();
  };

  function hideNewUserModal(){
  	if(!vm.newUserDialog){
  		vm.newUserDialog = document.querySelector('#new-user-dialog');
  	}
  	vm.newUserDialog.close();
  	vm.newUser = { role: "user" };
  };

  function showEditUserModal(){
  	if(!vm.editUserDialog){
  		vm.editUserDialog = document.querySelector('#edit-user-dialog');
  	}
  	
  	vm.editUserDialog.showModal();
  };

  function hideEditUserModal(){
  	if(!vm.editUserDialog){
  		vm.editUserDialog = document.querySelector('#edit-user-dialog');
  	}
  	vm.editUserDialog.close();
  	vm.editedUser = {};
  };

  function showSnackbar(msg){
  	var snackbarContainer = document.querySelector('#notification-snackbar');
    var data = {
      message: msg,
      timeout: 2000
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  };


	angular.element(document).ready(function () {
		vm.userSession = AuthService.startUserSession();
		if (vm.userSession.user) {
			getUsers();
		} else {
			$location.path('login');
		}
	});

};

})();