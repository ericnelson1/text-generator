var redis = require('redis'),
    bluebird = require('bluebird'),
    client = redis.createClient();

// promisify redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on('error', function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});

client.rpush('mylinks', 'hello');
client.rpush('mylinks', 'world');
 
exports.submitLink = function(entry) {
	client.set("");
};
 
exports.getLinks = function() {
    return client.lrangeAsync('mylinks', 0, -1);
};
 
