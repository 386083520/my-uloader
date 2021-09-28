var gulp = require('gulp')

gulp.task('scripts', function() {
    console.log('gsdscripts')
})

gulp.task('build', ['scripts'], function (cb) {
    console.log('gsdbuild')
})
