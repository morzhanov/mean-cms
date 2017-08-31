'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');

gulp.task('css', function () {
    return gulp.src('src/public/assets/sass/style.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('src/public/assets/css'));
});

gulp.task('watch', function () {

    gulp.watch('src/public/assets/css/style.sass', ['css']);

});


// the nodemon task
gulp.task('nodemon', function () {
    nodemon({
        script: 'src/server.js',
        ext: 'js sass css html'
    })
        .on('start', ['watch'])
        .on('change', ['watch'])
        .on('restart', function () {
            console.log('Restarted!');
        });
});

// defining the main gulp task
gulp.task('default', ['nodemon']);