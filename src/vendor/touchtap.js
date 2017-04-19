(function(win, doc, $){
    'use strict';

    var touchStartPos,
        distance;

    $(doc).on("touchstart", function (e) {
        touchStartPos = $(win).scrollTop();
    }).on("touchend", function (e) {
        distance = touchStartPos - $(win).scrollTop();
        if (distance < 20 && distance > -20) {
            $(e.target).trigger('touchtap');
        }
    });

})(window, window.document, window.jQuery)
