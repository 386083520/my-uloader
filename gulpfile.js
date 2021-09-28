var gulp = require('gulp')
var pump = require('pump')
var browserify = require('gulp-browserify')
var name = 'uploader'
var fname = name + '.js'
var paths = {
    src: 'src/',
    dist: 'dist/'
}

gulp.task('scripts', function() {
    return gulp.src(paths.src + fname)
        .pipe(browserify({
            debug: false,
            standalone: 'Uploader',
            transform: ['browserify-versionify']
        }))
        .pipe(gulp.dest(paths.dist))
})

gulp.task('build', ['scripts'], function (cb) {
    cb()
})
