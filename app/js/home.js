(function() {
'use strict';

angular.module('app.controllers')
  .controller('HomeController', ['$http',
    function($http) {

      var vm = this;

      vm.chardepths = [
        {display: 'One Character', depth: 1},
        {display: 'Two Characters', depth: 2},
        {display: 'Four Characters', depth: 4},
      ];

      vm.selected = this.chardepths[1];

      vm.select = function(s) {
        vm.selected = s;
      };

      vm.go = function() {
        $http.get('/api/text/depth/:depth', 
          { params: { depth: vm.selected.depth }})
        .then(function(response) {
          vm.text = response.data;
        });
      };
      
    }]);

})();
