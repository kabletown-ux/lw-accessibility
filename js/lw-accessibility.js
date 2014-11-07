/**
 * @author Adina Halter
 * LW Accessibility Prototype functions
 */
$(document).ready(function () {
    var $overlay = $('#overlay'),
        $closeButton = $('.close-btn');
    $('[aria-controls="overlay"]').on('click', function (evt) {
        NAMESP.overlay.showOverlay($overlay, $closeButton);
    });
    $closeButton.on('click', function (evt) {
        NAMESP.overlay.hideOverlay($overlay);
    });
});