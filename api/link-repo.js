var mongoose = require('./mongo');
var logger = require('winston');
var validator = require('validator');

// define schema
var Link = mongoose.model('Link', {
  url: String, 
  submitted: { type: Date, default: Date.now }, 
  processed: { type: Boolean, default: false },
  text: String, 
  stats: {} 
});

// custom errors
function ValidationError(message) {
    this.message = message;
    this.name = "ValidationError";
    Error.captureStackTrace(this, ValidationError);
}
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;
exports.ValidationError = ValidationError;

// api
exports.get = function(query, select) {
  // Promise.promisify(Link.find)()
  select = select||'url submitted processed';
  return Link.find(query).select(select).exec().then(function(links) {
    logger.info('got links');
    return links;
  }).catch(function(err) {
    logger.error('error getting links', err);
    throw err;
  });
};

exports.add = function(url) {
  var link = new Link({url: url});
  return link.save().then(function(link) {
    logger.info('saved link', link.url);
    return link;
  }).catch(function(err) {
    logger.error('error saving link', err);
    throw err;
  });
};

exports.update = function(id, text, stats) {
  return Link.findById(id).exec().then(function(link) {
    logger.info('found link', link.url);
    link.text = text;
    link.stats = stats;
    return link.save();
  }).then(function(link) {
    logger.info('updated link', link.url);
    return link;
  }).catch(function(err) {
    logger.error('error updating link', err);
    throw err;
  });
};

exports.validate = function(url) {
  if (!url.match(/^((?:f|ht)tps?:)?\/\//)) {
    url = 'http://' + url;  
  }
  if (!validator.isURL(url)) {
    logger.info('invalid url', url);
    return Promise.reject(new ValidationError('invalid url'));
  }
  logger.info('validated url', url);
  return Promise.resolve(url);
};


