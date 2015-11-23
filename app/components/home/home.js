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
	});

})();