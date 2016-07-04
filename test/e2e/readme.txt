install protractor and webdriver:
npm install -g protractor
webdriver-manager update

to start webdriver-manager server:
webdriver-manager start

to run protractor in interactive mode:
cd .\test\e2e
protractor --elementExplorer 

to debug at a point in the code
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
browser.pause();
go into interactive mode via repl

to run test suites:
protractor conf.js --suite=<suitename>
