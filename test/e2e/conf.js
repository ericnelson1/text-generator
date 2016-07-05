exports.config = {
  baseUrl: 'http://localhost:5000',

  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'jasmine',

  specs: ['./specs/**/*.spec.js'],

  suites: {
    navigation: './specs/navigation.spec.js' 
  },

  jasmineNodeOpts: {
    // remove default jasmine reporter
    print: function() {}
  },

  onPrepare: function() {
    browser.driver.manage().window().setPosition(0,0);
    browser.driver.manage().window().setSize(1280, 720);

    // add jasmine spec reporter
    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  }
};

