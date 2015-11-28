var logger = require('winston');
var _ = require('underscore');

var	redis = require('redis'),
    client = redis.createClient();

// promisify redis
var bluebird = require('bluebird'); 
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// log events that the redis client emits
client
.on('ready', function() { logger.info('connected to redis')})
.on('reconnecting', function() { logger.info('reconnecting to redis')})
.on('end', function() { logger.info('redis connection ended')})
.on('error', function (err) { logger.error('redis error', err) })

exports.getLinks = function() {
    return client.zrange('links', 0, -1);
};

exports.addLink = function(url) {
	return client.zadd('links', 0, url)
    	.fail(function(err) { logger.error('error adding link', url, err); });
};

exports.updateCatalog = function(stats, catalog) {
	_.each(stats, function(element, index) {
		client.saddAsync(catalog, index).then(function(result) {
			_.each(element, function (count, letter) {
				return client.hincrby(catalog + ':' + index, letter, count);
			})
		});
	}); 
};

//client.quit();
