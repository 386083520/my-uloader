(function () {
    var r = new Uploader({
        target: '/upload'
    })
    $('.uploader-drop').show();
    r.assignBrowse($('.uploader-browse')[0]);
    r.on('fileAdded', function (file, event) {
        console.log('gsdfileAdded', file, event)
        return false
    })
})()
