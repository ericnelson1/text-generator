(function() {
'use strict';

angular.module('app.services', [])

.factory('Link', ['$resource',
    function ($resource) {
        return $resource('/api/links');
    }])

.factory('Stats', ['$resource',
    function ($resource) {
        return $resource('/api/stats/:id/depth/:depth');
    }])

.factory('Text', ['$resource',
    function ($resource) {
        return $resource('/api/text/depth/:depth');
      }]);

})();
  
