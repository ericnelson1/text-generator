var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  wiredep = require('wiredep');

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

gulp.task('default', ['bower']);

