/**
 * @author Adina Halter
 * Accessibility Helpers
 */
(function ($, NAMESP) {
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
	NAMESP.access.blockFocus = function ($blockedContainers, $focusOnThisInstead) {
//I think FF only problems
//I'm having trouble putting more than one element in blockedContainers
//so I'm not using it until I get to the bottom of it.
//if i only block 'navigation', or just 'content' in FF it announces the focused close button
//so this will work:
//$blockedContainers = $('.navigation');
//or
//$blockedContainers = $('.content');
//but this doesn't work:
//$blockedContainers = $('.navigation, .content');
//nor does it work if you next navigation into content
//weirdly it works if the element following the (?trigger?) is an absolutely positioned item.
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
	NAMESP.access.removeBlockFocus = function ($blockedContainers) {
		$blockedContainers.off('focusin.blockingFocus');
		$blockedContainers.removeAttr('aria-hidden');
	};
	/*
	aria tagging while expanding content
	*/
	NAMESP.access.ariaExpand = function ($expandingContainer) {
		$expandingContainer.attr({
			"aria-hidden" : "false",
			"aria-expanded" : "true"
		});
	};

	/*
	aria tagging while contracting content
	*/
	NAMESP.access.ariaContract = function ($expandingContainer) {
		$expandingContainer.attr({
			"aria-hidden" : "true",
			"aria-expanded" : "false"
		});
	};

    /*
        tag trigger
        $O_trigger can be used to override default trigger capture.
        O_dataAttr can be used to override default 'data-trigger' attribute.
    */
    NAMESP.access.tagTrigger = function ($O_trigger, O_dataAttr) {
        if (!$O_trigger) {
            $O_trigger = $(document.activeElement);
        }
        if (!O_dataAttr) {
            O_dataAttr = "data-trigger";
        }
        $O_trigger.attr(O_dataAttr, 'true');
    };

    /*
        focuses on flagged trigger and removes trigger tag
        O_dataAttr can be used to override default 'data-trigger' attribute.
    */
    NAMESP.access.returnFocusToTrigger = function (O_dataAttr) {
        var $trigger;
        if (!O_dataAttr) {
            O_dataAttr = "data-trigger";
        }
        $trigger = $('[' + O_dataAttr + '="true"]');
        if ($trigger.length === 1) {
            $trigger.focus().removeAttr(O_dataAttr);
            return;
        }
        /*
            focus on body if no trigger could be found
        */
        $('body').focus();
    };
}(jQuery, NAMESP));
