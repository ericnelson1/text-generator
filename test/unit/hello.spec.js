var assert = require('chai').assert;
//var expect = require('chai').expect;

describe('hello', function() {
  it('says hello', function() {
    //expect(1).toBe(1);
    assert.equal(1, 1);
    //expect(1).to.equal(1);
  }); 
  it('says bye', function() {
    assert.equal(1, 1);
  }); 
}); 


