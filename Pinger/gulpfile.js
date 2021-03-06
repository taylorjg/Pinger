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

    // ReSharper disable once NativeTypePrototypeExtending
    Array.prototype.last = function () {
        var len = this.length;
        return len > 0 ? this[len - 1] : undefined;
    }

    var gulp = require("gulp");
    var jshint = require("gulp-jshint");
    var sequence = require("run-sequence");
    var del = require("del");
    var ts = require('gulp-typescript');

    var srcDir = "./clients";
    var distDir = "./bin/" + configurationName + "/dist";
    var noFwClient = {
        name: "nofw"
    };
    var ng1Client = {
        name: "ng1"
    };
    var ng2TsClient = {
        name: "ng2ts",
        ts: true,
        libs: [
            "node_modules/systemjs/dist/system.src.js",
            "node_modules/reflect-metadata/Reflect.js",
            "node_modules/angular2/bundles/angular2-polyfills.js",
            "node_modules/angular2/bundles/angular2.dev.js",
            "node_modules/angular2/bundles/http.dev.js",
            "node_modules/angular2/bundles/router.dev.js",
            "node_modules/rxjs/bundles/Rx.js"
        ]
    };
    var ng2JsClient = {
        name: "ng2js"
    };
    var reactClient = {
        name: "react"
    };
    var clients = [noFwClient, ng1Client, ng2TsClient, ng2JsClient, reactClient];

    gulp.task("clean", function () {
        return del(distDir);
    });

    function makeClientBuildTask(client) {

        var clientName = client.name;
        var clientSrcDir = srcDir + "/" + clientName;
        var clientDistDir = distDir + "/" + clientName;
        var clientHtmlFiles = clientSrcDir + "/*.html";
        var clientTemplateFiles = clientSrcDir + "/js/**/*.html";
        var clientJsFiles = clientSrcDir + "/js/**/*.js";
        var clientTsFiles = clientSrcDir + "/app/**/*.ts";
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

        createTask("lint", [], function() {
            return gulp.src(clientJsFiles)
                .pipe(jshint())
                .pipe(jshint.reporter("default"));
        });

        if (client.ts) {
            var tsProject = ts.createProject(clientSrcDir + "/tsconfig.json");
            createTask("ts", [taskNames.last()], function () {
                return gulp
                    .src(clientTsFiles)
                    .pipe(ts(tsProject))
                    .pipe(gulp.dest(clientDistDir + "/app"));
            });
        }

        if (client.libs) {
            createTask("libs", [taskNames.last()], function () {
                return gulp.src(client.libs)
                    .pipe(gulp.dest(clientDistDir + "/lib"));
            });
        }

        createTask("copyFiles", [taskNames.last()], function () {
            return gulp.src(clientFiles)
                .pipe(gulp.dest(clientDistDir));
        });

        return taskNames.last();
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
