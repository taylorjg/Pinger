/// <binding AfterBuild='build' Clean='clean' />

// ReSharper disable UndeclaredGlobalVariableUsing

(function () {

    "use strict";

    var configurationName;
    try {
        var prebuild = require("./prebuild.json");
        configurationName = prebuild.configurationName;
    } catch (err) {
        console.log("Missing prebuild.json - using default values");
        configurationName = "Debug";
    }
    configurationName = configurationName.toLowerCase();
    console.log("configurationName: " + configurationName);

    var gulp = require("gulp");
    var jshint = require("gulp-jshint");
    var sequence = require("run-sequence");
    var del = require("del");

    var srcDir = "./clients";
    var distDir = "./bin/" + configurationName + "/dist";
    var clients = ["nofw", "ng1", "ng2js", "ng2ts", "react"];

    gulp.task("clean", function () {
        return del(distDir);
    });

    function makeClientBuildTask(clientName) {

        var clientSrcDir = srcDir + "/" + clientName;
        var clientDistDir = distDir + "/" + clientName;
        var clientHtmlFiles = clientSrcDir + "/*.html";
        var clientTemplateFiles = clientSrcDir + "/js/**/*.html";
        var clientJsFiles = clientSrcDir + "/js/**/*.js";
        var clientCssFiles = clientSrcDir + "/css/**/*.css";
        var clientLibFiles = clientSrcDir + "/lib/**/*.js";
        var clientFiles = [
            clientHtmlFiles,
            clientTemplateFiles,
            clientJsFiles,
            clientCssFiles,
            clientLibFiles
        ];
        var taskNames = [];

        var createFullTaskName = function (taskName) {
            return [clientName, taskName].join("_");
        };

        var createTask = function(taskName, dependencies, fn) {
            var fullTaskName = createFullTaskName(taskName);
            gulp.task(fullTaskName, dependencies, fn);
            taskNames.push(fullTaskName);
            return fullTaskName;
        };

        var lintTaskName = createTask("lint", [], function() {
            return gulp.src(clientJsFiles)
                .pipe(jshint())
                .pipe(jshint.reporter("default"));
        });

        var copyFilesTaskName = createTask("copyFiles", [lintTaskName], function() {
            return gulp.src(clientFiles)
                .pipe(gulp.dest(clientDistDir));
        });

        return copyFilesTaskName;
    };

    gulp.task("copyLandingPage", function () {
        return gulp.src(srcDir + "/index.html")
            .pipe(gulp.dest(distDir));
    });

    gulp.task("build", function (done) {
        var parallelClientBuildTaskNames = clients.map(makeClientBuildTask);
        sequence("clean", "copyLandingPage", parallelClientBuildTaskNames, done);
    });

    gulp.task("default", ["build"]);

}());
