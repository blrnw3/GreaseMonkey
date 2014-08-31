// Based on https://github.com/ubershmekel/gfycat_hoverzoom
// ==UserScript==
// @name gfycat hoverzoom
// @namespace blr
// @description Shows gfycat links on hover
// @include http://*.reddit.com/*
// @version 2
// @grant none
// ==/UserScript==
$(function() {
	var exit_to;
	var base_width = 800;
	var incr_width = 200;
	var width = base_width;
	
  var overlay = $('<div id="gfycat_zoom_overlay"></div>');
  overlay.css({
    width: '100%',
    height: '100%',
    position: 'fixed',
    left: 0,
    top: 0,
    'z-index': 100,
    'pointer-events': 'none',
    'background-color': '#001',
    opacity: 0.62,
    display: 'none'
  });
  $('body').append(overlay);
  
	var vidDiv = document.createElement('div');
	//vidDiv.textContent = 'Loading...';
	var jqVidDiv = $(vidDiv);
  jqVidDiv.dblclick(function(){jqVidDiv.hide();});
  $('body').keyup(function(e){
		var kc = e.keyCode;
		if(kc === 81 || kc === 27) jqVidDiv.toggle();
		if(kc === 65) width += incr_width; // a - Amplify
		if(kc === 83) width -= incr_width; // s - Shrink
		if(kc === 82) width = base_width; // r - Reset
		if(kc === 70) width = $(window).width(); //f - Full
		if(kc === 78) width = 0; //n - Native
		jqVidDiv.css('min-width', width);
	});
	var vidElem = undefined;
	var hoverFunc = function(href) {
		return function() {
			//console.log('hovering in ' + href);
			clearTimeout(exit_to);
			var curHref = vidDiv.getAttribute('vidlink');
			if (curHref != href) {
				vidDiv.setAttribute('vidlink', href);
				if (vidElem !== undefined) {
					vidElem.remove();
				}
				vidElem = createVideoElem(href);
				jqVidDiv.append(vidElem)
			}
			jqVidDiv.show();
      overlay.show();
		}
	};
	function createVideoElem(href) {
		/*
		 var normUrl = href.replace('www.', '').replace('gfycat.com/', '').replace('http://', '').replace('.gif', '');
		 var gfyimg = $('<img class="gfyitem" data-id="' + normUrl + '" />');
		 console.log('<img class="gfyitem" data-id="' + normUrl + '" />');
		 var f = new gfyObject(gfyimg.get(0));
		 f.init();
		 return gfyimg;
		 /*
		 var normUrl = href.replace('www.', '').replace('gfycat.com/', 'gfycat.com/iframe/');
		 console.log(normUrl);
		 return $('<iframe style="width:100%;" src="' + normUrl + '"></iframe>');
		 */
		var vidElem = document.createElement('video');
		vidElem.autoplay = true;
		vidElem.loop = true;
		vidElem.controls = false;
		vidElem.style.width = '100%';
		// I'm not sure there's a reason I have to use 3 video sources, why can't
		// I have a simpler API gfycat? Is it a CDN thing?
		['fat', 'zippy', 'giant'].forEach(function(sizeName) {
			source = document.createElement('source');
			var src = href.replace('www.', '').replace('gfycat', sizeName + '.gfycat') + '.webm';
			//console.log(src);
			source.src = src;
			vidElem.appendChild(source);
		});
		return vidElem;
	}
	/*var resizeDivToIframe = function(iframeId) {
	 $(jqiframe).load(function() {
	 setTimeout(iResize, 50);
	 // Safari and Opera need a kick-start.
	 //var iSource = document.getElementById('your-iframe-id').src;
	 //document.getElementById('your-iframe-id').src = '';
	 //document.getElementById('your-iframe-id').src = iSource;
	 });
	 function iResize() {
	 var iframeSize = document.getElementById('your-iframe-id').contentWindow.document.body.offsetHeight;
	 jqiframe.style.height = iframeSize + 'px';
	 }
	 }*/
	function main() {
		(function(d, t) {
			var g = d.createElement(t),
				s = d.getElementsByTagName(t)[0];
			g.src = 'http://assets.gfycat.com/js/gfyajax-0.517d.js';
			s.parentNode.insertBefore(g, s);
		}(document, 'script'));
		var gfyAnchors = [];
		var anchors = document.getElementsByTagName('a');
		for (var i = 0; i < anchors.length; i++) {
			if (anchors[i].hostname.indexOf('gfycat.com') != -1) {
				gfyAnchors.push(anchors[i])
			}
		}
		jqVidDiv.css({
			position: 'fixed',
			'z-index': '99999',
			right: '3px',
			top: '3px',
			'min-width': base_width,
			'border-top': '4px solid #000',
			display: 'none'
		});
		//gfyAnchors[0].parentNode.appendChild(vidDiv);
		$('body').append(jqVidDiv);
//		$('body').mousemove(function(ev) {
//			// +5 because otherwise the video obscures the element you're hovering over
//			// and a blinking video hovering in and out loop occurs.
//		   if(ev.pageY > 800) {
//		     jqVidDiv.css({
//		       left: ev.pageX + 5,
//		       bottom: ev.pageY - 10
//		     });
//		   } else {
//		     jqVidDiv.css({
//		       left: ev.pageX + 5,
//		       top: ev.pageY + 5
//		     });
//		   }
//		});
		for (var i = 0; i < gfyAnchors.length; i++) {
			var anchor = gfyAnchors[i];
			var jqanch = $(anchor);
			jqanch.mouseenter(hoverFunc(anchor.href));
			jqanch.mouseleave(function() {
				overlay.hide();
       //exit_to = setTimeout(function(){vidDiv.style.display = 'none';}, 10000);
			});
		}
	}
	main();
});