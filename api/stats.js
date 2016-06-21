var _ = require('underscore');

exports.get = function(text, depth) {

  var txt = text
    .toLowerCase()
    .replace(/[^a-z]+/g, '_');

  if (txt.length <= depth+1) 
    return [];

  var stats = {};

  var s = txt.substring(0,depth);
  for (var i = depth; i < txt.length; i++) {
    if (!(s in stats)) {
      stats[s] = { };
    }
    if (!(txt[i] in stats[s])) {
      stats[s][txt[i]] = 1;
    }
    else {
      stats[s][txt[i]]++;
    }
    s += txt[i];
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

exports.generate = function(stats, length) {

  var total = _.reduce(stats, function(memo, elem) {
    return elem['sum'] + memo;  
  }, 0);

  var rand = _.random(0,total-1);

  var counter = 0;

  var el = _.findKey(stats, function(elem) {
    counter += elem['sum'];
    return rand < counter;
  });

  return { r: rand, c: counter, e: el };
}


