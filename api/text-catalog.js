var	redis = require('redis'),
    client = redis.createClient();

var bluebird = require('bluebird');  // promisify redis

// promisify redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var _ = require('underscore');

exports.update = function(stats, catalog) {
	_.each(stats, function(element, index) {
		client.saddAsync(catalog, index).then(function(result) {
			_.each(element, function (count, letter) {
				return client.hincrby(catalog + ':' + index, letter, count);
			})
		});
	}); 
};


