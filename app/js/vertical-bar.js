(function() {
'use strict';

angular.module('app.directives')
.directive('verticalBarChart', ['$window', '$timeout', 
  function($window, $timeout) {
    return {
      restrict: 'A',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {

        var renderTimeout;
        var margin = parseInt(attrs.margin) || 15,
            barWidth = parseInt(attrs.barHeight) || 15,
            barPadding = parseInt(attrs.barPadding) || 1,
            textMargin = parseInt(attrs.textMargin) || 70,
            numberMargin = parseInt(attrs.numberMargin) || 70,
            totalMargin = numberMargin + textMargin,
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
              return d3.descending(x.key, y.key);
            });

            var height = 30,
              width = data.length * (barWidth + barPadding),
              color = d3.scale.category20c(),
              yScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                  return d.value; 
                })])
                .range([0, height-totalMargin-space]);

            svg.attr('height', height);

            var group = svg.selectAll('g')
              .data(data)
              .enter()
              .append('g');

            group.append('rect')
              .attr('height', 30)
              .attr('width', barWidth)
              .attr('x', function(d,i) {
                return i * (barWidth + barPadding);
              })
              .attr('y', space)
              .attr('fill', function(d) {
                return color(d.sum); 
              })
              .transition()
              .duration(1000)
              .attr('height', function(d) {
                return xScale(d.value); 
              });

            group.append('text')
              .attr('fill', 'black')
              .attr('text-anchor', 'end')
              .attr('y', function(d,i) {
                return (i+1) * (barHeight + barPadding) - 5;
              })
              .attr('x', margin + numberMargin)
              .text(function(d) {
                return d3.format(',')(d.value);  
              });

            group.append('text')
              .attr('fill', 'black')
              .attr('text-anchor', 'end')
              .attr('y', function(d,i) {
                return (i+1) * (barHeight + barPadding) - 5;
              })
              .attr('x', margin + totalMargin)
              .text(function(d) {
                return d.key;  
              });

          };
        };
      }
    };
}]);


})();

