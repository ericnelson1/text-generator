var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  wiredep = require('wiredep'),
  connect = require('gulp-connect'),
  merge = require('merge-stream');

var config = {
  scripts: [
  ]
}

gulp.task('styles', function() {
  return gulp.src('./app/styles/*.less')
    .pipe(plugins.plumber()) // keep gulp running
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.concat('styles.css'))
    .pipe(gulp.dest('./app/styles'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename('styles.min.css'))
    .pipe(connect.reload())
    .pipe(gulp.dest('./app/styles'));
    //.pipe(notify({message: 'Styles task complete'}));
});

gulp.task('scripts', function() {
  return gulp.src([
      './app/controllers.js',
      './app/components/**/*.js',
      './app/app.js'])
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.concat('scripts.js'))
    .pipe(gulp.dest('./app/scripts'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename('scripts.min.js'))
    .pipe(connect.reload())
    .pipe(gulp.dest('./app/scripts'));
    //.pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('views', function() {
  return merge(
    gulp.src('./app/index.html')
      .pipe(wiredep.stream({ignorePath: '../bower_components'}))
      .pipe(connect.reload())
      .pipe(gulp.dest('./app'))
  );
});

gulp.task('connect', function() {
  connect.server({
    root: ['app', 'bower_components'],
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

