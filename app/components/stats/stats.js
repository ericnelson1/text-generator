(function() {
'use strict';

angular.module('app.controllers')
.controller('StatsController', ['Stats', 
  function(Stats) {

    this.stats = Stats.query({id: '565bce05ed6b1ba20d0c41f6' });

    this.domains = [
        {display: 'Full Catalog' },
        {display: 'Single Link' }
    ];

    this.selectedDomain = this.domains[0];

    this.selectDomain = function(d) {
        this.selectedDomain = d;
    };

    this.depths = [
        {display: 'One Character', depth: 1},
        {display: 'Four Characters', depth: 4},
        {display: 'Eight Characters', depth: 8}
    ];

    this.selectedDepth = this.depths[1];

    this.selectDepth = function(d) {
        this.selectedDepth = d;
    };

    this.charts = [
        {display: 'Bar Graph' },
        {display: 'Bubble Chart' }
    ];

    this.selectedChart = this.charts[0];

    this.selectChart = function(c) {
        this.selectedChart = c;
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

