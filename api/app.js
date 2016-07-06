var express = require('express');
var bodyParser = require('body-parser');  // use express body parser instead?
var controller = require('./controller');

var app = module.exports.app = exports.app = express(); //why?

var port = process.env.PORT || 5000;
app.set('port', port);

// support json encoded bodies
app.use(bodyParser.json()); 
//app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('app'));
app.use('/lib', express.static('node_modules'));

//you won't need 'connect-livereload' if you have livereload plugin for your browser 
//app.use(require('connect-livereload')());

controller.setupRoutes(app);

app.listen(port, function() {
  console.log('listening on port ', port); 
});


