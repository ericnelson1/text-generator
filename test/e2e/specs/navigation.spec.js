//var expect = require('chai').expect;
var navigation = require('../pages/navigation.page');

describe('Navigation: ', function () {

  beforeEach(function () {
    navigation.goHome();
  });

  it('should navigate to the about page', function (done) {
    console.log('entering');
    navigation.goAbout()
      .then(function () {
        console.log('inside');
        //expect(navigation.isPage('about-page')).to.be(true);
        console.log('calling done');
        done();
      })
      .catch(function() {
        console.log('error happened');
      });
  });

  it('should navigate to the submit page', function (done) {
    navigation.goSubmit()
      .then(function () {
        //expect(navigation.isPage('submit-page')).to.be(true);
        done();
      });
  });

  it('should navigate to the catalog page', function (done) {
    navigation.goCatalog()
      .then(function () {
        //expect(navigation.isPage('catalog-page')).to.be(true);
        done();
      });
  });

  it('should navigate to the stats page', function (done) {
    navigation.goStats()
      .then(function () {
        //expect(navigation.isPage('stats-page')).to.be(true);
        done();
      });
  });


});

