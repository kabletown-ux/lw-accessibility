/**
 * @author Adina Halter
 * Accessible Overlay
 */
(function ($, NAMESP) {
	'use strict';
    /*
    Overlay namespacing
    */
    NAMESP.overlay = {};
    /*
        reveal overlay accessibly while blocking extra-overlay elems
        $O_defaultFocus can be used to override focusing on the first focusable element in the overlay
        O_animate can be used to call an animate function rather than having the overlay just appear
        ...assign O_animate the name   of the function from animation.js such as "bottomToTop"
    */
    NAMESP.overlay.showOverlay = function ($overlay, $O_defaultFocus, O_animate) {
        var $blockingScreen, // a reference to the dimmed background element
            $blockedContainers, // a reference to the containers that need to be blocked during overlay view.
            focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
        /*
            flag the element that triggered the overlay
        */
        NAMESP.access.tagTrigger();
        /*
            assumes blocking screen is a sibling to the overlay and just before it.
        */
        $blockingScreen = $overlay.prev();
        /*
            assumes blocked container(s) are the sibling elements that are before the blocking screen.
        */
        $blockedContainers = $blockingScreen.prevAll();
        /*
            get first focusable element in an overlay to focus on
        */
        if (!$O_defaultFocus) {
            $O_defaultFocus = $overlay.find(focusableSelector).not('[type="hidden"]').eq(1);
        }
        /*
            show overlay
        */
        if (!O_animate) {
            $overlay.addClass('reveal');
        } else {
            NAMESP.animate[O_animate]($overlay, 0.35, 'reveal');
        }
        /*
            set aria tags
        */
        NAMESP.access.ariaExpand($overlay);
        /*
            show blocking screen and block all elements behind it
        */
        NAMESP.dimScreen($blockingScreen, $blockedContainers, $O_defaultFocus);
        /*
            focus on clos btn within overlay
        */
        $O_defaultFocus.focus();
    };
    /*
    hide overlay
    */
    NAMESP.overlay.hideOverlay = function ($overlay, O_animate) {
        var $blockingScreen, // a reference to the dimmed background element
            $blockedContainers; // a reference to the containers that need to be blocked during overlay view.
        /*
            assumes blocking screen is a sibling to the overlay and just before it.
        */
        $blockingScreen = $overlay.prev();
        /*
            assumes blocked container(s) are the sibling elements that are before the blocking screen.
        */
        $blockedContainers = $blockingScreen.prevAll();
        /*
            hide blocking screen and unblock all elements behind it
        */
        NAMESP.unDimScreen($blockingScreen, $blockedContainers);
        /*
            hide overlay
        */
        if (!O_animate) {
            $overlay.removeClass('reveal');
        } else {
            NAMESP.animate[O_animate]($overlay, 0.35, 'reveal');
        }
        /*
            reset aria tags
        */
        NAMESP.access.ariaContract($overlay);
        /*
            focus on trigger that had opened the overlay
        */
        NAMESP.access.returnFocusToTrigger();

    };
}(jQuery, NAMESP));
