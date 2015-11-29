(function() {
'use strict';

angular.module('app.controllers')
.controller('StatsController', 
  function() {

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
});

})();