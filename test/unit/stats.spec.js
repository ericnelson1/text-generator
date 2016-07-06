var expect = require('chai').expect;
var stats = require('../../api/stats');

describe('stats', function() {

  it('gets basic stats', function() {
    var text = 'hello';
    var s = stats.get(text, 1);
    expect(s.length).to.equal(3);
  }); 

  it('removes non-alpha characters', function() {
    var text = 'abc123def!@#';
    var s = stats.get(text, 1);
    expect(s.length).to.equal(7); // a,b,c,d,e,f,_
  }); 

}); 

