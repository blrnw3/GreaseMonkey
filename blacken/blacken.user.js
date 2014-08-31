// ==UserScript==
// @name        blacken
// @namespace   blr
// @include     *
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==
function blacken() {
   $('body')
      .css('background-color', '#333')
      .css('color', '#fff')
   ;
     $('body').children()
      .css('background-color', '#333')
      .css('color', '#fff')
   ;
}
$(document).ready(blacken);