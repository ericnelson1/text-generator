var gulp = require("gulp"),
  //jade = require('gulp-jade'),
  less = require('gulp-less'),
  //sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  //notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  livereload = require('gulp-livereload'),
  lr = require('tiny-lr'),
  server = lr(),
  svr = require('gulp-express'),
  plumber = require('gulp-plumber'); // keeps gulp running

gulp.task('styles', function() {
  return gulp.src('src/styles/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(minifycss())
    .pipe(rename('style.min.css'))
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/styles'));
    //.pipe(notify({message: 'Styles task complete'}));
});

gulp.task('scripts', function() {
  return gulp.src('src/scripts/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(uglify())
    .pipe(rename('script.min.js'))
    .pipe(livereload(server))
    .pipe(livereload())
    .pipe(gulp.dest('dist/scripts'));
    //.pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts'], {read: false})
    .pipe(clean());
});

gulp.task('default', ['clean'], function() {
  gulp.run('styles', 'scripts');
});

gulp.task('copy', function () {
  gulp.src('./node_modules/angular/angular.min.js').pipe(gulp.dest('./public/lib/angular'));
  gulp.src('./node_modules/angular-new-router/dist/router.es5.min.js').pipe(gulp.dest('./public/lib/angular'));
});

// basic way to watch files
gulp.task('watch', function() {
  gulp.watch('src/styles/*.less', ['styles']);
  gulp.watch('src/scripts/*.js', ['scripts']);
});

// log to console while watching files
gulp.task('watch2', function() {

  //var server = livereload();
    // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    };

    gulp.watch('public/index.html', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      livereload(server);
    });

    gulp.watch('src/styles/**/*.less', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.run('styles');
    });

    gulp.watch('src/scripts/**/*.js', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      gulp.run('scripts');
    });
  });
});

gulp.task('server', function() {
  svr.run(['app.js']);

  gulp.watch(['public/index.html'], function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    svr.notify();
  });
  
});
