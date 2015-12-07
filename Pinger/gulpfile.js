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

    gulp.task("clean", function () {
        return del(distDir);
    });

    function buildClient(clientName) {

        var makeTaskName = function(taskName) {
            return [clientName, taskName].join("_");
        };

        var clientSrcDir = srcDir + "/" + clientName;
        var clientDistDir = distDir + "/" + clientName;

        var clientContentFiles = clientSrcDir + "/content/**/*.html";
        var clientScriptFiles = clientSrcDir + "/scripts/**/*.js";
        var clientStyleFiles = clientSrcDir + "/styles/**/*.css";

        var clientFiles = [clientContentFiles, clientScriptFiles, clientStyleFiles];

        var lintTaskName = makeTaskName("lint");
        var copyFilesTaskName = makeTaskName("copyFiles");

        gulp.task(lintTaskName, function () {
            return gulp.src(clientScriptFiles)
                .pipe(jshint())
                .pipe(jshint.reporter("default"));
        });

        gulp.task(copyFilesTaskName, function () {
            return gulp.src(clientFiles)
                .pipe(gulp.dest(clientDistDir));
        });

        // TODO: add a helper function to create taskname and then create a task with that taskname and add the taskname to an array.

        return [lintTaskName, copyFilesTaskName];
    };

    gulp.task("build", function (done) {

        var args = [];
        args.push("clean");

        var clients = ["nofw", "ng1"];
        clients.forEach(function(client) {
            var clientTaskNames = buildClient(client);
            args = args.concat(clientTaskNames);
        });

        args.push(done);

        sequence.apply(null, args);
    });

    gulp.task("default", ["build"]);

}());
