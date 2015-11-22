(function() {
'use strict';

angular.module('app.controllers', [])
.controller('NavigationController', ['$scope',
	function ($scope) {
		$scope.options = [
			{ key: 'home', display: 'Home'},
			{ key: 'about', display: 'About' },
			{ key: 'submit', display: 'Submit' },
			{ key: 'links', display: 'Links' },
			{ key: 'stats', display: 'Statistics' }
		];
	}]);

})();
		/*
.controller('LinksController', ['$scope', '$location', '$window', 'linkService',
	function ($scope, $location, $window, linkService) {
		linkService.load(app.linksUrl).then(function (data) {
			// split data into 4 columns
			var linksPerCol = data.length / 4;
			$scope.lists = [
				data.splice(0, linksPerCol),
				data.splice(0, linksPerCol),
				data.splice(0, linksPerCol),
				data
			];
		});
	}])
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
		//	if ($('input[@name='sort']:checked').val() == 'pop')
		//		drawit(popsort);
		//	else
		//		drawit(alphasort);
		//});
	
	}])

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


		*/












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

		this.myclick = function () {
			this.quote = this.quote + 'a';
		};

		this.quote = 'to_be_or_not_to_be_that_is_the_question_whether_tis_nobler_in_the_mind_to_suffer_the_slings_and_arrows_of_outrageous_fortune_or_to_take_arms_against_a_sea_of_troubles';
		this.sequence1 = chunk(this.quote, 1);
		this.sequence4 = chunk(this.quote, 4);
		this.sequence8 = chunk(this.quote, 8);

	}]);

})();

(function() {
'use strict';

angular.module('app.controllers', [])
	.controller('HomeController', function() {

		this.chardepths = [
			{display: 'One Character', depth: 1},
			{display: 'Four Characters', depth: 4},
			{display: 'Eight Characters', depth: 8},
		];

		this.selected = this.chardepths[1];
		this.select = function(s) {
			this.selected = s;
		}
	});

})();
(function() {
'use strict';

angular.module('app.controllers')
.controller('StatsController', 
  function() {
 
});

})();
(function() {
'use strict';

angular.module('app.controllers')
.controller('SubmitController', 
  function() {
 
  });

})();
(function() {
'use strict';

//var underscore = angular.module('underscore', []);
//underscore.factory('_', function ()
//{ return window._; });

angular.module('app', [
    'ui.bootstrap',
    'ngNewRouter',
	'app.controllers'
	])
    .controller('AppController', ['$router', '$location',
		function ($router, $location) {

        $router.config([
             { path: '/', redirectTo: '/home' },
             { path: '/home', component: 'home' },
             { path: '/about', component: 'about' },
             { path: '/submit', component: 'submit' },
             { path: '/stats', component: 'stats' }
           ]);

        this.options = [
            { key: 'home', display: 'Home'},
            { key: 'about', display: 'About' },
            { key: 'submit', display: 'Submit' },
            { key: 'stats', display: 'Statistics' }
        ];

        this.isActive = function(location) {
            return ('/' + location === $location.path());
        };
    }]);

})();