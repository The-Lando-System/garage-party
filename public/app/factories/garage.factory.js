(function() { 'use strict';

angular.module('my-app')
.factory('GarageFactory', GarageFactory);

GarageFactory.$inject = ['$http'];

function GarageFactory($http) {
	return {
        get : function(token) {
            return $http.get('/user/garage', {
                headers: { 'x-access-token': token }
            });
        },
        getStatus : function(token) {
            return $http.get('/user/garage/status', {
            	headers: { 'x-access-token': token }
            });
        },
        changeStatus : function(token, username, desiredStatus) {
            return $http.post('/user/garage/status/' + username, {"desiredStatus":desiredStatus}, {
                headers: { 'x-access-token': token }
            });
        },
        create : function(token,newGarage) {
            return $http.post('/user/garage', newGarage, {
    			headers: { 'x-access-token': token }
    		});
        },
        delete : function(token,id) {
            return $http.delete('/user/garage/' + id, {
            	headers: { 'x-access-token': token }
            });
        },
        edit : function(token,id,editedGarage) {
            return $http.put('/user/garage/' + id, editedGarage, {
                headers: { 'x-access-token': token }
            });
        }
    }
};

})();