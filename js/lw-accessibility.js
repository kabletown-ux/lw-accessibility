/**
 * @author Adina Halter
 * LW Accessibility Prototype functions
 */
$(document).ready(function () {
    var $overlay = $('#overlay'),
        $closeButton = $('.close-btn');
    $('[aria-controls="overlay"]').on('click', function (evt) {
        var idOfOverlayContent = $(this).attr('href').split("#").pop();
        //close current overlay if necesssary
        if ($overlay.hasClass('reveal')) {
            //hide the overlay
            NAMESP.overlay.hideOverlay($overlay, "reverseBottomToTop");
            //hide all nestd overlay content
            $overlay.find('.overlay-content').removeClass('reveal');
        }
        //show correct content in the DOM
        $overlay.find('#' + idOfOverlayContent).addClass('reveal');
        //show overlay
        NAMESP.overlay.showOverlay($overlay, $closeButton, "bottomToTop");
    });
    $closeButton.on('click', function (evt) {
        console.log('close');
        //hide the overlay
        NAMESP.overlay.hideOverlay($overlay, "reverseBottomToTop");
        //hide all nestd overlay content
        $overlay.find('.overlay-content').removeClass('reveal');
    });
    //begin with device chooser open
    $('#deviceList').addClass('reveal');
    NAMESP.overlay.showOverlay($overlay, $closeButton, "bottomToTop");
});