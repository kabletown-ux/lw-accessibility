/**
 * @author Adina Halter
 * LW Accessibility Prototype functions
 */
$(document).ready(function () {
    var $overlay = $('#overlay'),
        $closeButton = $('.close-btn');
    $('[aria-controls="overlay"]').on('click', function (evt) {
        var idOfOverlayContent = $(this).attr('href').split("#").pop();
        console.log(idOfOverlayContent);
        //close current overlay if necesssary
        if ($overlay.hasClass('reveal')) {
            //hide the overlay
            NAMESP.overlay.hideOverlay($overlay);
            //hide all nestd overlay content
            $overlay.find('.overlay-content').removeClass('reveal');
        }
        //may need to put a delay here for animation purposes

        //show correct content in the DOM
            $overlay.find('#' + idOfOverlayContent).addClass('reveal');
        //show overlay
        NAMESP.overlay.showOverlay($overlay, $closeButton);
    });
    $closeButton.on('click', function (evt) {
        NAMESP.overlay.hideOverlay($overlay);
    });
});