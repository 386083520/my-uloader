(function () {
    var r = new Uploader({
        target: '/upload/uploadFile',
        singleFile: true
    })
    $('.uploader-drop').show();
    r.assignBrowse($('.uploader-browse')[0]);
    r.on('filesSubmitted', function (files, fileList) {
        window.r.upload();
    });
    window.r = {
        upload: function () {
            r.resume();
        }
    }
})()
