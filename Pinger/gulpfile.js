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

    function buildClient(clientName) {

        var taskNames = [];

        var createFullTaskName = function (taskName) {
            return [clientName, taskName].join("_");
        };

        var createTask = function(taskName, fn) {
            var fullTaskName = createFullTaskName(taskName);
            gulp.task(fullTaskName, fn);
            taskNames.push(fullTaskName);
        };

        var clientSrcDir = srcDir + "/" + clientName;
        var clientDistDir = distDir + "/" + clientName;

        var clientHtmlFiles = clientSrcDir + "/html/**/*.html";
        var clientJsFiles = clientSrcDir + "/js/**/*.js";
        var clientCssFiles = clientSrcDir + "/css/**/*.css";
        var clientLibFiles = clientSrcDir + "/lib/**/*.js";

        var clientFiles = [
            clientHtmlFiles,
            clientJsFiles,
            clientCssFiles,
            clientLibFiles
        ];

        createTask("lint", function() {
            return gulp.src(clientJsFiles)
                .pipe(jshint())
                .pipe(jshint.reporter("default"));
        });

        createTask("copyFiles", function() {
            return gulp.src(clientFiles)
                .pipe(gulp.dest(clientDistDir));
        });

        gulp.task(clientName, function (done) {
            var args = [];
            args = args.concat(taskNames);
            args.push(done);
            sequence.apply(null, args);
        });

        return clientName;
    };

    gulp.task("build", function (done) {
        var buildClientTaskNames = clients.map(buildClient);
        var args = ["clean", buildClientTaskNames, done];
        sequence.apply(null, args);
    });

    gulp.task("default", ["build"]);

}());
