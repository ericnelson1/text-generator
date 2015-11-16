var gulp = require("gulp");

var less = require('gulp-less');
//var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
//var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

gulp.task("copy", function () {
    gulp.src("./node_modules/angular/angular.min.js").pipe(gulp.dest("./public/lib/angular"));
    gulp.src("./node_modules/angular-new-router/dist/router.es5.min.js").pipe(gulp.dest("./public/lib/angular"));
});

gulp.task('js', function() {
      gulp.src([
              'bower_components/jquery/dist/jquery.js',
                  'bower_components/modernizr/modernizr.js'
                    ])
              .pipe( concat('output.min.js') ) // concat pulls all our files together before minifying them
        .pipe(uglify())
        .pipe(gulp.dest('build'))
});

gulp.task('css', function () {
        gulp.src('source/less/main.less')
            .pipe(less({compress: false, paths: ['source/less']}))
            //.pipe(autoprefixer())
            .pipe(minifyCSS())
            .pipe(rename('style.css'))
            .pipe(gulp.dest('build'))
});

gulp.task('watch', function () {
       gulp.watch('source/less/*.less', ['css']);
       gulp.watch('source/jade/*.jade', ['html']);
});

gulp.task('default', ['css', 'html', 'js']);
