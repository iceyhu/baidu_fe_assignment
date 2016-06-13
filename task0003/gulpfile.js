var gulp = require('gulp'),  
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload');

gulp.task('styles', function() {  
    return sass('css/style-updated.scss')
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dest/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dest/styles'))
        .pipe(notify({ message: 'STYLES COMPLETE.' }));
});

gulp.task('scripts', function() {  
    return gulp.src('js/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dest/scripts'))
        .pipe(notify({ message: 'SCRIPTS COMPLETE.' }));
});

gulp.task('images', function() {  
    return gulp.src('img/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dest/images'))
        .pipe(notify({ message: 'IMAGES COMPLETE.' }));
});

gulp.task('clean', function() {  
    return gulp.src(['dest/styles', 'dest/scripts', 'dest/images'], {read: false})
        .pipe(clean());
});

gulp.task('default', ['clean'], function() {  
    gulp.start('styles', 'scripts', 'images');
});

gulp.task('watch', function() {
    gulp.watch('css/*.scss', ['styles']);
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('img/*', ['images']);
//    // 建立即时重整伺服器
//    var server = livereload();
//    // 看守所有位在 dest/ 目录下的档案，一旦有更动，便进行重整
//    gulp.watch(['dest/**']).on('change', function(file) {
//    server.changed(file.path);
//    });
});