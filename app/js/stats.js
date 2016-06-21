(function() {
'use strict';

angular.module('app.controllers')
.controller('StatsController', ['Stats', '$stateParams',
  function(Stats, $stateParams) {

    var vm = this;

    var o = {
      id: $stateParams.id || null,
      depth: 2
    };

    vm.stats = Stats.query(o, function(data) {
      var x = data;
    },
    function (err) {
      var y = err;
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

