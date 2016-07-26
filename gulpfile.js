var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');

var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');
var del = require('del');
var surge = require('gulp-surge');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback')


/*
  Styles Task
*/

gulp.task('styles',function() {
  // copy over fonts
  gulp.src('css/fonts/**.*')
    .pipe(gulp.dest('build/css/fonts'))

  // Compiles CSS
  gulp.src('css/style.styl')
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./build/css/'))
    .pipe(reload({stream:true}))
});

/*
  Images
*/
gulp.task('images',function(){
  gulp.src('css/images/**')
    .pipe(gulp.dest('./build/css/images'))
});

/*
  Browser Sync
*/
gulp.task('browser-sync', function() {
    browserSync({
        // we need to disable clicks and forms for when we test multiple rooms
        server : {},
        middleware : [ historyApiFallback() ],
        ghostMode: false
    });
});

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: ['./scripts/' + file],
    debug : true,
    cache: {},
    packageCache: {},
    transform:  [babelify.configure({stage : 0 })] // Enable all ES7 experimental functionality
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./build/'))
      // If you also want to uglify it
      // .pipe(buffer())
      // .pipe(uglify())
      .pipe(rename('main.min.js'))
      .pipe(gulp.dest('./build'))
      .pipe(reload({stream:true}))
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

function buildDeployment(file) {
  var props = {
    entries: ['./scripts/' + file],
    debug : false,
    cache: {},
    packageCache: {},
    transform:  [babelify.configure({stage : 0 })] // Enable all ES7 experimental functionality
  };

  // gulp.src('./index.html').pipe(gulp.dest('./build')); // Copy HTML

  /* Compile JS */
  var bundler =  browserify(props);
  var stream = bundler.bundle();
  return stream
    .on('error', handleErrors)
    .pipe(source(file))
    .pipe(gulp.dest('./build/'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./build'))
    .pipe(reload({stream:true}));
}

gulp.task('scripts', function() {
  return buildScript('main.js', false); // this will run once because we set watch to false
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['images','styles','scripts','browser-sync'], function() {
  gulp.watch('css/**/*', ['styles']); // gulp watch for stylus changes
  gulp.watch('scripts/**/*.js', ['scripts']); //Watch components changes
  return buildScript('main.js', true); // browserify watch for JS changes
});

// Clean build directory
gulp.task('clean', function(){
  del([
    'build/css/images/**.*',
    'build/css/fonts/**.*',
    'build/css/**.*',
    'build/**.*'
  ]);
  return true;
});

// Build project for deployment
gulp.task('build', ['clean','images','styles'], function() {
  return buildDeployment('main.js'); // browserify watch for JS changes
});

/* Build and Deploy */
gulp.task('surge', ['build'], function () {
  return surge({
    project: './',         // Path to your static build directory
    domain: 'macrocal.surge.sh'  // Your domain or Surge subdomain
  })
});
