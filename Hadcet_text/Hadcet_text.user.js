// ==UserScript==
// @name        Hadcet_text
// @namespace   blr
// @description Loads Hadcet data into the DOM
// @include    *hadcet/cet_info_*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

function load_cet() {
    var type = window.location.pathname.split('_')[2].split('.')[0];
    $.get('cet_'+ type +'_est_2014',function(dat){
        $($('table')[4]).prepend('<pre>'+ dat +'</pre>');
    });
}
$(document).ready(load_cet);