/// <binding AfterBuild='build' Clean='clean' />

// ReSharper disable UndeclaredGlobalVariableUsing

(function () {

    "use strict";

    var gulp = require("gulp");
    var jshint = require("gulp-jshint");
    var sequence = require("run-sequence");
    var del = require("del");

    var srcDir = "./client";
    var distDir = "./bin/debug/dist";
    var contentFiles = srcDir + "/content/**/*.html";
    var scriptFiles = srcDir + "/scripts/**/*.js";
    var styleFiles = srcDir + "/styles/**/*.css";

    gulp.task("lint", function () {
        return gulp.src(["gulpfile.js", scriptFiles])
            .pipe(jshint())
            .pipe(jshint.reporter("default"));
    });

    gulp.task("copyFiles", function () {
        var allSrcs = [contentFiles, scriptFiles, styleFiles];
        return gulp.src(allSrcs).pipe(gulp.dest(distDir));
    });

    gulp.task("clean", function () {
        return del(distDir + "/*");
    });

    gulp.task("build", function (done) {
        sequence(
            "clean",
            "lint",
            "copyFiles",
            done);
    });

    gulp.task("default", ["build"]);

}());
