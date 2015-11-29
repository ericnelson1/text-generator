var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var logger = require('winston');

// connect
mongoose.connect('mongodb://localhost/textgen');

// setup event handlers
mongoose.connection
.on('error', function(err) { logger.error('mongo connection error', err); })
.once('open', function () { logger.info('connected to mongo'); });

// define schema
var Link = mongoose.model('Link', {
  url: String, 
  submitted: { type: Date, default: Date.now }, 
  text: String, 
  stats: {} 
});

// api
exports.getLinks = function() {
  // Promise.promisify(Link.find)()
  return Link.find().exec().then(function(links) {
    logger.info('got links');
    return links;
  }).error(function(err) {
    logger.error('error getting link by id', err);
  });
};

exports.getLinkById = function(id) {
  // Link.findOne({url: 'http://blahblah.com'}, function (err, userObj) {
  // Promise.promisify(Link.findById)(id)
  return Link.findById(id).exec().then(function(link) {
    logger.info('got link by id', link.url);
  }).error(function(err) {
    logger.error('error getting link by id', err);
  });
};

exports.addLink = function(url) {
  var link = new Link({url: url});
  return link.save().then(function() {
    logger.info('saved link', url);
  }).error(function(err) {
    logger.error('error saving link', err);
  });
};

exports.updateLink = function(id, text, stats) {
  return Link.findById(id).exec().then(function(link) {
    link.text = text;
    link.stats = stats;
    return link.save();
  }).then(function(link) {
    logger.info('updated link', link.url);
  }).error(function(err) {
    logger.error('error updateing link', err);
  });
};
