(function() {
'use strict';

angular.module('app.services', [])

.factory('Link', ['$resource',
    function ($resource) {
        return $resource('/api/links');
    }]);

})();

