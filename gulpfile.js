'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');


// Directory Path

// Folder Paths
var src = {
  base: './src/theme/',
  assets: './src/assets/'
};
var dist = {
  base: './wordpress/wp-content/themes/middleware/',
  assets: './wordpress/wp-content/themes/middleware/assets/'
};


// Browser Sync
gulp.task('browser-sync', function() {
  browserSync({
    notify: false,
    proxy : 'localhost:8888',
    host  : 'localhost',
    open  : 'local',
    ui    : false
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});


// Clean
gulp.task('clean', function(){
  return gulp.src(
    [dist.base], {read: false})
    .pipe(clean())
});


// Cache Clear
gulp.task('clear', function (done) {
  return cache.clearAll(done);
});


// Images
gulp.task('images', function(){
  return gulp.src(src.assets + 'images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dist.assets + 'images/'))
});


// Sass
gulp.task('styles', function(){
  return gulp.src(src.assets + 'sass/**/*.scss')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(dist.assets + 'css/'))
    .pipe(browserSync.reload({stream:true}))
});


// Javascript
gulp.task('scripts', function(){
  return gulp.src(src.assets + 'js/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('app.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dist.assets + 'js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('script-libraries', function(){
  return gulp.src(src.assets + 'library/**/*.js')
    .pipe(gulp.dest(dist.assets + 'js/library/'))
});


// Fonts
gulp.task('fonts', function(){
  return gulp.src(src.assets + 'fonts/**/*')
    .pipe(gulp.dest(dist.assets + 'fonts/'))
});


// Theme
gulp.task('theme-files', function(){
  return gulp.src(src.base + '**/*.php')
    .pipe(gulp.dest(dist.base))
    .pipe(browserSync.reload({stream:true}))
});


// Default
gulp.task('default', ['browser-sync'], function(){
  gulp.watch(src.assets + 'sass/**/*.scss', ['styles']);
  gulp.watch(src.assets + 'js/**/*.js', ['scripts']);
  gulp.watch(src.assets + 'images/**/*', ['images']);
  gulp.watch(src.base + '**/*.php', ['theme-files']);
});


// Build
gulp.task('build', function(cb) {
  runSequence(
    'clean',
    ['fonts', 'styles', 'scripts', 'images', 'script-libraries'],
    cb
  );
});


// Import Theme
gulp.task('import-theme', function(){
  return gulp.src(src.base + '**/*')
    .pipe(gulp.dest(dist.base))
});

// Export Theme (Don't Use)
gulp.task('export-theme', function(){
  return gulp.src(path + '**/*')
    .pipe(gulp.dest('theme/'))
});
