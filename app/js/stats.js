(function() {
'use strict';

angular.module('app.controllers')
.controller('StatsController', ['Stats', '$stateParams',
  function(Stats, $stateParams) {

    var vm = this;
    var id = $stateParams.id ? $stateParams : {id: '565bce05ed6b1ba20d0c41f6' };

    vm.stats = Stats.query(id);

    vm.depths = [
        {display: 'One Character', depth: 1},
        {display: 'Four Characters', depth: 4},
        {display: 'Eight Characters', depth: 8}
    ];

    vm.selectedDepth = this.depths[1];

    vm.selectDepth = function(d) {
        vm.selectedDepth = d;
    };
 
    this.sorts = [
        {display: 'Alphabetical' },
        {display: 'Count' }
    ];

    this.selectedSort = this.sorts[1];

    this.selectSort = function(s) {
        this.selectedSort = s;
    };
}]);

})();

