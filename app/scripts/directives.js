(function() {
'use strict';

angular.module('app.directives', [])

.directive('barChart', ['$window', function ($window) {
    return {
        restrict: 'EA',
        scope: { 
          data: '='
        },
        link: function (scope, element, attrs) {

          var chartWidth = 800;
          var chartHeight = 200;
          var barHeight = 15;

          var max = d3.max(scope.data, function (d) { return d.c; });
          var xscale = d3.scale.linear()
            .domain([0, max])
            .range([0, chartWidth]);

          var svg = d3.select(element[0])
            .append('svg')
            .attr('width', chartWidth)
            .attr('height', chartHeight);

          var group = svg.selectAll('g') 
            .data(scope.data)
            .enter()
            .append('g');

          group.append('rect')
            .attr("x", 40)
            .attr("y", function (d, i, j) { return (barHeight*i) + (i); })
            .attr("width", function (d, i, j) { return xscale(d.c); })
            .attr("height", barHeight)
            .attr("fill", function (d, i, j) {
              return '#337ab7';
            });

          group.append('text')
            .attr("x", 0)
            .attr("y", function (d, i, j) { return (barHeight*i) + (i); })
            .attr('dy', 10)
            .text(function(d) { return d.s; });
        }
    };
}])

.directive('d3Bars', ['$window', '$timeout', 
  function($window, $timeout) {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        depth: '='
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

        scope.$watch('[data, depth]', function() {
          scope.render();
        }, true);

        scope.render = function() {
          svg.selectAll('*').remove();   

          if (!scope.data || !scope.data.length) return;
          if (renderTimeout) clearTimeout(renderTimeout);

          renderTimeout = $timeout(function() {
            var stats = scope.data.find(function(x) { return x.depth === scope.depth + 1; });
            if (!stats) return;
            
            var data = d3.entries(stats.stats).sort(function(a,b) { 
                return b.value.sum - a.value.sum; 
            });

            var width = d3.select(element[0])[0][0].offsetWidth - (2*margin),
              height = data.length * (barHeight + barPadding),
              color = d3.scale.category20c(),
              xScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                  return d.value.sum; 
                })])
                .range([0, width-totalMargin-space]);

            svg.attr('height', height);

            var group = svg.selectAll('g')
              .data(data)
              .enter()
              .append('g');

            group.append('rect')
              .attr('height', barHeight)
              .attr('width', 140)
              .attr('x', margin + totalMargin + space)
              .attr('y', function(d,i) {
                return i * (barHeight + barPadding);
              })
              .attr('fill', function(d) {
                return color(d.value.sum); 
              })
              .transition()
              .duration(1000)
              .attr('width', function(d) {
                return xScale(d.value.sum); 
              });

            group.append('text')
              .attr('fill', 'black')
              .attr('text-anchor', 'end')
              .attr('y', function(d,i) {
                return (i+1) * (barHeight + barPadding) - 5;
              })
              .attr('x', margin + numberMargin)
              .text(function(d) {
                return d3.format(',')(d.value.sum);  
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

          }, 200);
        };
      }
    };
}])

.directive('mathjaxBind', function () {
    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
                function ($scope, $element, $attrs) {
                    $scope.$watch($attrs.mathjaxBind, function (texExpression) {
                        var texScript = angular.element("<script type='math/tex'>")
                            .html(texExpression ? texExpression : '');
                        $element.html('');
                        $element.append(texScript);
                        MathJax.Hub.Queue(['Reprocess', MathJax.Hub, $element[0]]);
                    });
                }]
    };
});

})();

