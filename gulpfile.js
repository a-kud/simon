var gulp = require('gulp'),
    //jade = require('gulp-jade'),
    pug = require('gulp-pug'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'), // Notify of changes
    livereload = require('gulp-livereload'),
    del = require('del'), // Clean files for a clean build
    server = require('gulp-server-livereload'),
    pump = require('pump');

gulp.task('views', function() {
    return gulp.src('source/views/**/*.{jade,pug}')
        .pipe( pug() )
        .pipe(gulp.dest('build'))
})

gulp.task('styles', function() {
    return sass('source/sass/main.sass', {style: 'expanded'})
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('build/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('build/assets/css'))
        .pipe(notify({message: 'Styles task done.'}))
})

gulp.task('fonts', function() {
    return gulp.src(['source/assets/fonts/*'])
            .pipe(gulp.dest('build/assets/fonts/'));
})

gulp.task('scripts', function(cb) {
    function createErrorHandler(name) {
        return function (err) {
          console.error('Error from ' + name + ' in compress task', err.toString());
        };
      }

    pump([
        gulp.src(['source/assets/js/**/*.js', '!node_modules/**']),
        eslint(),
        eslint.format(),
        concat('main.js'),
        gulp.dest('build/assets/js'),
        rename({suffix: '.min'}),
        // uglify(),
        gulp.dest('build/assets/js'),
        notify({ message: 'Scripts task complete' })
    ], cb);
})

gulp.task('clean', function() {
    return del(['build/**',
                            '!build',
                            '!build/assets',
                            '!build/assets/sound/**',
                            '!build/assets/fonts']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'fonts', 'views', 'watch');
});

gulp.task('watch', function() {
  gulp.watch('source/sass/**/*.sass', ['styles']);
  gulp.watch('source/assets/js/**/*.js', ['scripts']);
  gulp.watch('source/views/**/*.{jade,pug}', ['views']);
  livereload.listen();
  gulp.watch(['build/**']).on('change', livereload.changed);
});
