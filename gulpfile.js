"use strict";

var gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    eslint = require('gulp-eslint'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'), // Notify of changes
    livereload = require('gulp-livereload'),
    del = require('del'), // Delete files for a clean build
    server = require('gulp-server-livereload'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    babelify = require('babelify');

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

gulp.task('scripts', function() {

    var b = browserify({
        entries: 'source/assets/js/app/simon.js',
        debug: true
    });

    return b.transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            // Add transformation tasks to the pipeline here.
            .pipe(minify())
            .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build/assets/js'));

});

gulp.task('lint', function() {
    return gulp.src('source/assets/js/app/simon.js')
        .pipe( eslint() )
        .pipe( eslint.format() );
});

gulp.task('clean', function() {
    return del(['build/**',
                            '!build',
                            '!build/assets',
                            '!build/assets/sound/**',
                            '!build/assets/fonts'])
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'lint', 'fonts', 'views', 'watch');
});

gulp.task('watch', function() {
  gulp.watch('source/sass/**/*.sass', ['styles']);
  gulp.watch('source/assets/js/**/*.js', ['scripts']);
  gulp.watch('source/views/**/*.{jade,pug}', ['views']);
  livereload.listen();
  gulp.watch(['build/**']).on('change', livereload.changed);
});
