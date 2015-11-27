var express = require('express'),
	bodyParser = require('body-parser'),  // use express body parser instead?
	url = require('url'),
	redis = require('redis'),
    client = redis.createClient(),
    validator = require('validator'),
    worker = require('./worker');
    //bluebird = require('bluebird'),  // promisify redis


// promisify redis
//bluebird.promisifyAll(redis.RedisClient.prototype);
//bluebird.promisifyAll(redis.Multi.prototype);

var app = module.exports.app = exports.app = express();
app.use(bodyParser.json()); // support json encoded bodies
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('app'));
app.use(express.static('bower_components'));

//you won't need 'connect-livereload' if you have livereload plugin for your browser 
//app.use(require('connect-livereload')());
//app.use(express.static('public'));

// api root 
app.get('/api', function(req, res) {
	var hostname = req.headers.host;
	res.json({
		links: 'http://' + hostname + '/api/links',
		processed: 'http://' + hostname + '/api/links/processed',
		unprocessed: 'http://' + hostname + '/api/links/unprocessed',
		stats: 'http://' + hostname + '/api/stats'
	});
});

app.get('/api/links', function(req, res) {
    client.zrange('links', 0, -1, function(error, result) {
		res.json(result);
	});
});

app.post('/api/links', function(req, res) {
	var url = req.body.url;
	if (!validator.isURL(url)) {
		return res.status(400).json({
			url: url,
			message: 'Not a valid url'
		});
	}
	client.zadd('links', 0, url, function(error, result) {
		if (error) {
			return res.status(500).json({
				url: url,
				message: 'Error submitting url',
				error: error
			});
		}
		// if (!result) {
		// 	return res.status(202).json({
		// 		url: url,
		// 		message: 'Url is already in the catalog'
		// 	});
		// }
		worker.process({url:url,depth:4});
		res.json({ 
			url: url,
			linkCount: result
		});
	});
});
 
app.get('/api/links/processed', function(req, res) {
    client.zrangebyscore('links', 1, 1,	function(error, result) {
		res.json(result);
	});
});

app.get('/api/links/unprocessed', function(req, res) {
    client.zrangebyscore('links', 0, 0,	function(error, result) {
		res.json(result);
	});
});

app.get('/api/text/:id', function(req, res) {
	var entry = textEngine.getEntry(req.params.id);
    res.send(entry);
});

app.listen(3000);

console.log("listening on port 3000");

function init() {
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
	    //client.quit();
	});

	client.rpush('mylinks', 'hello');
	client.rpush('mylinks', 'world');
}