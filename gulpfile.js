var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  wiredep = require('wiredep'),
  merge = require('merge-stream'),
  lr = require('tiny-lr'),
  server = lr();
  //svr = require('gulp-express'),

gulp.task('styles', function() {
  return gulp.src('./app/styles/*.less')
    .pipe(plugins.plumber()) // keep gulp running
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.concat('style.css'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename('style.min.css'))
    .pipe(plugins.livereload(server))
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
    .pipe(plugins.livereload(server))
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
      .pipe(gulp.dest('./dist'))
  );
});

gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts'], {read: false})
    .pipe(clean());
});

gulp.task('default', ['clean'], function() {
  gulp.run('styles', 'scripts');
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
