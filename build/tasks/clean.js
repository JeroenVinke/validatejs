var gulp = require('gulp');
var paths = require('../paths');
var del = require('del');
var vinylPaths = require('vinyl-paths');

gulp.task('clean', function() {
  return gulp.src([paths.output])
    .pipe(vinylPaths(del));
});

gulp.task('clean-temp', function() {
  return gulp.src([paths.output + '/temp'])
    .pipe(vinylPaths(del));
});

gulp.task('clean-sample', function() {
  return gulp.src([paths.sample + '/dist'])
    .pipe(vinylPaths(del));
});
