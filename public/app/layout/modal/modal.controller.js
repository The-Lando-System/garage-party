(function() { 'use strict';

angular.module('drink-db')
.controller('ModalController', ModalController);

ModalController.$inject = ['$uibModalInstance','items'];

function ModalController($uibModalInstance,items) {
  
  var vm = this;

  vm.items = items;
  vm.selected = {
    item: vm.items[0]
  };

  vm.ok = function () {
    $uibModalInstance.close(vm.selected.item);
  };

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};

})();