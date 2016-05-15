(function() { 'use strict';

angular.module('my-app')
.factory('Interceptor', Interceptor);

Interceptor.$inject = ['$rootScope','AuthService'];

function Interceptor($rootScope,AuthService) {

	var interceptorService = {};

	interceptorService.request = function(config) { 
        return config;
    };

	interceptorService.response = function(response) {

		if (response.data.message){
			if (response.data.message === 'TokenExpiredError'){
				alert('Your session has expired. Please login again.');
				AuthService.logout();
			}

		}

        return response;
    };

	return interceptorService;

};

})();