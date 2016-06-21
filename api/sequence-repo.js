var mongoose = require('./mongo');
var logger = require('winston');
var Promise = require('bluebird');
var _ = require('underscore');

// define schema
var SequenceSchema = new mongoose.Schema({
  _id: String,
  dist: {},
  depth: Number,
  rev: Number,
  sum: Number
});

var Sequence = mongoose.model('Sequence', SequenceSchema);

exports.update = function(link) {
  var one = _.findWhere(link.stats, { depth: 2 });

  var promises = _.map(one.stats, function(val, key){
      // try to find the entry
      return Sequence.findById(key).exec().then(function(sequence) {
        if (!sequence) {
          logger.info('create new sequence');
          var sum = val.sum;
          delete val.sum;
          // create a new sequence, revision 1
          var seq = new Sequence({
            _id: key, 
            dist: val,  
            depth: 1,
            rev:1,
            sum: sum
          });           
          return seq.save();
        }
        // update the existing sequence, increment revision
        _.each(val, function(eval, ekey) {
          if (!(ekey in sequence.dist)) 
            sequence.dist[ekey] = 0;
          sequence.dist[ekey] += eval;
        });
        sequence.sum = _.reduce(sequence.dist, function(sum, item) {
          return sum + item;
        }, 0);
        // optimistic locking, only update if revision is unchanged
        return Sequence.findOneAndUpdate({_id: key, rev: sequence.rev++}, sequence);
        // todo: handle retries
      }).catch(function(err) {
        logger.info('error updating catalog');
        throw err;
      });
  });

  return Promise.all(promises);
};

exports.getStats = function (depth) {
  return Sequence.find({depth: depth}).select('_id dist sum').exec().then(function (results) {
    logger.info('got sequence result ', depth, ' ', results.length);
    return _.map(results, function(val, key) {
      return { seq: val._id, dist: val.dist, sum: val.sum };
    });
  }).catch(function(err) {
    logger.info('error getting sequences', err);
    throw err;
  });

}

