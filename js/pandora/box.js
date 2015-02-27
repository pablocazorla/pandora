// Box
var PANDORA = (function() {
	'use strict';
	// Private
	var opened = false;

	// Utils
	/* BROWSER : Object
	 * Store browser type
	 */
	var BROWSER = {},
		uAgent = navigator.userAgent || navigator.vendor || window.opera,
		ua = uAgent.toLowerCase();
	BROWSER.mozilla = /mozilla/.test(ua) && !/webkit/.test(ua);
	BROWSER.webkit = /webkit/.test(ua);
	BROWSER.opera = /opera/.test(ua);
	BROWSER.msie = /msie/.test(ua) || /trident/.test(ua);
	BROWSER.ios = (ua.match(/ipad/i) || ua.match(/iphone/i) || ua.match(/ipod/i));
	BROWSER.android = ua.match(/android/i);

	var parseData = function(data) {
			var obj = $.parseJSON($.trim(data.replace(/\'/g, '"')));
			return obj;
		},
		cssfix = (function() {
			var style = document.createElement('dummy').style,
				prefixes = 'Webkit Moz O ms Khtml'.split(' ');
			return function(prop) {

				var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
					props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' '),
					result = null;
				for (var i in props) {
					if (style[props[i]] !== undefined) {
						result = props[i];
						break;
					}
				}
				return result;
			};
		})(),
		getContext = function(context) {
			var ctx = context || '',
				nexus = (ctx === '') ? '' : ' ';
			return ctx + nexus;
		},
		store = function(selection, name) {
			var n = name || selection;
			PANDORA[n] = $(selection);
			return PANDORA[n];
		},
		log = function(str) {
			try {
				console.log(str);
			} catch (e) {};
		};

	return {
		open: function(callback) {
			//var callback = callback || function(){};

			if (typeof jQuery !== 'undefined' && !opened) {
				jQuery('document').ready(function($) {

					// Store
					PANDORA.$window = $(window);
					PANDORA.$html = $('html,body');
					PANDORA.$scroll = (PANDORA.BROWSER.webkit) ? PANDORA.$window : PANDORA.$html;

					// Open the box: do the magic
					opened = true;

					// Execute callback
					callback($);
				});
			}
			return this;
		},
		close: function() {
			opened = false;
			return this;
		},
		isOpened: function() {
			return opened;
		},

		// Utils 
		BROWSER: BROWSER,
		parseData: parseData,
		cssfix: cssfix,
		getContext: getContext,
		store: store,
		log: log,
		empty: function() {}
	}
})();