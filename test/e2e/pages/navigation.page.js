var locators = {
  home: element(by.linkText('Home')),
  about: element(by.linkText('About')),
  submit: element(by.linkText('Submit')),
  catalog: element(by.linkText('Catalog')),
  stats: element(by.linkText('Statistics')),
  page: function(pageid) { return element.all(by.css('#' + pageid)); }
};

var navigation = {
  goHome: function () {
    browser.get('/');
  },
  goAbout: function () {
    locators.about.click();
    return browser.waitForAngular();
  },
  goSubmit: function () {
    locators.submit.click();
    return browser.waitForAngular();
  },
  goCatalog: function () {
    locators.catalog.click();
    return browser.waitForAngular();
  },
  goStats: function () {
    locators.stats.click();
    return browser.waitForAngular();
  },
  isPage: function (pageid) {
    return locators.page(pageid).count()
      .then(function(count) {
        return count === 1;
      });
  }
};

module.exports = navigation;

