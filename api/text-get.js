var ineed = require('ineed');
var _ = require('underscore');
var q = require('q');
var logger = require('winston');

exports.get = function(url) {

	logger.info('getting text from url', url);

	var defer = q.defer();

	ineed.collect.texts.from({url: url}, function(err, response, result) {

		if (err || response.statusCode !== 200) {
			logger.error('ineed error', err, 'response:', response);	
			defer.reject(err);
			return;
		}

		// result = { texts: ['string1', 'string2']}

		// clean text
		_.each(result.texts, function(element, index, list) {
			element = element.trim();
			if (element.match(/^</) || element.match(/^\\/) || element.length < 25) {
				delete list[index];	
			}
		});

		// join and normalize text
		var text = result.texts
			.join(' ')
			.toLowerCase()
			.replace(/[^a-z]+/g, ' ');

		defer.resolve(text);
	});

	return defer.promise;
};



