var _ = require('underscore');

function get(text, depth) {

  // make text lowercase and turn all non-alpha chars into a single space
  text = text
    .toLowerCase()
    .replace(/[^a-z]+/g, '_');

  if (text.length <= depth+1) 
    return [];

  var stats = {};

  var s = text.substring(0,depth);
  for (var i = depth; i < text.length; i++) {
    if (!(s in stats)) {
      stats[s] = { };
    }
    if (!(text[i] in stats[s])) {
      stats[s][text[i]] = 1;
    }
    else {
      stats[s][text[i]]++;
    }
    s += text[i];
    s = s.substring(1,depth+1);
  }

  return _.map(stats, function(val, key) {
    return {
      seq: key,
      dist: val,
      sum: _.reduce(val, function(sum, item) { return sum + item; }, 0)
    };
  });
}

function initialSequence(stats) {

  // pick random starting sequence based on sums for distribution
  var total = _.reduce(stats, function(memo, elem) {
    return elem.sum + memo;  
  }, 0);

  var rand = _.random(0,total-1);

  var counter = 0;

  var key = _.findKey(stats, function(elem) {
    counter += elem.sum;
    return rand < counter;
  });
  
  return stats[key];

}

function generate (stats) {

  var seq = initialSequence(stats, depth);

  var text = seq._id;

  var rand = _.random(0,27);

  
  return seq;
}

module.exports = {
  get: get,
  generate: generate
};


