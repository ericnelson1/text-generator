var express = require('express');
var	bodyParser = require('body-parser');  // use express body parser instead?
var validator = require('validator');

var worker = require('./worker');
var repo = require('./repo');
var logger = require('./log'); // configures winston logging

var app = module.exports.app = exports.app = express();
app.use(bodyParser.json()); // support json encoded bodies
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('app'));
app.use(express.static('bower_components'));

//you won't need 'connect-livereload' if you have livereload plugin for your browser 
//app.use(require('connect-livereload')());
//app.use(express.static('public'));

var config = {
	processDups: true
};

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
	repo.getLinks().then(function(links) {
		res.json(links);
	}).error(function(err) { 
    	logger.error('error getting links', err); 
    	res.status(500).json({
    		message: 'error getting links',
    		error: err	
    	})
    });
});

app.post('/api/links', function(req, res) {
	var url = req.body.data.url;

	if (!url.match(/^((?:f|ht)tps?:)?\/\//)) {
		url = 'http://' + url;	
	}

	if (!validator.isURL(url)) {
		logger.info('invalid url', url);
		res.status(400).json({
			url: url,
			message: 'invalid url'
		});
		return;
	}
	repo.addLink(url).then(function(result) {
		// addlink returns 0 if link already exists
		if (!config.processDups && !result) {
			res.status(202).json({
				url: url,
				message: 'Url is already in the catalog'
			});
			return;
		}
		// queue the work for processing
		worker.process({url:url});
		// send our response
		res.json({ 
			url: url,
			linkCount: result
		});
	}).error(function(err) {
    	logger.error('error adding link', err); 
		res.status(500).json({
			url: url,
			message: 'error adding link',
			error: err
		});
	});
});
 
app.get('/api/links/processed', function(req, res) {
	repo.getProcessedLinks().then(function(links) {
		res.json(links);
	}).error(function(err) {
    	logger.error('error getting processed links', err); 
		res.status(500).json({
			url: url,
			message: 'error getting processed links',
			error: err
		});
	});
});

app.get('/api/links/unprocessed', function(req, res) {
	repo.getUnprocessedLinks().then(function(links) {
		res.json(links);
	}).error(function(err) {
    	logger.error('error getting unprocessed links', err); 
		res.status(500).json({
			url: url,
			message: 'error getting unprocessed links',
			error: err
		});
	});
});

app.listen(3000);

console.log("listening on port 3000");

