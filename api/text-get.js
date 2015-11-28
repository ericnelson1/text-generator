var ineed = require('ineed');
var _ = require('underscore');
var q = require('q');

exports.get = function(url) {

	var defer = q.defer();

	ineed.collect.texts.from({url: url}, function(err, response, result) {
		if (err || response.statusCode !== 200) {
			console.log('ineed error:', err, 'response:', response);	
			defer.reject(err);
		}
		else {
			// result = { texts: ['string1', 'string2']}

			// clean text
			_.each(result.texts, function(element, index, list) {
				if (element.match(/^</) || element.match(/^\\/) || element.length < 25) {
					delete list[index];	
				}
			});

			// normalize text
			var text = result.texts
				.join(' ')
				.toLowerCase()
				.replace(/[^a-z]+/g, ' ');

			defer.resolve(text);
		}
	});

	return defer.promise;
};



