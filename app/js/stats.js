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
 
    var refresh = function() {
      Stats.query({
        id: $stateParams.id || null,
        depth: vm.selectedDepth.depth 
      }, function(data) { 
        vm.stats = data; 
      });
    }

    refresh();

    var letters = 'abcdefghijklmnopqrstuvwxyz_'.split('');
    var dist = { x: 10, y: 20, z:30};
    vm.dist = _.map(letters, function(letter) {
      return { key: letter, value: dist[letter] || 0 };
    });

    vm.hover = function(seq) {
      vm.dist = _.findWhere(vm.stats, {seq: seq}).dist;
    }

}]);

})();

