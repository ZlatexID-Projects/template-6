var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();;
var inject = require('gulp-inject');
var rename = require("gulp-rename");
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');
const imagemin = require('gulp-imagemin');

// check changes in files
gulp.task('watch', function(){
  browserSync.init({
    server: "./app"
});
  gulp.watch('app/scss/**/*.scss', gulp.series('sass')); 
  gulp.watch("app/*_.html", gulp.series('html'));
})

// sass to css
gulp.task('sass', function(){  
  return gulp.src('app/scss/*.scss')
    .pipe(sass()) 
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
});

//html inject scripts and styles and reload page
gulp.task('html', function(){
  return gulp.src('app/*_.html')
    .pipe(rename("index.html"))
    .pipe(inject(gulp.src(['./app/**/*.css'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./app'))
    .pipe(browserSync.stream())
});

//css min
gulp.task('cssmin', function () {
    return gulp.src('app/css/*.css')
        .pipe(concatCss('style.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/*')
      .pipe(gulp.dest('./build/fonts'));
});

gulp.task('htmlmin', function() {
  return gulp.src('app/index.html')
    .pipe(inject(gulp.src(['./build/css/style.css'], {read: false}), {relative: false,ignorePath:'build',addRootSlash:false}))
    .pipe(gulp.dest('build/'));
});

//image optimiztion
gulp.task('imgmin',function (){
  return gulp.src('app/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'))
})

gulp.task('default', gulp.series('sass','html','watch'));
gulp.task('deploy', gulp.series('sass','cssmin', 'fonts' ,'htmlmin', 'imgmin'));