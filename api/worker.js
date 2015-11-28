var kue = require('kue'),
    queue = kue.createQueue();

var	redis = require('redis'),
    client = redis.createClient();

var	textget = require('./text-get'),
	textstats = require('./text-stats'),
	catalog = require('./text-catalog');

var stream = require('stream');

queue.process('textstats', function(job, done) {
	var url = job.data.url;
	var depth = job.data.depth;

	textget.get(url).then(function(text) {

		var s = new stream.Readable();
		s._read = function noop() {}; 
		s.push(text);
		s.push(null);

		return textstats.getStatsKey(s, depth);
	})
	.then(function(textcounts) {
		console.log(textcounts);
		catalog.update(textcounts, 1);
		client.zadd('links', 1, url);
		done && done();
	})
	.fail(function(error) {
		console.log('process error:', error);
	});
});

exports.process = function (input) {
	var job = queue.create('textstats', input);
	job
		.on('enqueue', function () {
			console.log('Job', job.id, 'with url', job.data.url, 'is queued');
		})
		.on('complete', function (result) {
			console.log('Job', job.id, 'with url', job.data.url, 'is done with result', result);
		})
		.on('failed', function (error) {
			console.log('Job', job.id, 'with url', job.data.url, 'has failed', error);
		})	
		.on('progress', function (progress, data) {
			console.log('Job', job.id, 'is', progress, '% complete with data ', data);	
		})
		.save(function (err) {
			if (err) { console.log('Error saving job', job.id, 'error', err); }
		});
};

