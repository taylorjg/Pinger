/// <binding AfterBuild='build' Clean='clean' />

var gulp = require("gulp");
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var sequence = require("run-sequence");
var del = require("del");

var srcDir = "./client";
var distDir = "./bin/debug/dist";
var scriptFiles = srcDir + "/scripts/**/*.js";
var contentFiles = srcDir + "/content/**/*.html";

gulp.task("lint", function () {
    return gulp.src(scriptFiles)
        .pipe(jshint()) // TODO: Pass options to jshint.
        .pipe(jshint.reporter("default"));
});

gulp.task("copyContentFiles", function () {
    return gulp.src(contentFiles).pipe(gulp.dest(distDir));
});

gulp.task("copyScriptFiles", function () {
    return gulp.src(scriptFiles).pipe(gulp.dest(distDir));
});

gulp.task("copyFiles", ["copyContentFiles", "copyScriptFiles"]);

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
