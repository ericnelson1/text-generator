var mongoose = require('./mongo');
var logger = require('winston');
var validator = require('validator');
var _ = require('underscore');

var config = {
  host: 'http://localhost:5000'
};

// define schema
var LinkSchema = new mongoose.Schema({
    url: String, 
    submitted: { type: Date, default: Date.now }, 
    processed: { type: Boolean, default: false },
    textsize: { type: Number, default: 0 },
    text: String, 
    stats: {} 
  }, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
// define virtual properties for urls that do not get persisted
LinkSchema.virtual('texturl').get(function() { 
  return config.host + '/api/text/' + this.id; 
});
LinkSchema.virtual('statsurl').get(function() { 
  var base = config.host + '/api/stats/' + this.id + '/depth/';
  return [
    { depth: 1, url: base + '1' },
    { depth: 2, url: base + '2' },
    { depth: 4, url: base + '4' }
  ];
});
// attach the schema to the model
var Link = mongoose.model('Link', LinkSchema);

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
  select = select||'url submitted processed textsize';
  return Link.find(query).select(select).sort({submitted:-1}).exec().then(function(links) {
    logger.info('got links');
    return links;
  }).catch(function(err) {
    logger.error('error getting links', err);
    throw err;
  });
};

exports.getById = function(id, select) {
  select = select||'url submitted processed textsize';
  return Link.findById(id).select(select).exec().then(function(link) {
    logger.info('got link by id', id);
    return link;
  }).catch(function(err) {
    logger.error('error getting link by id', err);
    throw err;
  });
};

exports.getStats = function (id, depth) {
  logger.info('link repo: getting stats ', id, depth);
  return Link.findById(id).select('stats').exec().then(function(link) {
    logger.info('link repo: got stats ', id);
    var o = _.findWhere(link.stats, {depth: depth});
    logger.info('link repo: find where succeeded');
    var x = o.stats.sort(function(x,y) { return y.sum - x.sum; }).slice(0, 500);
    logger.info('sort succeeded');
    return x;
  }).catch(function(err) {
    logger.error('link repo: error getting stats', err);
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

exports.update = function(newlink) {
  return Link.findById(newlink._id).exec().then(function(link) {
    logger.info('found link', link.url);
    link.processed = newlink.processed;
    link.textsize = newlink.textsize;
    link.text = newlink.text;
    link.stats = newlink.stats;
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

