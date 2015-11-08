var gulp = require("gulp");

gulp.task("copy", function () {
    gulp.src("./node_modules/angular/angular.min.js").pipe(gulp.dest("./public/lib/angular"));
    gulp.src("./node_modules/angular-new-router/dist/router.es5.min.js").pipe(gulp.dest("./public/lib/angular"));
});

