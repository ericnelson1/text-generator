var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  wiredep = require('wiredep'),
  merge = require('merge-stream');

var config = {
  scripts: [
      './app/scripts/directives.js', 
      './app/scripts/services.js', 
      './app/scripts/controllers.js', 
      './app/components/**/*.js',
      './app/scripts/app.js'
  ]
};

gulp.task('styles', function() {
  return gulp.src('./app/styles/*.less')
    .pipe(plugins.plumber()) // keep gulp running
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.concat('styles.css'))
    .pipe(gulp.dest('./app/styles'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename('styles.min.css'))
    .pipe(gulp.dest('./app/styles'))
    .pipe(plugins.livereload());
});

gulp.task('scripts', function() {
  return gulp.src(config.scripts)
    .pipe(plugins.plumber())
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.concat('scripts.js'))
    .pipe(gulp.dest('./app/scripts'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename('scripts.min.js'))
    .pipe(gulp.dest('./app/scripts'))
    .pipe(plugins.livereload());
});

gulp.task('views', function() {
  return merge(
    gulp.src('./app/index.html')
      .pipe(wiredep.stream({ignorePath: '../bower_components'}))
      .pipe(gulp.dest('./app'))
      .pipe(plugins.livereload())
  );
});

gulp.task('watch', function() {
  plugins.livereload.listen();
  gulp.watch('./app/**/*.html', ['views']);
  gulp.watch('./app/styles/**/*.less', ['styles']);
  gulp.watch('./app/**/*.js', ['scripts']);
});

gulp.task('start', function () {
  plugins.nodemon({
    script: 'api/app.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('build', ['scripts', 'styles', 'views']);
gulp.task('default', ['build', 'start', 'watch']);

