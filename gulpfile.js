var gulp = require('gulp'),
    rework = require('gulp-rework'),
    rename = require('gulp-rename'),
    serve = require('gulp-serve'),
    prefix = require('gulp-autoprefixer'),
    suit = require('rework-suit'),
    imprt = require('rework-import');

gulp.task('styles', function() {
  gulp.src('main.css')
    .pipe(rework(imprt('.'), suit))
    .pipe(rename('combined.css'))
    .pipe(prefix("> 5%"))
    .pipe(gulp.dest('.'));
})

gulp.task('server', function() {
  gulp.run('styles');

  gulp.watch('*.css', function() {
    gulp.run('styles');
  });

  // Start a simple http server
  serve(__dirname)();
});