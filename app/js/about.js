(function() {
'use strict';

angular.module('app.controllers')
.controller('AboutController', [
	function () {
		var vm = this;

		vm.expression1 = '27^1 = ' + (Math.pow(27, 1)).toLocaleString();
		vm.expression2 = '27^2 = ' + (Math.pow(27, 2)).toLocaleString();
		vm.expression4 = '27^4 = ' + (Math.pow(27, 4)).toLocaleString();

		function chunk(array, chunkSize) {
			var retArr = [];
			for (var i = 0; i < array.length - (chunkSize - 1) ; i++) {
				retArr.push({ str: array.slice(i, i + chunkSize), begin: i });
			}
			return retArr;
		}

		vm.quote = 'to_be_or_not_to_be_that_is_the_question_whether_tis_nobler_in_the_mind_to_suffer_the_slings_and_arrows_of_outrageous_fortune_or_to_take_arms_against_a_sea_of_troubles';
		
		vm.sequence1 = chunk(vm.quote, 1);
		vm.sequence4 = chunk(vm.quote, 2);
		vm.sequence8 = chunk(vm.quote, 4);

	}]);

})();
