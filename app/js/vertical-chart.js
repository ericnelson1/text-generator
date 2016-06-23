(function() {
'use strict';

angular.module('app.directives')

.directive('verticalChart', ['$window', '$timeout', 
  function($window, $timeout) {
    return {
      restrict: 'A',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {

        var renderTimeout;
        var barWidth = 30,
            barPadding = 1,
            space = 5;

        var svg = d3.select(element[0])
          .append('svg')
          .style('width', '100%');

        $window.onresize = function() {
          scope.$apply();
        };

        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render();
        });

        scope.$watchCollection('[data]', function() {
          scope.render();
        });

        scope.render = function() {

          if (!scope.data || !scope.data.length) return;

          svg.selectAll('*').remove();   

          if (renderTimeout) clearTimeout(renderTimeout);

          renderTimeout = $timeout(renderit, 200);

          function renderit() {

            var data = scope.data.sort(function(x,y) {
              return d3.ascending(x.key, y.key);
            });

            var height = 100,
              width = data.length * (barWidth + barPadding),
              color = d3.scale.category20c(),
              yScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.value; })])
                .range([height-30, 0]);

            var yaxis = d3.svg.axis()
              .scale(yScale)
              .orient('left')
              .ticks(3);

            var group = svg.selectAll('g')
              .data(data)
              .enter()
              .append('g');

            group.append('rect')
              .attr('transform', 'translate(108, 10)')
              .attr('height', function(d) { return height - 30 - yScale(d.value); })
              .attr('width', barWidth)
              .attr('x', function(d,i) {return i * (barWidth + barPadding); })
              .attr('y', function(d) { return yScale(d.value); })
              .attr('fill', function(d) {return color(d.value); });

            group.append('text')
              .attr('transform', 'translate(100, 0)')
              .attr('fill', 'black')
              .attr('text-anchor', 'end')
              .attr('x', function(d,i) {return (i+1) * (barWidth + barPadding) - 5; })
              .attr('y', 95)
              .text(function(d) {return d.key; });

            svg.attr('height', height)
              .append('g')
              .attr('class', 'axis')
              .attr('transform', 'translate(100, 10)')
              .call(yaxis);

          };
        };
      }
    };
}]);

})();

