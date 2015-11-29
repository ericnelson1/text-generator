var mongoose = require('mongoose');
var logger = require('winston');

// promisify
mongoose.Promise = require('bluebird');

// connect to mongo
mongoose.connect('mongodb://localhost/textgen');

// setup event handlers
mongoose.connection
  .on('error', function(err) { logger.error('mongo connection error', err); })
  .once('open', function () { logger.info('connected to mongo'); });

module.exports = mongoose;