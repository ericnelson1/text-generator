var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  nodemon = require('gulp-nodemon'),
  wiredep = require('wiredep');

var config = {
  js: ['./**/*.js', '!node_modules/**', '!bower_components/**']
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
gulp.task('watch', function() {
  gulp.watch(config.js, ['jshint']);
});

gulp.task('default', ['watch']);

