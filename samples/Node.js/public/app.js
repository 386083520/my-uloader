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
    r.on('filesAdded', function (files, fileList) {
        $('.uploader-progress, .uploader-list').show();
        fileList.forEach(function (file) {
            var $self = file.$el = $(
                '<li class="uploader-file">' +
                    'Uploading <span class="uploader-file-name"></span> ' +
                    '<span class="uploader-file-size"></span> ' +
                    '<span class="uploader-file-progress"></span> ' +
                    '<span class="uploader-file-pause">' +
                    ' <img src="pause.png" title="Pause upload">' +
                    '</span>' +
                    '<span class="uploader-file-resume">' +
                    ' <img src="resume.png" title="Resume upload">' +
                    '</span>' +
                    '<span class="uploader-file-cancel">' +
                    ' <img src="cancel.png" title="Cancel upload">' +
                    '</span>' +
                '</li>'
            )
            $self.find('.uploader-file-name').text(file.name);
            $self.find('.uploader-file-size').text(file.getFormatSize());
            $self.find('.uploader-file-pause').on('click', function () {
            });
            $self.find('.uploader-file-resume').on('click', function () {
            });
            $self.find('.uploader-file-cancel').on('click', function () {
            });
            $('.uploader-list').append($self);
        })
    })
    r.on('fileProgress', function (rootFile, file) {
        console.log('gsdfileProgress')
        rootFile.$el.find('.uploader-file-progress')
            .html()
        $('.progress-bar').css({width:Math.floor(r.progress()*100) + '%'});
    })
    window.r = {
        upload: function () {
            r.resume();
        }
    }
})()
