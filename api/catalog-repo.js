var mongoose = require('./mongo');
var logger = require('winston');
var Promise = require('bluebird');
var _ = require('underscore');

// define schema
var CatalogSchema = new mongoose.Schema({
  _id: String,
  stats: {},
  depth: Number,
  rev: Number,
  sum: Number
});

var Catalog = mongoose.model('Catalog', CatalogSchema);

exports.update = function(link) {
  var one = _.findWhere(link.stats, { depth: 2 });

  var promises = _.map(one.stats, function(val, key){
      // try to find the entry
      return Catalog.findById(key).exec().then(function(entry) {
        if (!entry) {
          logger.info('create new entry');
          var sum = val.sum;
          delete val.sum;
          // create a new entry, revision 1
          var cat = new Catalog({
            _id: key, 
            stats: val,  
            depth: 1,
            rev:1,
            sum: sum
          });           
          return cat.save();
        }
        // update the existing entry, increment revision
        _.each(val, function(eval, ekey) {
          if (!(ekey in entry.v)) 
            entry.stats[ekey] = 0;
          entry.stats[ekey] += eval;
        });
        entry.sum = _.reduce(entry.stats, function(sum, item) {
          return sum + item;
        }, 0);
        // optimistic locking, only update if revision is unchanged
        return Catalog.findOneAndUpdate({_id: key, rev: entry.rev++}, entry);
        // todo: handle retries
      }).catch(function(err) {
        logger.info('error updating catalog');
        throw err;
      });
  });

  return Promise.all(promises);
};

exports.getStats = function (depth) {
  if (depth === 1) {
  }
}

