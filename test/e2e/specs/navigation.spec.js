var navigation = require('../pages/navigation.page');

describe('Navigation: ', function () {

  beforeEach(function () {
    navigation.goHome();
  });

  it('should navigate to the about page', function (done) {
    navigation.goAbout()
      .then(function () {
        expect(navigation.isPage('tg-about-page')).toBe(true);
      }).then(done);
  });

  it('should navigate to the submit page', function (done) {
    navigation.goSubmit()
      .then(function () {
        expect(navigation.isPage('tg-submit-page')).toBe(true);
        done();
      });
  });

  it('should navigate to the catalog page', function (done) {
    navigation.goCatalog()
      .then(function () {
        expect(navigation.isPage('tg-catalog-page')).toBe(true);
        done();
      });
  });

  it('should navigate to the stats page', function (done) {
    navigation.goStats()
      .then(function () {
        expect(navigation.isPage('tg-stats-page')).toBe(true);
        done();
      });
  });


});

