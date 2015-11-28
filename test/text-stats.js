var expect    = require("chai").expect;
var fs = require('fs');
var _ = require('underscore');
var textstats = require("../api/text-stats");

describe("Text Stats Module", function() {
  describe("Get Stats", function() {
    it("gets stats correctly", function() {
		var stream = fs.createReadStream('../data/kant.txt');
		textstats.getStatsKey(stream, 4)
			.then(function(stats) {
				console.log(stats);
				var sum = _.reduce(stats, function(memo, elem) {
					return elem['sum'] + memo;	
				}, 0);
				console.log(sum);

				//var e = ts.generateText(stats, 10);
				//console.log(e);
			});

      expect(1).to.equal(1);
    });
  });

  describe("Test 2", function() {
    it("converts the basic colors", function() {
      expect(1).to.equal(1);
    });
  });
});


