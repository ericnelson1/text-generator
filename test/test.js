var fs = require('fs');
var ts = require('./text-stats');
var _ = require('underscore');

var stream = fs.createReadStream('./kant.txt');
ts.getStatsKey(stream, 4)
	.then(function(stats) {
		console.log(stats);
		var sum = _.reduce(stats, function(memo, elem) {
			return elem['sum'] + memo;	
		}, 0);
		console.log(sum);

		var e = ts.generateText(stats, 10);
		console.log(e);
	});

