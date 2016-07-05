var expect = require('chai').expect;

var stats = require('../../api/stats');

describe('stats', function() {

  it('removes non-alpha characters', function() {
    var text = 'abc123def!@#';
    var s = stats.get(text, 1);
  }); 

  it('gets basic stats', function() {
    var text = 'hello';
    var s = stats.get(text, 1);
    expect(s.length).to.be(3);
  }); 
}); 

