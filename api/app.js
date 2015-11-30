var express = require('express');
var bodyParser = require('body-parser');  // use express body parser instead?
var _ = require('underscore');

var logger = require('./log'); // configures winston logging
var worker = require('./worker');
var repo = require('./repo');
var linkrepo = require('./link-repo');

var app = module.exports.app = exports.app = express();
app.use(bodyParser.json()); // support json encoded bodies
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('app'));
app.use(express.static('bower_components'));

//you won't need 'connect-livereload' if you have livereload plugin for your browser 
//app.use(require('connect-livereload')());
//app.use(express.static('public'));

app.get('/api', function(req, res) {
  var host = 'http://' + req.headers.host;
  res.json({
    links: host + '/api/links',
    processed: host + '/api/links/processed',
    unprocessed: host + '/api/links/unprocessed',
    stats: host + '/api/stats'
  });
});

app.get('/api/links', function(req, res) {
  linkrepo.get().then(function(links) {
    res.json(links);
  }).catch(function(err) { 
    res.status(500).json({
      message: 'error getting links',
      error: err  
    })
  });
});

app.post('/api/links', function(req, res) {
  var url = req.body.data.url;
  linkrepo.validate(url).then(function(url) {
    return linkrepo.add(url);
  }).then(function(link) {
    // queue the work for processing
    worker.process(link);
    res.json(link); 
  }).catch(linkrepo.ValidationError, function(err) {
    res.status(400).json({
      url: url,
      message: 'invalid url',
      error: err
    });
  }).catch(function(err) {
    res.status(500).json({
      url: url,
      message: 'error adding link',
      error: err
    });
  });
});
 
app.get('/api/links/processed', function(req, res) {
  linkrepo.get({ processed: true }).then(function(links) {
    res.json(links);
  }).catch(function(err) {
    res.status(500).json({
      message: 'error getting processed links',
      error: err
    });
  });
});

app.get('/api/links/unprocessed', function(req, res) {
  linkrepo.get({ processed: false }).then(function(links) {
    res.json(links);
  }).catch(function(err) {
    res.status(500).json({
      message: 'error getting unprocessed links',
      error: err
    });
  });
});

app.get('/api/text/:id', function(req, res) {
  // req.params.id
  res.send('hello world');
});

app.listen(3000);

console.log("listening on port 3000");

