/**
 * @author Adina Halter
 * Accessibility Helpers
 */
(function($) {
	'use strict';
	NAMESP.keyboard = {
		tab:    9,
		enter:  13,
		esc:    27,
		space:  32,
		left:   37,
		up:     38,
		right:  39,
		down:   40
	};
	/*
	Accessibility namespacing
	*/
	NAMESP.access = {};
	/*
	will not let you focus on anything within a blocked area
	when an element is given focus within a blocked area the focus will move to a target element
	*/
	NAMESP.access.blockFocus = function($blockedContainers, $focusOnThisInstead) {
		$blockedContainers.attr('aria-hidden', 'true');
		$blockedContainers.on('focusin.blockingFocus', function () {
			if ($blockedContainers.attr('aria-hidden') === 'true') {
				$focusOnThisInstead.focus();
				return false;
			}
		});
	};
	/*
	removes focus blocking set with NAMESP.blockFocus method
	*/
	NAMESP.access.removeBlockFocus = function($blockedContainers) {
		$blockedContainers.off('focusin.blockingFocus');
		$blockedContainers.removeAttr('aria-hidden');
	};
	/*
	aria tagging while expanding content
	*/
	NAMESP.access.ariaExpand = function($expandingContainer) {
		$expandingContainer.attr({
			"aria-hidden" : "false",
			"aria-expanded" : "true"
		});
	};

	/*
	aria tagging while contracting content
	*/
	NAMESP.access.ariaContract = function($expandingContainer) {
		$expandingContainer.attr({
			"aria-hidden" : "true",
			"aria-expanded" : "false"
		});
	};

    /*
    tag trigger ($OPTIONALtrigger can be used to override default trigger capture)
    */
    NAMESP.access.tagTrigger = function($OPTIONALtrigger) {
        var $trigger;
        if ($OPTIONALtrigger) {
            $trigger = $OPTIONALtrigger;
        } else {
            $trigger = $(document.activeElement);
        }
        $trigger.attr('data-trigger', 'true');
    };

    /*
    focuses on trigger and removes trigger tag
    */
    NAMESP.access.focusTrigger = function() {
        var $trigger = $('[data-trigger="true"]');
        $trigger.focus().removeAttr('data-trigger');
    };
}(jQuery));
