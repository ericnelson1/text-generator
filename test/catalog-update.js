var _ = require('underscore');
var Promise = require('bluebird');

var data = {
  stats: {
    q:{u:679},
    z:{l:7,z:9,y:4,a:10 },
    v:{u:8,r:1}
  },
  depth: 2
};

var cat = {
  x: function () { 
    _.mapObject(data.stats, function(promise, key) {
      console.log(data.stats[key], key);
    });
  },
  y: function () {
    var p = new Promise();
    p.then(function() {
      console.log('hello world');
    });
  } 
};

module.exports = cat; 