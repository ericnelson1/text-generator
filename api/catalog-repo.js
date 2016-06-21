var mongoose = require('./mongo');
var logger = require('winston');
var Promise = require('bluebird');
var _ = require('underscore');

// define schema
var CatalogOneSchema = new mongoose.Schema({
  _id: String,
  v: {},
  r: Number
});

var CatalogOne = mongoose.model('CatalogOne', CatalogOneSchema);

exports.update = function(link) {
  var one = _.findWhere(link.stats, { depth: 2 });

  var promises = _.map(one.stats, function(val, key){
      // try to find the entry
      return CatalogOne.findById(key).exec().then(function(entry) {
        if (!entry) {
          logger.info('create new entry');
          // create a new entry, revision 1
          var cat = new CatalogOne({_id: key, v: val, r:1 });           
          return cat.save();
        }
        // update the existing entry, increment revision
        _.each(val, function(eval, ekey) {
          if (!(ekey in entry.v)) 
            entry.v[ekey] = 0;
          entry.v[ekey] += eval;
        });
        // optimistic locking, only update if revision is unchanged
        return CatalogOne.findOneAndUpdate({_id: key, r: entry.r++}, entry);
        // todo: handle retries
      }).catch(function(err) {
        logger.info('error updating catalog');
        throw err;
      });
  });

  return Promise.all(promises);
};

exports.get = function (depth) {
  if (depth === 1) {
  }
}

