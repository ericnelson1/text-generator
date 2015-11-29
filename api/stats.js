var _ = require('underscore');

exports.get = function(text, depth) {

  var stats = {};

  var txt = text
    .toLowerCase()
    .replace(/[^a-z]+/g, '_');

  if (txt.length > depth) {
    var s = txt.substring(0,depth-1);
    for (var i = depth-1; i < txt.length; i++) {
      if (!(s in stats)) {
        stats[s] = { 'sum':0 };
      }
      stats[s]['sum']++;
      if (!(txt[i] in stats[s])) {
        stats[s][txt[i]] = 1;
      }
      else {
        stats[s][txt[i]]++;
      }
      s += txt[i];
      s = s.substring(1,depth);
    }
  }

  return stats;
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


















