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


(function() {
'use strict';

angular.module('app.services', [])

.factory('Link', ['$resource',
    function ($resource) {
        return $resource('/api/links');
    }])

.factory('Stats', ['$resource',
    function ($resource) {
        return $resource('/api/stats/:id');
    }]);

})();


(function() {
'use strict';

angular.module('app.controllers', [])

.controller('AppController', ['$router', '$location',
    function ($router, $location) {

        $router.config([
             { path: '/', redirectTo: '/home' },
             { path: '/home', component: 'home' },
             { path: '/about', component: 'about' },
             { path: '/submit', component: 'submit' },
             { path: '/links', component: 'links' },
             { path: '/stats', component: 'stats' }
           ]);

        this.options = [
            { key: 'home', display: 'Home'},
            { key: 'about', display: 'About' },
            { key: 'submit', display: 'Submit' },
            { key: 'links', display: 'Links' },
            { key: 'stats', display: 'Statistics' }
        ];

        this.isActive = function(location) {
            return ('/' + location === $location.path());
        };
    }]);

})();


(function() {
'use strict';

angular.module('app.controllers')
.controller('AboutController', [
	function () {
		this.expression1 = '27^1 = ' + (Math.pow(27, 1)).toLocaleString();
		this.expression4 = '27^4 = ' + (Math.pow(27, 4)).toLocaleString();
		this.expression8 = '27^8 = ' + (Math.pow(27, 8)).toLocaleString();

		var chunk = function (array, chunkSize) {
			var retArr = [];
			for (var i = 0; i < array.length - (chunkSize - 1) ; i++) {
				retArr.push({ str: array.slice(i, i + chunkSize), begin: i });
			}
			return retArr;
		};

		this.quote = 'to_be_or_not_to_be_that_is_the_question_whether_tis_nobler_in_the_mind_to_suffer_the_slings_and_arrows_of_outrageous_fortune_or_to_take_arms_against_a_sea_of_troubles';
		
		this.sequence1 = chunk(this.quote, 1);
		this.sequence4 = chunk(this.quote, 4);
		this.sequence8 = chunk(this.quote, 8);

	}]);

})();

(function() {
'use strict';

angular.module('app.controllers')
	.controller('HomeController', function() {

		this.chardepths = [
			{display: 'One Character', depth: 1},
			{display: 'Four Characters', depth: 4},
			{display: 'Eight Characters', depth: 8},
		];

		this.selected = this.chardepths[1];

		this.select = function(s) {
			this.selected = s;
		};

		this.go = function() {
			this.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id es';
		};
	});

})();
(function() {
'use strict';

angular.module('app.controllers')
.controller('LinksController', ['validator', 'Link',
  function(validator, Link) {

    this.linkCollection = Link.query();
    this.displayCollection = [];
    
  }]);

})();
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


(function() {
'use strict';

angular.module('app.controllers')
.controller('SubmitController', ['validator', 'Link',
  function(validator, Link) {

  	this.submit = function() {
  		if (validator.isURL(this.url)) {
        var entry = new Link();
        entry.data = {url: this.url};
        var self = this;
        Link.save(entry, function(){
          self.url = '';
          self.message = 'Thank you for your submission'; 
        });
  		}	
  		else {
  			this.message = "That ain't a valid url, man";
  		}
  	};

  	this.change = function () {
  		this.message = '';
  	};

  }]);

})();
(function() {
'use strict';

angular.module('app', [
    'ui.bootstrap',
    'ngNewRouter',
    'ngResource',
    'smart-table',
    'app.directives',
    'app.services',
    'app.controllers'])

.constant('validator', window.validator);

})();

