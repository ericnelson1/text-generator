var q = require('q');
var _ = require('underscore');

exports.getStats = function(stream, depth) {

	var defer = q.defer();

	var textcount = {};

	stream.on('readable', function(){
		var chunk; 
		while (null != (chunk = stream.read())) {
			chunk = chunk.toString('utf8')
				.toLowerCase()
				.replace(/[^a-z]+/g, '_');

			if (chunk.length > depth) {
				var s = chunk.substring(0,depth-1);
				for (var i = depth-1; i < chunk.length; i++) {
					s += chunk[i];

					if (!(s in textcount)) {
						textcount[s] = 1;
					}
					else {
						textcount[s]++;
					}
					s = s.substring(1,depth);
				}
			}
		}
	})
	.on('end', function() {
		defer.resolve(textcount);
	});

	return defer.promise;
}

exports.getStatsKey = function(stream, depth) {

	var defer = q.defer();

	var textcount = {};

	stream.on('readable', function(){
		var chunk; 
		while (null != (chunk = stream.read())) {
			chunk = chunk.toString('utf8')
				.toLowerCase()
				.replace(/[^a-z]+/g, '_');

			if (chunk.length > depth) {
				var s = chunk.substring(0,depth-1);
				for (var i = depth-1; i < chunk.length; i++) {

					if (!(s in textcount)) {
						textcount[s] = { 'sum':0 };
					}
					textcount[s]['sum']++;
					if (!(chunk[i] in textcount[s])) {
						textcount[s][chunk[i]] = 1;
					}
					else {
						textcount[s][chunk[i]]++;
					}
					s += chunk[i];
					s = s.substring(1,depth);
				}
			}
		}
	})
	.on('end', function() {
		defer.resolve(textcount);
	});

	return defer.promise;
}

exports.generateText = function(stats, length) {

	var defer = q.defer();

	var total = _.reduce(stats, function(memo, elem) {
		return elem['sum'] + memo;	
	}, 0);

	var rand = _.random(0,total-1);

	var counter = 0;

	var el = _.findKey(stats, function(elem) {
		counter += elem['sum'];
		return rand < counter;
	});

	return { r: rand, c: counter, e: el };
}


















