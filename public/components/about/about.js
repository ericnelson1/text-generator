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
		}

		this.myclick = function () {
			this.quote = this.quote + 'a';
		}

		this.quote = 'to_be_or_not_to_be_that_is_the_question_whether_tis_nobler_in_the_mind_to_suffer_the_slings_and_arrows_of_outrageous_fortune_or_to_take_arms_against_a_sea_of_troubles';
		this.sequence1 = chunk(this.quote, 1);
		this.sequence4 = chunk(this.quote, 4);
		this.sequence8 = chunk(this.quote, 8);

	}])
