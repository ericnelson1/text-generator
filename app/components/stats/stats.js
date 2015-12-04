(function() {
'use strict';

angular.module('app.controllers')
.controller('StatsController', ['Stats', 
  function(Stats) {

    var self = this;
    this.stats = Stats.query({id: '565bce05ed6b1ba20d0c41f6' });
    this.statsd2 = {};

    this.stats.$promise.then(function(d) {
        self.statsd2 = d[0].stats;
    });

    this.domains = [
        {display: 'Full Catalog' },
        {display: 'Single Link' }
    ];

    this.selectedDomain = this.domains[0];

    this.selectDomain = function(d) {
        this.selectedDomain = d;
        this.mydata.push({s: 'blah', c: 25});
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

/*


.controller('StatsController', ['$scope', '$location', '$window', 'sequenceService',
    function ($scope, $location, $window, sequenceService) {
        var drawit = function (sort) {
            $('.chart').empty();
            var width = 1000,
            barHeight = 24;
            var x = d3.scale.linear()
                .range([0, width]);

            var chart = d3.select('.chart')
                .attr('width', width);

            d3.tsv('../data/state_population.tsv', type, function (error, data) {

                data.sort(sort);

                x.domain([0, d3.max(data, function (d) { return d.Population; })]);
                var themax = d3.max(data, function (d) { return d.Population; });
                chart.attr('height', barHeight * data.length);

                var bar = chart.selectAll('g')
                    .data(data)
                    .enter().append('g')
                    .attr('transform', function (d, i) { return 'translate(220,' + i * barHeight + ')'; });
                bar.append('rect')
                    .attr('width', function (d) { return x(d.Population); })
                    .attr('height', barHeight - 1);
                bar.append('text')
                    .attr('x', -125)
                    .attr('y', barHeight / 2)
                    .attr('dy', '.35em')
                    .text(function (d) { return d.State; });
                bar.append('text')
                    .attr('x', -135)
                    .attr('y', barHeight / 2)
                    .attr('dy', '.35em')
                    .attr('text-anchor', 'end')
                    .text(function (d) { return Number(d.Population).toLocaleString('en'); });
            });
        };
        var type = function (d) {
            d.Population = +d.Population; // coerce to number
            return d;
        };

        var popsort = function (a, b) {
            return b.Population - a.Population;
        };

        var alphasort = function (a, b) {
            if (a.State < b.State) return -1;
            if (a.State > b.State) return 1;
            return 0;
        };

        sequenceService.load(app.sequencesUrl).then(function (data) {
            $scope.myData = data;
        });


        //$('input').change(function () {
        //  if ($('input[@name='sort']:checked').val() == 'pop')
        //      drawit(popsort);
        //  else
        //      drawit(alphasort);
        //});
    
    }])

*/