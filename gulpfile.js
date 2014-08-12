var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var run = require('gulp-run');
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var gutil = require('gulp-util');

// for mocha
require('coffee-script/register');

var paths = {
  scripts: ['src/**/*.coffee'],
  testCoffee: ['./test/phantom/index.coffee']
};

var browserifyOptions =  {
  transform: ['coffeeify'],
  extensions: ['.coffee']
};



gulp.task('default', ['lint','build-browser']);

gulp.task('build-browser', function() {
  // browserify
  return gulp.src(paths.scripts,  { read: false })
  .pipe(browserify(browserifyOptions))
      .pipe(rename('biojs_vis_msa.min.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('build-test', function() {
  // compiles all coffee tests to one file for mocha
  return gulp.src(paths.testCoffee,  { read: false })
    .pipe(browserify(browserifyOptions))
    .on('error', gutil.log)
    .on('error', gutil.beep)
    .pipe(concat('all_test.js'))
    .pipe(gulp.dest('test'));
});

gulp.task('test-phantom', ["build-test"], function () {
  return gulp
  .src('./test/index.html')
  .pipe(mochaPhantomJS());
});

gulp.task('test-mocha', function () {
    return gulp.src('./test/mocha/**/*.coffee', {read: false})
        .pipe(mocha({reporter: 'spec',
                    ui: "qunit",
                    compilers: "coffee:coffee-script/register"}));
});

gulp.task('test', ['test-mocha','test-phantom'],function () {
  return true;
});

var coffeelint = require('gulp-coffeelint');

gulp.task('lint', function () {
    gulp.src('./src/**/*.coffee')
        .pipe(coffeelint("coffeelint.json"))
        .pipe(coffeelint.reporter());
});


gulp.task('codo', function () {
  run('codo src -o build/doc').exec()  
    .pipe(gulp.dest('output'))    
});

gulp.task('sass', function () {
    gulp.src('./css/msa.scss')
      .pipe(sass())
      .pipe(concat('msa_compiled.css'))
      .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
   // watch coffee files
   gulp.watch(['./src/**/*.coffee', './test/**/*.coffee'], function() {
     gulp.run('test');
   });
});