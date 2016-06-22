(function() {
'use strict';

angular.module('app.controllers')
.controller('StatsController', ['Stats', '$stateParams', '$scope',
  function(Stats, $stateParams, $scope) {

    var vm = this;

    vm.depths = [
      {display: 'One Character', depth: 1},
      {display: 'Four Characters', depth: 4},
      {display: 'Eight Characters', depth: 8}
    ];

    vm.selectedDepth = vm.depths[0];

    vm.selectDepth = function(d) {
      vm.selectedDepth = d;
      refresh();
    };
 
    vm.sorts = [
      {display: 'Alphabetical' },
      {display: 'Count' }
    ];

    vm.selectedSort = vm.sorts[1];

    vm.selectSort = function(s) {
      vm.selectedSort = s;
    };

    var refresh = function() {
      Stats.query({
        id: $stateParams.id || null,
        depth: vm.selectedDepth.depth 
      }, function(data) { vm.stats = data; });
    }

    refresh();

}]);

})();

