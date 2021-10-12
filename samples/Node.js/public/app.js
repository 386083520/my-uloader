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
            .html(Math.floor(rootFile.progress() * 100) + '% '
                + Uploader.utils.formatSize(rootFile.averageSpeed) + '/s '
                + secondsToStr(rootFile.timeRemaining()) + ' remaining')
        $('.progress-bar').css({width:Math.floor(r.progress()*100) + '%'});
    })
    window.r = {
        upload: function () {
            r.resume();
        }
    }
})();


function secondsToStr (temp) {
    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    return seconds + ' second' + numberEnding(seconds);
}
