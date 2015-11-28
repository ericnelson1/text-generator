var	redis = require('redis'),
    client = redis.createClient();

var _ = require('underscore');

exports.update = function(stats, catalog) {
	client.select(catalog);

	_.each(stats, function(element, index, list) {
			
	}); 

};


