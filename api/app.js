var express = require('express');
var bodyParser = require('body-parser');  // or use express body parser instead?
var textEngine = require('./text-engine');

var app = module.exports.app = exports.app = express();
app.use(bodyParser.json()); // support json encoded bodies
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//app.use(express.static('dist'));

//you won't need 'connect-livereload' if you have livereload plugin for your browser 
//app.use(require('connect-livereload')());
//app.use(express.static('public'));

app.get('/api', function(req, res) {
	res.send(textEngine.getEntries());
});
 
app.get('/api/text/:id', function(req, res) {
	var entry = textEngine.getEntry(req.params.id);
    res.send(entry);
});

app.post('/api/text', function(req, res) {
	textEngine.process(req.body.url);
	res.send({a:'hello', b:'bye', c: req.body.id});
});
 
app.listen(3000);
console.log("listening on port 3000");

