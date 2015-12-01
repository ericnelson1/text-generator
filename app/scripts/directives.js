(function() {
'use strict';

angular.module('app.directives', [])

.directive('barChart', function () {
    return {
        restrict: 'EA',
        scope: { 
          chartData: '='
        },
        link: function (scope, element, attrs) {

          var chartWidth = 800;
          var chartHeight = 400;
          var barHeight = 10;

          var svg = d3.select(element[0])
            .append('svg')
            .attr('width', chartWidth)
            .attr('height', chartHeight);

          var group = svg.selectAll('g') 
            .data(scope.chartData)
            .enter()
            .append('g');

          group.append('rect')
            .attr("x", 40)
            .attr("y", function (d, i, j) { return (barHeight*i) + (i*5); })
            .attr("width", function (d, i, j) { return d.c * 10; })
            .attr("height", barHeight)
            .attr("fill", function (d, i, j) {
              return '#337ab7';
            });

          group.append('text')
            .attr("x", 0)
            .attr("y", function (d, i, j) { return (barHeight*i) + (i*5); })
            .attr('dy', 10)
            .text(function(d) { return d.s; });

        }
    };
})

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

