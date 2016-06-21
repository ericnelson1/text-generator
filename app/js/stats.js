(function() {
'use strict';

angular.module('app.controllers')
.controller('StatsController', ['Stats', '$stateParams',
  function(Stats, $stateParams) {

    var vm = this;

    vm.stats = Stats.query({
      id: $stateParams.id || null,
      depth: 1 
    });

    vm.depths = [
      {display: 'One Character', depth: 1},
      {display: 'Four Characters', depth: 4},
      {display: 'Eight Characters', depth: 8}
    ];

    vm.selectedDepth = this.depths[1];

    vm.selectDepth = function(d) {
      vm.selectedDepth = d;
    };
 
    vm.sorts = [
      {display: 'Alphabetical' },
      {display: 'Count' }
    ];

    vm.selectedSort = vm.sorts[1];

    vm.selectSort = function(s) {
      vm.selectedSort = s;
    };
}]);

})();

