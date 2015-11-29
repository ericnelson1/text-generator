(function() {
'use strict';

angular.module('app.directive')

.directive('barsChart', function ($parse) {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attrs) {

            scope.$watch(attrs.chartData, function (data) {
                if (!data) return;
                var dataArray = _.map(data, function (d) { return d.count; });
                var themax = Math.max.apply(Math, dataArray);

                var chart = d3.select(element[0])
                    .append('div').attr('class', 'chart')
                    .selectAll('div')
                    .data(data).enter().append('div');

                chart.append('div')
                    .attr('class', 'label')
                    .text(function (d) { return d.count; });

                chart.append('div').attr('class', 'bar').transition().ease('elastic')
                    .style('width', function (d) {
                        return ((d.count / themax) * 100) + '%';
                    })
                    .text(function (d) {
                        return d.character;
                    });

            });
        }
    };
})

.directive('mathjaxBind', function () {
    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
                function ($scope, $element, $attrs) {
                    $scope.$watch($attrs.mathjaxBind, function (texExpression) {
                        var texScript = angular.element('<script type='math/tex'>')
                            .html(texExpression ? texExpression : '');
                        $element.html('');
                        $element.append(texScript);
                        MathJax.Hub.Queue(['Reprocess', MathJax.Hub, $element[0]]);
                    });
                }]
    };
});

})();

