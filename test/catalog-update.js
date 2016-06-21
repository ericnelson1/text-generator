var _ = require('underscore');


var cat = {
  x: function () { 
    return _.findWhere(x, {depth: 2});
  },
  y: function () {
    var p = new Promise();
    p.then(function() {
      console.log('hello world');
    });
  } 
};

module.exports = cat; 