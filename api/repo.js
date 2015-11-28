var logger = require('winston');

var	redis = require('redis'),
    client = redis.createClient();

// promisify redis
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

// log events that the redis client emits
client
	.on('ready', function() { logger.info('connected to redis'); })
	.on('reconnecting', function() { logger.info('reconnecting to redis'); })
	.on('end', function() { logger.info('disconnected from redis'); })
	.on('error', function (err) { logger.error('redis error', err); })

exports.getLinks = function() {
    return client.zrangeAsync('links', 0, -1);
};

exports.addLink = function(url) {
	return client.zaddAsync('links', 0, url);
};

exports.processedLink = function(url) {
	return client.zaddAsync('links', 1, url);
};

exports.getProcessedLinks = function() {
    return client.zrangebyscoreAsync('links', 1, 1);
};

exports.getUnprocessedLinks = function() {
    return client.zrangebyscoreAsync('links', 0, 0);
};

exports.updateCatalog = function(stats, catalog) {
	return Promise.map(stats, function(element, index) {
		return client.saddAsync(catalog, index).then(function(result) {
			return Promise.map(element, function (count, letter) {
				return client.hincrby(catalog + ':' + index, letter, count);
			})
		});
	}); 
};

//client.quit();
