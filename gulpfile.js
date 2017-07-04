// Task runner

var config = require('./gulpconfig.json');
var gulp = require('gulp');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');

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
   console.log('Hello Gulp!');
});

gulp.task('default', ['Mydefault']);

