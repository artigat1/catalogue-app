﻿/// <binding Clean='clean' ProjectOpened='default' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    batch = require("gulp-batch"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify");

var paths = {
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";
paths.lib = paths.webroot + "lib/";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("build:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("build:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("build", ["build:js", "build:css"]);

gulp.task("libs", function() {
    return gulp.src(["node_modules/materialize-css/dist/*"])
        .pipe(gulp.dest(paths.lib + "materialize-css"));
});

gulp.task("watch:js", function () {
    watch([paths.js, "!" + paths.minJs], { base: "." }, batch(function (events, done) {
        gulp.start("build:js", done);
    }));
});

gulp.task("watch:css", function () {
    watch([paths.css, "!" + paths.minCss], batch(function (events, done) {
        gulp.start("build:css", done);
    }));
});

gulp.task("watch", ["watch:js", "watch:css"]);

gulp.task("default", ["libs", "clean", "min", "watch"]);
