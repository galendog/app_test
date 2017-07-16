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

const debug = require("gulp-debug");
const util = require("util");

var sourceFiles = config.src.concat(config.tstsrc);
var generatedFiles = [];
generatedFiles.push(config.dest);
generatedFiles.push(config.tstdest);

gulp.task("clean", () => {
    process.stdout.write(`Paths to generated files that will be deleted: ${generatedFiles}`);
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

gulp.task("tsttsc", ["clean", "tslint"], () => {
    return gulp.src(config.tstsrc
    ).pipe(debug({
        title: "test source files to generate"
    })).pipe(ts()
    ).pipe(gulp.dest(config.tstdest)
    ).pipe(debug({
        title: "destination for the files to test the application"
    }));
});

gulp.task("tsc", ["clean", "tslint", "tsttsc"], () => {
    var knownenvvars = {
        string: "env",
        default: {env: process.env.Message || "no message found"}
    };

    var envvars = minimist(process.argv.slice(2), knownenvvars);
    var cmdvars = minimist(process.argv.slice(2), knownenvvars);

    return gulp.src(config.src
    ).pipe(debug({
         title: "source files to generate"
    })).pipe(ts()
    ).pipe(gulp.dest(config.dest)
    ).pipe(debug({
        title: "destination for the application files"
    }));
});

gulp.task("prod", ["clean", "tslint", "tsttsc"], () => {
    var knownenvvars = {
        string: "env",
        default: {env: process.env.Message || "no message found"}
    };

    var envvars = minimist(process.argv.slice(2), knownenvvars);
    var cmdvars = minimist(process.argv.slice(2), knownenvvars);

    return gulp.src(config.src
    ).pipe(debug({
         title: "source files to generate"
    })).pipe(ts()
    ).pipe(gulp.dest(config.dest)
    ).pipe(debug({
        title: "destination for the application files"
    })).pipe(debug({
        title: "scripts to minimize"
    })).pipe(uglify()
    ).pipe(debug({
        title: "Concating"
    })).pipe(concat("all.min.js")
    ).pipe(gulp.dest("./prod")
    ).pipe(debug({
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

function prod(src, dest) {
    process.stdout.write(util.format("in prod src: %s, dest: %s\n", src, dest));
    return gulp.src(src
    ).pipe(debug({
        title: "scripts to minimize"
    })).pipe(uglify()
    ).pipe(debug({
        title: "Concating"
    })).pipe(concat("all.min.js")
    ).pipe(gulp.dest(dest)
    ).pipe(debug({
        title: "destination for the application files"
    }));
}
