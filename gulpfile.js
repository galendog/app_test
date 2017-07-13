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

var sourceFiles = config.src.concat(config.tstsrc);
var generatedFiles = [];
generatedFiles.push(config.dest);
generatedFiles.push(config.tstdest);

gulp.task("clean", () => {
    console.log(`Paths to generated files that will be deleted: ${generatedFiles}`);
    return del(generatedFiles);
});

gulp.task("lint", ["clean"], () => {
    return gulp.src(sourceFiles
    ).pipe(debug({
	    title:"source files to lint"
    })).pipe(tslint({
	    configuration: "./tslint.json",
	    formatter: "stylish"
    })).pipe(tslint.report({
        summarizeFailureOutput: false
    }));
});

gulp.task("tsttsc", ["clean", "lint"], () => {
    return gulp.src(config.tstsrc
    ).pipe(debug({
        title:"test source files to generate"
    })).pipe(ts()
    ).pipe(gulp.dest(config.tstdest)
    ).pipe(debug({
        title: "destination for the files to test the application"
    }));
});

gulp.task("tsc", ["clean", "lint","tsttsc"], () => {
    return gulp.src(config.src
    ).pipe(debug({
	 title: "source files to generate"
    })).pipe(ts()
    ).pipe(gulp.dest(config.dest)
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
    
    console.log("process.env.test = ", process.env.test);
    console.log("process.execArgV = ", process.execArgv);
    console.log("process.argv = ", process.argv);
    console.log("command line parameters are :", envvars);
    console.log("envvars.env = ", envvars.env);
});

gulp.task("default", ["tst"]);

