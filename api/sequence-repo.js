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
  var one = _.findWhere(link.stats, { depth: 1 });

  var promises = _.map(one, function(item){
      // try to find the entry
      return Sequence.findById(item.seq).exec().then(function(sequence) {
        if (!sequence) {
          logger.info('create new sequence');
          // create a new sequence, revision 1
          var seq = new Sequence({
            _id: item.seq, 
            dist: item.dist,  
            depth: 1,
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

