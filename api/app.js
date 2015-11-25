var express = require('express');
var bodyParser = require('body-parser');  // or use express body parser instead?
var textEngine = require('./text-engine');
var url = require('url');

var app = module.exports.app = exports.app = express();
app.use(bodyParser.json()); // support json encoded bodies
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//app.use(express.static('dist'));

//you won't need 'connect-livereload' if you have livereload plugin for your browser 
//app.use(require('connect-livereload')());
//app.use(express.static('public'));

app.get('/api', function(req, res) {
	var hostname = req.headers.host;
	var root = {
		links: 'http://' + hostname + '/api/links',
		stats: 'http://' + hostname + '/api/stats'
	}
	res.send(root);
});

app.get('/api/links', function(req, res) {
	textEngine.getLinks().then(function(res) {
		res.send(res);
	});
});
 
app.post('/api/link', function(req, res) {
	textEngine.process(req.body.url);
	res.send({a:'hello', b:'bye', c: req.body.id});
});
 
app.get('/api/misc', function(req, res) {
	res.send(textEngine.getEntries());
});

app.get('/api/text/:id', function(req, res) {
	var entry = textEngine.getEntry(req.params.id);
    res.send(entry);
});

app.listen(3000);
console.log("listening on port 3000");

