// Task runner


var gulp = require('gulp');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');

gulp.task('lint', function() {
   return gulp.src(['./src/**/**.ts','./test/**/**.test.ts'
   ]).pipe(tslint({
	   formatter: "verbose"
   }))
   .pipe(tslint.report());
});

gulp.task('tsc', function() {
   return gulp.src(['./src/**/**.ts','./test/**/**.test.ts'
   ]).pipe(ts()
   ).pipe(gulp.dest('./temp/src/js'));
});

gulp.task('Mydefault', function() {
   console.log('Hello Gulp!');
});

gulp.task('default', ['Mydefault','lint']);

