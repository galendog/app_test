// Task runner

const config = require("./gulpconfig.json");
const gulp = require("gulp");
const tslint = require("gulp-tslint");
const ts = require("gulp-typescript");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const minimist = require("minimist");
const del = require("del");
const gulpif = require("gulp-if");

const debug = require("gulp-debug");
const util = require("util");

var sourceFiles = config.src.concat(config.tstsrc);
var generatedFiles = [];
generatedFiles.push(config.devDest);
generatedFiles.push(config.tstDest);

gulp.task("clean", () => {
    process.stdout.write(`Paths to generated files that will be deleted: ${generatedFiles}\n`);
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
    var knownenvvars = {
        string: "env",
        default: {env: process.env.Message || "no message found"}
    };

    var envvars = minimist(process.argv.slice(2), knownenvvars);
    var cmdvars = minimist(process.argv.slice(2), knownenvvars);
    process.stdout.write(`The command line argument prod is ${cmdvars.prod}\n`);
    
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
    var knownenvvars = {
        string: "env",
        default: {env: process.env.Message || "no message found"}
    };

    var envvars = minimist(process.argv.slice(2), knownenvvars);
    var cmdvars = minimist(process.argv.slice(2), knownenvvars);

    return gulp.src(config.prodSrc
    ).pipe(debug({
        title: "scripts to minimize"
    })).pipe(uglify()
    ).pipe(debug({
        title: "concatenating"
    })).pipe(concat("all.min.js"
    )).pipe(gulp.dest(config.prodDest
    )).pipe(debug({
        title: "destination for the application files"
    }));
});

gulp.task("Test", () => {
    var knownenvvars = {
        string: "env",
        default: {env: process.env.Message || "no message found"}
    };

    var envvars = minimist(process.argv.slice(2), knownenvvars);
    var cmdvars = minimist(process.argv.slice(2), knownenvvars);

    process.stdout.write(util.format("process.env.test = %s\n", process.env.test));
    process.stdout.write(util.format("process.execArgV = %s\n", process.execArgv));
    process.stdout.write(util.format("process.argv = %s\n", process.argv));
    process.stdout.write(util.format("command line parameters are : %s\n", cmdvars));
    process.stdout.write(util.format("envvars.env = %s\n", envvars.env));
    process.stdout.write(`The command line argument prod is ${cmdvars.prod}`);
});

gulp.task("default", ["tsc"]);
