(function() { 'use strict';

angular.module('my-app')
.factory('UserFactory', UserFactory);

UserFactory.$inject = ['$http'];

function UserFactory($http) {
	return {
        get : function(token) {
            return $http.get('/admin/users', {
            	headers: { 'x-access-token': token }
            });
        },
        create : function(token,newUser) {
            return $http.post('/admin/users', newUser, {
    			headers: { 'x-access-token': token }
    		});
        },
        delete : function(token,id) {
            return $http.delete('/admin/users/' + id, {
            	headers: { 'x-access-token': token }
            });
        },
        edit : function(token,id,editedUser) {
            return $http.put('/admin/users/' + id, editedUser, {
                headers: { 'x-access-token': token }
            });
        }
    }
};

})();