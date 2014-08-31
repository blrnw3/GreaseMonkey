// ==UserScript==
// @name        precharge
// @namespace   blr
// @description Fires a precharge on Meteociel, anf fixes the hour nav
// @include     *meteociel.fr/modeles/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

function fix_meteociel() {
   preCharger();
    var tds = $('#precharge').siblings('table').find('td');
    tds.last().children().appendTo(tds.first());
    tds.children('a').css('line-height', '9px');
  
    $('table[width=890]').attr('width', 955);
    $('td[height=81]').remove();
}
$(document).ready(fix_meteociel);