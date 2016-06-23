(function() {
'use strict';

angular.module('app.controllers')
	.controller('HomeController', function() {

		this.chardepths = [
			{display: 'One Character', depth: 1},
			{display: 'Two Characters', depth: 2},
			{display: 'Four Characters', depth: 4},
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