(function() {
'use strict';

angular.module('app.controllers')
.controller('StatsController', ['Stats', '$stateParams', '$scope',
  function(Stats, $stateParams, $scope) {

    var vm = this;

    vm.depths = [
      {display: 'One Character', depth: 1},
      {display: 'Two Characters', depth: 2},
      {display: 'Four Characters', depth: 4},
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

    vm.mouseover = function(d, i) {
      vm.dist = _.map(letters, function(letter) {
        return { key: letter, value: d.dist[letter] || 0 };
      });
      $scope.$apply();
    }

}]);

})();

