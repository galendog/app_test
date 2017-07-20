// Task runner

/* tslint:disable:trailing-comma */
/* tslint:disable:no-console */

const config = require("./gulpconfig.json");
const gulp = require("gulp");
const tslint = require("gulp-tslint");
const ts = require("gulp-typescript");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const sourceMaps = require("gulp-sourcemaps");
const minimist = require("minimist");
const del = require("del");
const gulpIf = require("gulp-if");
const through = require("through2");

const debug = require("gulp-debug");
const util = require("util");

var sourceFiles = config.src.concat(config.tstsrc);
var generatedFiles = [];
generatedFiles.push(config.devDest);
generatedFiles.push(config.tstDest);

gulp.task("clean", () => {
    console.log(`Paths to generated files that will be deleted: ${generatedFiles}\n`);
    return del(generatedFiles);
});

gulp.task("tslint", ["clean"], () => {
    return gulp.src(sourceFiles
    ).pipe(debug({
        title: "source files to lint"
    })).pipe(tslint({
        configuration: "./tslint.json",
        formatter: "stylish"
    })).pipe(tslint.report({
        summarizeFailureOutput: false
    }));
});

gulp.task("tsttsc", ["tslint"], () => {
    return gulp.src(config.tstsrc
    ).pipe(debug({
        title: "test source files to generate"
    })).pipe(ts()
    ).pipe(gulp.dest(config.tstDest)
    ).pipe(debug({
        title: "destination for the files to test the application"
    }));
});

gulp.task("tsc", ["tsttsc"], () => {
    return gulp.src(config.src
    ).pipe(debug({
         title: "source files to generate"
    })).pipe(ts()
    ).pipe(gulp.dest(config.devDest)
    ).pipe(debug({
        title: "destination for the application files"
    }));
});

gulp.task("prod", ["tsc"], () => {
/* tslint:disable:object-literal-sort-keys */
    var knownenvvars = {
        string: "env",
        default: {env: process.env.Message || "no message found"}
    };
/* tslint:enable:object-literal-sort-keys */
    var envvars = minimist(process.argv.slice(2), knownenvvars);
    var cmdvars = minimist(process.argv.slice(2), knownenvvars);
    console.log(`The command line argument prod is ${cmdvars.prod}\n`);

    return gulp.src(config.prodSrc
    ).pipe(gulpIf(cmdvars.prod, debug({
        title: "files to minimize"
    }))).pipe(gulpIf(cmdvars.prod, uglify()
    )).pipe(gulpIf(cmdvars.prod, debug({
        title: "concatenating"
    }))).pipe(gulpIf(cmdvars.prod, concat("all.min.js"
    ))).pipe(gulpIf(cmdvars.prod, gulp.dest(config.prodDest)
    )).pipe(gulpIf(cmdvars.prod, debug({
        title: "destination for application files"
    })));
});

gulp.task("default", ["tsc"]);
