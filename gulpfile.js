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
    server = require('gulp-server-livereload');

// gulp.task('templates', function() {
//     return gulp.src('source/views/**/*.jade')
//         .pipe( jade() )
//         .pipe(gulp.dest('build'))
// })

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

gulp.task('scripts', function() {
    return gulp.src(['source/assets/js/**/*.js', '!node_modules/**'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/assets/js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
        .pipe(gulp.dest('build/assets/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
})

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'views', 'watch');
});

gulp.task('server', function(){
    gulp.src('build')
        .pipe(server({
            livereload: true,
            directoryListing: {eanable: true, path: 'build'},
            open: true
        }));
});

gulp.task('watch', function() {
  gulp.watch('source/sass/**/*.sass', ['styles']);
  gulp.watch('source/assets/js/**/*.js', ['scripts']);
  gulp.watch('source/views/**/*.{jade,pug}', ['views']);
  livereload.listen();
  gulp.watch(['build/**']).on('change', livereload.changed);
});
