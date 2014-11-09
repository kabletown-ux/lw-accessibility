(function ($, NAMESP) {
    /*
    Animation namespacing
    */
    NAMESP.animate = {};
    /*
        move element in from bottom to top
        assumes element is absolutely positioned
        O_classNameToShow will assign a classname to show element rather than display: block
    */
    NAMESP.animate.bottomToTop = function ($elemToAnimate, secondsToAnimate, O_classNameToShow) {
        var heightOfBrowserWindow = $(document).height(),
            milliseconds = secondsToAnimate * 1000;
        /* set margin-top of element to starting height */
        $elemToAnimate.css('margin-top', heightOfBrowserWindow + 'px');
        /* show element */
        if (O_classNameToShow) {
            $elemToAnimate.addClass(O_classNameToShow);
        } else {
            $elemToAnimate.show();
        }
        /* animate element */
        $elemToAnimate.animate({
            "margin-top": "0px"
        }, milliseconds );
    }
    NAMESP.animate.reverseBottomToTop = function ($elemToAnimate, secondsToAnimate, O_classNameToHide) {
        var heightOfBrowserWindow = $(document).height(),
            milliseconds = secondsToAnimate * 1000;
        /* animate element */
        $elemToAnimate.animate({
            "margin-top": heightOfBrowserWindow
        }, milliseconds );
        /* hide element */
        if (O_classNameToHide) {
            $elemToAnimate.addClass(O_classNameToHide);
        } else {
            $elemToAnimate.hide();
        }
    }
}(jQuery, NAMESP));