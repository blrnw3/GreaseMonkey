// ==UserScript==
// @name        Spoiler prevention
// @namespace   wqfwg
// @description Spoiler prevention
// @grant none
// @include /.*bbc.*/
// @include /.*reddit.*/
// @include /.*guardian.*/
// @include /.*news.*/
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     1
// ==/UserScript==
jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
    return function( elem ) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
$(document).ready(function() {

    var spoiler = "<span style='background-color:#a00;color:white'>!!Spoiler!!</span>";
    var bad_words = ["game of thrones", "jon snow"];
   // var bad_words = ["syria"];
    var bad_elements = ["a", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6"];
   // var bad_elements = ["div"];
    var blr_count = 0;
    
    for(var i = 0; i < bad_elements.length; i++) {
        var elem = $(bad_elements[i]);
        for(var j = 0; j < bad_words.length; j++) {
    	  var matches = elem.find('*:Contains('+ bad_words[j] +')');
    	  if(matches.length > 0) {
        	  blr_count += matches.length
        	  matches.html(spoiler);
        	  matches.closest('div').closest('div').find('img')
        	   .attr('src', 'http://news.bbcimg.co.uk/media/images/70163000/jpg/_70163895_70163880.jpg');
    	   }
    	}
    }
    if(blr_count > 0) {
        $('body').prepend(
            "<div style='margin:5em;font-size:120%;background-color:#a11;color:white'>"+
                blr_count +
                " spoliers hidden!</div>"
        );
    }
	//$('img').fadeOut(5000);
	//console.log("Fail");
});