(function () {
    var r = new Uploader({
        target: '/upload',
        singleFile: true
    })
    $('.uploader-drop').show();
    r.assignBrowse($('.uploader-browse')[0]);
})()
