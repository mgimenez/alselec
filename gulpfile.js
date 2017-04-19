/**
 * Dependencys
 */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    copy = require('gulp-contrib-copy'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint');
    stylish = require('jshint-stylish'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    htmlreplace = require('gulp-html-replace'),
    runSequence = require('run-sequence'),
    color = require('gulp-color'),
    imagemin = require('gulp-imagemin'),
    pug = require('gulp-pug'),
    pugConcat = require('gulp-pug-template-concat'),
		autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    path = {
      src: './src',
    	dist: './dist',
      scss: './src/scss',
      js: './src/js'
    };

/**
 * Tasks
 */

// Generates and merges CSS files from SASS
gulp.task('sass', function () {
    return gulp.src(path.scss + '/styles.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(concat('styles.css'))
		.pipe(autoprefixer({
        browsers: ['> 0.1%']
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(path.dist + '/css'))
    .pipe(connect.reload())
    .pipe(browserSync.stream());
});

// Copy HTML Files
gulp.task('copyHtml', function() {
  gulp.src(path.src + '/**/*.html')
    .pipe(copy())
    .pipe(gulp.dest(path.dist));
});

// Copy JS Files
gulp.task('copyJs', function() {
  gulp.src(path.js + '/**/*.js')
    .pipe(copy())
    .pipe(gulp.dest(path.dist + '/js'));
});

// Copy vendor Files
gulp.task('copyVendor', function() {
  gulp.src(path.src + '/vendor/**/*')
    .pipe(copy())
    .pipe(gulp.dest(path.dist + '/vendor'));
});

gulp.task('imagemin', function() {
    gulp.src(path.src + '/images/**/*')
        .pipe(imagemin({
          progressive: true,
          optimizationLevel: 5
        }))
        .pipe(gulp.dest(path.dist + '/images/'))
});

// Watches for SCSS, HTML, JS Files
gulp.task('watch', function () {
    gulp.watch(path.scss + '/**/*.scss', ['sass']);
    gulp.watch(path.src + '/**/*.html', ['copyHtml']);
    gulp.watch(path.src + '/**/*.js', ['js-watch']);
    gulp.watch(path.src + '/pug/**/*.pug', ['pug-watch']);
    gulp.watch(path.src + '/pug/templates/*.tpug', ['pug-watch']);
});


// JS HINT
gulp.task('hintJs', function() {
  return gulp.src(path.js + '/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Concat JS
gulp.task('concatJs', function (cb) {
  pump([
        gulp.src(path.js + '/**/*.js'),
        concat('app.js'),
        gulp.dest(path.dist + '/js')
    ],
    cb);
});

gulp.task('js-watch', ['hintJs', 'concatJs'], function (done) {
    browserSync.reload();
    done();
});


// Uglify JS
gulp.task('uglifyJs', function (cb) {
  pump([
        gulp.src(path.dist + '/js/*.js'),
        uglify({
          mangle: false
        }),
        gulp.dest(path.dist + '/js')
    ],
    cb);
});

// Process PUG files
gulp.task('pug', function () {
  return gulp.src([path.src + '/pug/pages/*.pug'])
  .pipe(pug({
    pretty: true
  }))
  .on('error', function (error) {
    console.log('An error occurred while compiling jade.\nLook in the console for details.\n' + error);
    this.emit('end');
  })
  .pipe(gulp.dest(path.dist));

});

gulp.task("pugTemplates", function(){
  gulp.src(path.src + '/pug/templates/*.tpug')
    .pipe(pug({
        client: true
    }))
    .pipe(pugConcat('templates.js', {templateVariable:"templates"}))
    .on('error', function (error) {
        console.log('An error occurred while compiling jade.\nLook in the console for details.\n' + error);
        this.emit('end');
    })
    .pipe(gulp.dest(path.dist + '/js'))
});

gulp.task('pug-watch', ['pug', 'pugTemplates'], function (done) {
    browserSync.reload();
    done();
});

// Merge Script tags
gulp.task('mergeScript', function () {
    gulp.src(path.src + '/**/*.html')
        .pipe(htmlreplace({
            'js': 'app.js'
        }))
        .pipe(gulp.dest(path.dist));
});

// Remove files
gulp.task('clean', function () {
  return gulp.src([path.dist + '/css', path.dist + '/js', path.dist + '/vendor', path.dist + '/*.html'], {read: false})
    .pipe(clean());
});

//Browser Sync & Server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"            
        },
        notify: false
    });
});

gulp.task('dist', function() {
  runSequence('clean', 'sass', 'hintJs', 'copyJs', 'copyVendor', 'pugTemplates', 'pug','imagemin', function() {
    console.log(color('SUCCESSFULLY DIST!', 'YELLOW'));
  });
});

gulp.task('dev', function(callback) {
  runSequence('clean', 'sass', 'hintJs', 'copyJs', 'copyVendor', 'pugTemplates', 'pug', 'imagemin', 'watch', 'browser-sync', function() {
    console.log(color('HAPPY DEV!', 'BLUE'));
  });
});

gulp.task('build', function(callback) {
  runSequence('clean', 'sass', 'hintJs', 'pugTemplates', 'pug', 'concatJs', 'uglifyJs', 'imagemin', 'mergeScript', function() {
    console.log(color('SUCCESSFULLY BUILD!', 'YELLOW'));
  });
});
