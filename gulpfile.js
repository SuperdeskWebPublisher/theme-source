'use strict';

var gulp = require('gulp')
var inject = require('gulp-inject')
var sass = require('gulp-sass')
var importCss = require('gulp-import-css')
var autoprefixer = require('gulp-autoprefixer')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')
var cssmin = require('gulp-cssmin')
var watch = require('gulp-watch')
var swPrecache = require('sw-precache')
var uglify = require('gulp-uglify')
var gutil = require('gulp-util')

// service worker generator
gulp.task('sw', function(callback) {
  var packageJson = require('./package.json');
  var bundleUrl = '/public/';

  swPrecache.write(
    'public/sw.js',
    {
      cacheId: packageJson.name,
      importScripts: ['/public/sw-contentCaching.js'],
      logger: gutil.log,
      //runtime caching.
      runtimeCaching: [{
        // matches googleapis cdn's. Fonts, jquery etc.
        urlPattern: /(googleapis|gstatic)/,
        handler: 'cacheFirst',
        options: {
          cache: {
            maxEntries: 200,
            name: 'googleapis-cache'
          }
        }
      },
      {
        // matches content api
        urlPattern: /(contentapi.json)/,
        handler: 'networkFirst',
        options: {
          cache: {
            maxEntries: 50,
            name: 'contentapi-cache'
          }
        }
      },
      {
        urlPattern: /(media)/,
        handler: 'cacheFirst',
        options: {
          cache: {
            maxEntries: 50,
            name: 'media-cache'
          }
        }
      },
      {
        // matches api user data and settings
        urlPattern: /(users\/profile|api\/.*\/settings)/,
        handler: 'networkFirst',
        options: {
          cache: {
            maxEntries: 5,
            name: 'api-cache'
          }
        }
      }
      ],
      dynamicUrlToDependencies: {
        '/': [
          'views/appdist/index.html.twig'
        ],
        '/app_dev.php': [
          'views/appdist/index.html.twig'
        ]
      },
      //assets precache
      staticFileGlobs: ['/', '/app_dev.php', 'public/appdist/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}', 'public/dist/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}','public/img/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}', 'public/fonts/**/*.{svg,eot,ttf,woff}'],
      stripPrefixMulti: {
        'public/': bundleUrl
      }

    },
    callback

    );
});


gulp.task('sass', function(){
 return gulp.src('public/dist/style.scss')
 .pipe(inject(gulp.src(['public/css/**/*.css', 'public/css/**/*.+(sass|scss)'], {read: false}), {
     starttag: '/*injector*/',
     endtag: ' /*endinjector*/',
     transform: function (filePath, file) {
       filePath = filePath.replace('/public/css/','../css/');
       return '\n@import \'' + filePath + '\';';
     }
   })
 )
  .pipe(sourcemaps.init())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest("public/dist/"));

});

gulp.task('article_sass', function(){
 return gulp.src('public/dist/article.scss')
 .pipe(inject(gulp.src(['public/article_css/**/*.css', 'public/article_css/**/*.+(sass|scss)'], {read: false}), {
     starttag: '/*injector*/',
     endtag: ' /*endinjector*/',
     transform: function (filePath, file) {
       filePath = filePath.replace('/public/article_css/','../article_css/');
       return '\n@import \'' + filePath + '\';';
     }
   })
 )
  .pipe(sourcemaps.init())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest("public/dist/"));

});



gulp.task('js',function(){
return gulp.src(['public/js/vendor/**/*.js','public/js/scripts/**/*.js',,'public/js/*.js'])
  .pipe(sourcemaps.init())
  .pipe(concat('all.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/dist'));

});

gulp.task('cssmin', ['sass'],function(){
   gulp.src('public/dist/style.css')
  .pipe(importCss())
  .pipe(autoprefixer({ browsers: ['last 2 version'], cascade: false }))
  .pipe(cssmin())
  .pipe(gulp.dest('public/dist'));

  gulp.src('public/dist/article.css')
  .pipe(importCss())
  .pipe(autoprefixer({ browsers: ['last 2 version'], cascade: false }))
  .pipe(cssmin())
  .pipe(gulp.dest('public/dist'));

});

gulp.task('jsmin', ['js'],function(){
  return gulp.src('public/dist/all.js')
  .pipe(uglify())
  .pipe(gulp.dest('public/dist'));

});



gulp.task('build', ['sass', 'article_sass', 'js', 'cssmin' , 'jsmin']);

gulp.task('watch', function() {
  //empty service worker
  require('fs').writeFileSync('public/sw.js', '');
  //
  gulp.watch('public/css/**/*.+(css|sass|scss)', ['sass']);
  gulp.watch('public/article_css/**/*.+(css|sass|scss)', ['article_sass']);
  gulp.watch('public/js/**/*.js', ['js']);


});