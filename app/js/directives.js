(function() {
'use strict';

angular.module('app.directives', [])

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
