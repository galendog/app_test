// Task runner

var config = require('./gulpconfig.json');
var gulp = require('gulp');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var minimist = require('minimist');

gulp.task('lint', function() {
   return gulp.src(config.src, config.tstsrc
   ).pipe(tslint({
	   formatter: "verbose"
   }))
   .pipe(tslint.report());
});

gulp.task('tsttsc', function() {
   return gulp.src(config.tstsrc
   ).pipe(ts()
   ).pipe(gulp.dest(config.tstdest));
});

gulp.task('tsc', ['lint','tsttsc'], function() {
   return gulp.src(config.src
   ).pipe(ts()
   ).pipe(gulp.dest(config.dest));
});

gulp.task('Mydefault', function() {
 //   process.env.TEST = 1;    
    var knownenvvars = { 
        string: 'env',
	default: {env: process.env.Message || 'no message found'}
    };

    var envvars = minimist(process.argv.slice(2), knownenvvars);
	var cmdvars = minimist(process.argv.slice(2), knownenvvars);
    
    console.log('process.env.test = ', process.env.test);
    console.log('process.execArgV = ', process.execArgv);
    console.log('process.argv = ', process.argv);
    console.log('command line parameters are :', envvars);
    console.log('envvars.env = ', envvars.env);
});

gulp.task('default', ['Mydefault']);

