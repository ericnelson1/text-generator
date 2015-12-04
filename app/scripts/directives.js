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
        data: '='
      },
      link: function(scope, element, attrs) {

        var renderTimeout;
        var margin = parseInt(attrs.margin) || 15,
            barHeight = parseInt(attrs.barHeight) || 15,
            barPadding = parseInt(attrs.barPadding) || 1,
            textMargin = parseInt(attrs.textMargin) || 50;

        var svg = d3.select(element[0])
          .append('svg')
          .style('width', '100%');

        $window.onresize = function() {
          scope.$apply();
        };

        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data);
        });

        scope.$watch('data', function(newData) {
          scope.render(newData);
        }, true);

        scope.render = function(data) {
          svg.selectAll('*').remove();  // can i use svg.empty() ?

          if (!data) return;
          if (renderTimeout) clearTimeout(renderTimeout);

          renderTimeout = $timeout(function() {
            var dat = d3.entries(data).sort(function(a,b) { 
                return b.value.sum - a.value.sum; 
              });
            var width = d3.select(element[0])[0][0].offsetWidth - margin,
                height = dat.length * (barHeight + barPadding),
                color = d3.scale.category20c(),
                xScale = d3.scale.linear()
                  .domain([0, d3.max(dat, function(d) {
                    return d.value.sum; //score
                  })])
                  .range([textMargin, width - textMargin]);

            svg.attr('height', height);

            svg.selectAll('rect')
              .data(dat)
              .enter()
              .append('rect')
              .attr('height', barHeight)
              .attr('width', 140)
              .attr('x', Math.round(margin/2) + textMargin)
              .attr('y', function(d,i) {
                return i * (barHeight + barPadding);
              })
              .attr('fill', function(d) {
                return color(d.value.sum); //score
              })
              .transition()
              .duration(1000)
              .attr('width', function(d) {
                return xScale(d.value.sum); //score
              });

            svg.selectAll('text')
              .data(dat)
              .enter()
              .append('text')
              .attr('fill', 'black')
              .attr('y', function(d,i) {
                return i * (barHeight + barPadding) + margin;
              })
              .attr('x', margin)
              .text(function(d) {
                return d.key + ' ' + d.value.sum;  //name
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

