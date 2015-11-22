var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  wiredep = require('wiredep'),
  connect = require('gulp-connect'),
  merge = require('merge-stream');

gulp.task('styles', function() {
  return gulp.src('./app/styles/*.less')
    .pipe(plugins.plumber()) // keep gulp running
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.concat('style.css'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename('style.min.css'))
    .pipe(connect.reload())
    .pipe(gulp.dest('./dist/styles'));
    //.pipe(notify({message: 'Styles task complete'}));
});

gulp.task('scripts', function() {
  return gulp.src('./app/scripts/*.js')
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.concat('script.js'))
    .pipe(gulp.dest('./dist/scripts'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename('script.min.js'))
    .pipe(connect.reload())
    .pipe(gulp.dest('./dist/scripts'));
    //.pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('views', function() {
  return merge(
    gulp.src('./app/views/*.html').pipe(gulp.dest('./dist/views')),
    gulp.src('./app/404.html').pipe(gulp.dest('./dist')),
    gulp.src('./app/robots.txt').pipe(gulp.dest('./dist')),
    gulp.src('./app/favicon.ico').pipe(gulp.dest('./dist')),

    gulp.src('./app/index.html')
      .pipe(wiredep.stream())
      .pipe(connect.reload())
      .pipe(gulp.dest('./dist'))
  );
});

gulp.task('clean', function() {
  return gulp.src(['./dist'], {read: false})
    .pipe(clean());
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('watch', function() {
    gulp.watch('./app/**/*.html', ['views']);
    gulp.watch('./app/styles/**/*.less', ['styles']);
    gulp.watch('./app/scripts/**/*.js', ['scripts']);
});

gulp.task('build', ['scripts', 'styles', 'views']);
gulp.task('default', ['build', 'connect', 'watch']);

