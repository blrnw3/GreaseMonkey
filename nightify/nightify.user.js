// ==UserScript==
// @name        nightify-light
// @namespace   lol-blr
// @include     *
// @description Turns bg black and fg grey if it's morning time
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// ==/UserScript==
$(document).ready(nightify);

var conf_opacity = {
	max: 0.5,
	auto: 0.4, // TODO - make this easily changeable
	start: 20, //mins either side of sunrise/set
	incr: 0.05, // increment when changing with keys (a & s)

};

function nightify() {
    $('body').css({
        'background-color': '#111 !important',
        'color': '#aaa !important',
        'background-image': 'none !important'
    });

    var overlay = $('<div id="darklay"></div>');
	var opacity = get_opacity(new Date());
    overlay.css({
        width: '100%',
        height: '100%',
        position: 'fixed',
        left: 0,
        top: 0,
        'z-index': 100,
        'pointer-events': 'none',
        'background-color': '#000',
        opacity: opacity
	});
	$('body').append(overlay);
	$('body').keyup(function(e){
		var kc = e.keyCode;
		if(kc === 81 || kc === 27) overlay.toggle();
		if(kc === 65) opacity += conf_opacity.incr; // a - Amplify
		if(kc === 83) opacity -= conf_opacity.incr; // s - Shrink
		if(kc === 82) opacity = get_opacity(new Date()); // r - Reset / update
		if(kc === 70) opacity = conf_opacity.max; // f - Full / max
		if(kc <= 57 && kc >= 48) opacity = (kc - 48) / 10 * conf_opacity.max; // numeric coeffs
		overlay.css('opacity', opacity);
	});
}

function get_opacity(dt) {
	var suntimes = sunCalc(dt, 51.556, -0.154);
	var dark_offset = (dt.getHours() < 12) ? dt - suntimes.sunrise : suntimes.sunset - dt;
	var dark_offset_mins = dark_offset /60000;

	if(dark_offset_mins < -conf_opacity.start) {
		return conf_opacity.auto;
	}
	if(dark_offset_mins < conf_opacity.start) {
		var sf = (dark_offset_mins + conf_opacity.start) / (conf_opacity.start * 2);
		return conf_opacity.auto * (1 - sf);
	}
	return 0;
}

///https://github.com/mourner/suncalc
function sunCalc(date, lat, lng) { 'use strict';
	// shortcuts for easier to read formulas
	var PI   = Math.PI,
		sin  = Math.sin,
		cos  = Math.cos,
		asin = Math.asin,
		acos = Math.acos,
		rad  = PI / 180;

	// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

	// date/time constants and conversions
	var dayMs = 1000 * 60 * 60 * 24,
		J1970 = 2440588,
		J2000 = 2451545;

	function toJulian(date) { return date.valueOf() / dayMs - 0.5 + J1970; }
	function fromJulian(j)  { return new Date((j + 0.5 - J1970) * dayMs); }
	function toDays(date)   { return toJulian(date) - J2000; }

	// general calculations for position
	var e = rad * 23.4397; // obliquity of the Earth

	function declination(l, b)    { return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l)); }

	// general sun calculations
	function solarMeanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }

	function eclipticLongitude(M) {
		var C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
			P = rad * 102.9372; // perihelion of the Earth

		return M + C + P + PI;
	}

	var SunCalc = {};

	// sun times configuration (angle, morning name, evening name)
	var times = SunCalc.times = [
		[-0.833, 'sunrise',       'sunset'      ],
		[  -0.3, 'sunriseEnd',    'sunsetStart' ],
		[    -6, 'dawn',          'dusk'        ],
		[   -12, 'nauticalDawn',  'nauticalDusk'],
		[   -18, 'nightEnd',      'night'       ],
		[     6, 'goldenHourEnd', 'goldenHour'  ]
	];

	// calculations for sun times
	var J0 = 0.0009;

	function julianCycle(d, lw) { return Math.round(d - J0 - lw / (2 * PI)); }

	function approxTransit(Ht, lw, n) { return J0 + (Ht + lw) / (2 * PI) + n; }
	function solarTransitJ(ds, M, L)  { return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L); }

	function hourAngle(h, phi, d) { return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d))); }

	// returns set time for the given sun altitude
	function getSetJ(h, lw, phi, dec, n, M, L) {

		var w = hourAngle(h, phi, dec),
			a = approxTransit(w, lw, n);
		return solarTransitJ(a, M, L);
	}

	// calculates sun times for a given date and latitude/longitude
	function getTimes() {
		var lw = rad * -lng,
			phi = rad * lat,

			d = toDays(date),
			n = julianCycle(d, lw),
			ds = approxTransit(0, lw, n),

			M = solarMeanAnomaly(ds),
			L = eclipticLongitude(M),
			dec = declination(L, 0),

			Jnoon = solarTransitJ(ds, M, L),

			i, len, time, Jset, Jrise;


		var result = {
			solarNoon: fromJulian(Jnoon),
			nadir: fromJulian(Jnoon - 0.5)
		};

		for (i = 0, len = times.length; i < len; i += 1) {
			time = times[i];

			Jset = getSetJ(time[0] * rad, lw, phi, dec, n, M, L);
			Jrise = Jnoon - (Jset - Jnoon);

			result[time[1]] = fromJulian(Jrise);
			result[time[2]] = fromJulian(Jset);
		}
		return result;
	};

	return getTimes();
}
