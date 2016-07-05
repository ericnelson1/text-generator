(function() {
'use strict';

angular.module('app.directives')

.directive('horizontalChart', ['$window', '$timeout', 
  function($window, $timeout) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        mouseover: '='
      },
      link: function(scope, element, attrs) {

        var renderTimeout;
        var margin = parseInt(attrs.margin) || 15,
            barHeight = parseInt(attrs.barHeight) || 15,
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
          svg.selectAll('*').remove();   

          if (!scope.data || !scope.data.length) return;
          if (renderTimeout) clearTimeout(renderTimeout);

          renderTimeout = $timeout(renderit, 200);
          
          function renderit() {

            var data = scope.data.sort(function(x,y) {
              return d3.descending(x.sum, y.sum);
            });

            var width = d3.select(element[0])[0][0].offsetWidth - (2*margin),
              height = data.length * (barHeight + barPadding),
              color = d3.scale.category20c(),
              xScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                  return d.sum; 
                })])
                .range([0, width-totalMargin-space]);

            svg.attr('height', height);

            var group = svg.selectAll('g')
              .data(data)
              .enter()
              .append('g');

            group.append('rect')
              .on('mouseover', scope.mouseover)
              .attr('height', barHeight)
              .attr('width', 140)
              .attr('x', margin + totalMargin + space)
              .attr('y', function(d,i) {
                return i * (barHeight + barPadding);
              })
              .attr('fill', function(d) {
                return color(d.sum); 
              })
              .transition()
              .duration(1000)
              .attr('width', function(d) {
                return xScale(d.sum); 
              });

            group.append('text')
              .attr('fill', 'black')
              .attr('text-anchor', 'end')
              .attr('y', function(d,i) {
                return (i+1) * (barHeight + barPadding) - 5;
              })
              .attr('x', margin + numberMargin)
              .text(function(d) {
                return d3.format(',')(d.sum);  
              });

            group.append('text')
              .attr('fill', 'black')
              .attr('text-anchor', 'end')
              .attr('y', function(d,i) {
                return (i+1) * (barHeight + barPadding) - 5;
              })
              .attr('x', margin + totalMargin)
              .text(function(d) {
                return d.seq;  
              });
          }
        };
      }
    };
}]);

})();

