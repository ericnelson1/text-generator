var mongoose = require('./mongo');
var stats = require('./stats');
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


var updateDepth = function(stats, depth) {
  return _.map(stats, function(item){
    // try to find the entry
    return Sequence.findById(item.seq).exec().then(function(sequence) {
      if (!sequence) {
        // create a new sequence, revision 1
        var seq = new Sequence({
          _id: item.seq, 
          dist: item.dist,  
          depth: depth,
          rev:1,
          sum: item.sum
        });           
        return seq.save();
      }
      // update the existing distribution
      _.each(item.dist, function(val, key) {
        if (!(key in sequence.dist)) 
          sequence.dist[key] = 0;
        sequence.dist[key] += val;
      });
      // update the sum
      sequence.sum = _.reduce(sequence.dist, function(sum, item) {
        return sum + item;
      }, 0);
      // optimistic locking, only update if revision is unchanged
      return Sequence.findOneAndUpdate({_id: item.seq, rev: sequence.rev++}, sequence);
      // todo: handle retries
    }).catch(function(err) {
      logger.info('sequence repo: error updating catalog', err);
      throw err;
    });
  });
};


exports.update = function(link) {
  var promises = _.map(link.stats, function(stats) {
    return updateDepth(stats.stats, stats.depth);
  });
  return Promise.all(_.flatten(promises));
};

exports.getStats = function (depth) {
  return Sequence.find({depth: depth}).select('_id dist sum').exec().then(function (results) {
    logger.info('got sequence result ', depth, ' ', results.length);
    return _.map(results, function(val, key) {
      return { seq: val._id, dist: val.dist, sum: val.sum };
    });
  }).catch(function(err) {
    logger.info('sequence repo: error getting sequences for stats', err);
    throw err;
  });
}

exports.getText = function(depth) {
  return Sequence.find({depth: depth}).select('_id dist sum').exec().then(function (results) {
    logger.info('got sequence result ', depth, ' ', results.length);
    return stats.generate(results, depth);
  }).catch(function(err) {
    logger.info('sequence repo: error getting sequences for text generation', err);
    throw err;
  });
};

