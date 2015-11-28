var fs = require('fs');
var _ = require('underscore');
var textstats = require("../api/text-stats");
var catalog = require("../api/text-catalog");
var textget = require("../api/text-get");

exports.test = function() {
	var stream = fs.createReadStream('./data/kant.txt');
	textstats.getStatsKey(stream, 4)
		.then(function(stats) {
			console.log(stats);
			var sum = _.reduce(stats, function(memo, elem) {
				return elem['sum'] + memo;	
			}, 0);
			console.log(sum);

			var e = ts.generateText(stats, 10);
			console.log(e);
		});
};

exports.test2 = function() {
	var o = {
		x: { a: 1, b: 2, c: 3},
		y: { c: 2, d: 5},
		z: { f: 5 }
	};

	catalog.update(o, 'happycat');
};

exports.test3 = function () {
	textget.get('blah')
		.then(function() {console.log('test done'); })
		.fail(function() {console.log('test fail'); });
};

exports.test3();

