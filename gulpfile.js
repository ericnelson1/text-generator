var gulp = require('gulp'),
  util = require('gulp-util'),
  mocha = require('gulp-mocha'),
  jshint = require('gulp-jshint'),
  jasmineNode = require('gulp-jasmine-node'),
  nodemon = require('gulp-nodemon'),
  wiredep = require('wiredep');


//var protractor = require('gulp-protractor').protractor;
//var webdriver_standalone = require("gulp-protractor").webdriver_standalone;
var angularProtractor = require('gulp-angular-protractor');


var config = {
  js: ['api/**/*.js', 'app/**/*.js', 'test/**/*.js'],
  test: {
    unit: 'test/unit/**/*.spec.js',
    e2e: {
      specs: 'test/e2e/**/*.spec.js',
      config: 'test/e2e/conf.js'
    }
  }
};

gulp.task('bower', function () {
  return gulp.src('./app/index.html') 
    .pipe(wiredep.stream({
      ignorePath: '../bower_components/'  ,
      fileTypes: {
        html: { 
          replace: { 
            css: '<link rel="stylesheet" href="/lib/{{filePath}}"/>', 
            js: '<script src="/lib/{{filePath}}"></script>' 
          },
        }
      }
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('start', function () {
  return nodemon({
    script: 'api/app.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('jshint', function() {
  return gulp.src(config.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('unittest', function() {
  return gulp.src(config.test.unit)
    //.pipe(jasmineNode({timeout: 10000}));
    .pipe(mocha({reporter: 'spec'}))
    .on('error', util.log);
});

//gulp.task('webdriver_standalone', webdriver_standalone);

//gulp.task('e2e', ['webdriver_standalone'], function() {
//  return gulp.src(config.test.e2e.specs)
//    .pipe(protractor({configFile: config.test.e2e.config}))
//    .on('error', function(e) { throw e; });
//});

gulp.task('e2e', function(callback) {
  gulp.src(config.test.e2e.specs) 
    .pipe(angularProtractor({
      configFile: config.test.e2e.config,
      autoStartStopServer: true,
      debug: false 
    }))
    .on('error', function(e) { throw e; })
    .on('end', callback);
});

gulp.task('mytask', function() {
  util.log('mytask');
});

gulp.task('watch', function() {
  gulp.watch(config.js, ['jshint', 'mytask', 'unittest']);
});

gulp.task('default', ['watch']);

