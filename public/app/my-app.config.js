(function() { 'use strict';

angular.module('my-app')
.config(config);

function config($httpProvider,$urlRouterProvider,$stateProvider,$locationProvider) {
  
  $locationProvider.html5Mode(true);

  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: '/app/layout/home/home.html',
    controller: 'HomeController',
    controllerAs: 'vm'
  })
  .state('garage-status', {
    url: '/garage-status',
    templateUrl: '/app/layout/garage-status/garage-status.html',
    controller: 'GarageStatusController',
    controllerAs: 'vm'
  })
  .state('users', {
    url: '/user-management',
    templateUrl: '/app/layout/users/user-management.html',
    controller: 'UserMgmtController',
    controllerAs: 'vm'
  })

  $urlRouterProvider
  .otherwise('/home');

  $urlRouterProvider.rule(function($injector, $location) {

    var path = $location.path();
    var hasTrailingSlash = path[path.length-1] === '/';

    if(hasTrailingSlash) {

      //if last charcter is a slash, return the same url without the slash  
      var newPath = path.substr(0, path.length - 1); 
      return newPath; 
    } 

  });

  $httpProvider.interceptors.push('Interceptor');

};

angular.module('my-app')
.run(function ($rootScope,$timeout) {
  $rootScope.$on('$viewContentLoaded', ()=> {
    $timeout(() => {
      componentHandler.upgradeAllRegistered();
    })
  })
});

})();