/// <binding AfterBuild='default' />

var gulp = require("gulp");
var jshint = require('gulp-jshint');

gulp.task("lint", function () {
    return gulp.src("./client/*.js")
      .pipe(jshint())
      .pipe(jshint.reporter("default"));
});

gulp.task("default", ["lint"], function () {
});
