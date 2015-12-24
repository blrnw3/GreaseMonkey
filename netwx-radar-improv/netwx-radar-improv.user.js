// ==UserScript==
// @name        netwx-radar-improv
// @namespace   blr
// @include     *netweather.tv/secure/cgi-bin/premium.pl*
// @description Adds some func to netwx radar
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// ==/UserScript==
$(document).ready(netwx_improv);

var steps = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180];
var step_index = 2;

var accums = [0, 1, 3, 6, 12, 24];
var accum_state = 0;

var curr_time = '';

function netwx_improv() {
	$('body').keypress(function(e){
		var kc = e.keyCode;
    if(e.key === 'z') togglepcz(); // z postcode zoom toggle
    if(e.key === 'a') accum_toggle(); // a
    if(e.key === 'l') latest(); // l
		if(kc === 37 || kc === 39) move(kc === 37); // left/right
    if(kc === 38 || kc === 40) adj_step(kc === 38); // up/down
    if(kc >= 37 && kc <= 40) e.preventDefault();
	});
}

function adj_step(is_up) {
  step_index += (is_up) ? 1 : -1;
  if(step_index === steps.length) step_index = 0;
  if(step_index === -1) step_index = steps.length - 1;
  set_ui();
}

function move(is_left) {
  if(s && s.getValue() >= 287 && !is_left) return;
  var step_size = steps[step_index] / 5;
  for(var step = 0; step < step_size; step++) {
    if(is_left) decimno();
    else incimno();
  }
  if(s && s.getValue() > 287) {
    s.setValue(287);
  }
  cimage('radar', 0, -1);
  curr_time = $('#dtime').val();
  set_ui();
}

function latest() {
  if(s) {
    s.setValue(287);
    cimage('radar',0,-1);
  } else {
    console.log(s);
  }
}

function accum_toggle() {
  accum_state++;
  if(accum_state === accums.length) accum_state = 0;
  var accum_val = accums[accum_state];
  setaccum(accum_val);
  $('#accumselect').text('Accum: '+ accum_val + 'hr');
}

function set_ui() {
  $('#dtime').val(curr_time +' - '+ (steps[step_index]) + 'm');
}