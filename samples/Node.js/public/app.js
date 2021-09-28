(function () {
    var r = new Uploader({
        target: '/upload'
    })
    $('.uploader-drop').show();
    r.assignBrowse($('.uploader-browse')[0]);
})()
