/**
 * @author Adina Halter
 * Dim Screen
 */
(function($) {
	'use strict';
	/*
	dim screen and block interaction with content under the dim screen
	*/
	NAMESP.dimScreen = function ($blockedContainers, $defaultFocus) {
		var $blockingScreen = $('.blocking-screen');
		/*
		show screen dimmer
		*/
		$blockingScreen.show();
		/*
		make sure nothing is tabbable within blocked area
		*/
		NAMESP.access.blockFocus($blockedContainers, $defaultFocus);
	};
	/*
	hide screen dimmer and restore content to an unblocked state
	*/
	NAMESP.unDimScreen = function ($blockedContainers) {
		var $blockingScreen = $('.blocking-screen');
		/*
		hide screen dimmer
		*/
		$blockingScreen.hide();
		/*
		re-allow tabbability within previously de-tabbed elements
		*/
		NAMESP.access.removeFocusBlock($blockedContainers);
	};
}(jQuery));