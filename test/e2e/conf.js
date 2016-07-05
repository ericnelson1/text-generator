exports.config = {
  baseUrl: 'http://localhost:5000',
  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'mocha',

  specs: ['./specs/**/*.spec.js'],

  suites: {
    navigation: './specs/navigation.spec.js' 
  },

  onPrepare: function() {
    browser.driver.manage().window().setPosition(0,0);
    browser.driver.manage().window().setSize(1280, 720);
  }
};

