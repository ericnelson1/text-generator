var	redis = require('redis'),
    client = redis.createClient(),
    kue = require('kue'),
    queue = kue.createQueue(),
    request = require('request'),
    ineed = require('ineed'),
    stream = require('stream'),
	_ = require('underscore'),
	stats = require('./text-stats');

queue.process('textstats', function(job, done) {
	ineed.collect.texts.from({url: job.data.url}, function(err, response, result) {
		if (!err && response.statusCode === 200) {
			// result = { texts: ['string1', 'string2']}
			_.each(result.texts, function(element, index, list) {
				// remove tags and short strings
				if (element.match(/^</) || element.length < 25) {
					delete list[index];	
				}
			});
			var text = result.texts.join(' ');
			console.log(text);

			var s = new stream.Readable();
			s._read = function noop() {}; 
			s.push(text);
			s.push(null);

			stats.getStats(s, job.data.depth).then(function(textcount) {
				console.log('output:', textcount);
			},
			function(error){
				console.log('error:', error);
			});	
		}
	});
	job.progress(2, 10);
	job.progress(4, 10);
	job.progress(6, 10);
	job.progress(8, 10);
	job.progress(10, 10);
	client.zadd('links', 1, job.data.url);
	console.log('job', job.id, 'is done');
	done && done();
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
