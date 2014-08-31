// ==UserScript==
// @name          Spoiler Hide
// @namespace     lol
// @description   Hide potential spoilers on a page
// @author        Ben Lee-Rodgers
// @include       http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version       0.0.1
// @copyright     B. Lee-Rodgers
// @license       MIT
// ==/UserScript==
$(document).ready(function() {
	$('img').fadeOut(5000);
});