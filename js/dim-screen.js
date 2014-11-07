/**
 * @author Adina Halter
 * Dim Screen
 */
(function ($, NAMESP) {
	'use strict';
	/*
	dim screen and block interaction with content under the dim screen
	*/
	NAMESP.dimScreen = function ($blockingScreen, $blockedContainers, $defaultFocus) {
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
	NAMESP.unDimScreen = function ($blockingScreen, $blockedContainers) {
		/*
		hide screen dimmer
		*/
		$blockingScreen.hide();
		/*
		re-allow tabbability within previously de-tabbed elements
		*/
		NAMESP.access.removeBlockFocus($blockedContainers);
	};
}(jQuery, NAMESP));