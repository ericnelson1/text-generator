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











