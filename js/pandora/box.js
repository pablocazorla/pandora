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
		},
		observable = function(val) {
			var currentValue = val,
				subscriptions = [],
				length = 0,
				lockedSubscr = true,
				locked = false,
				obs = function(val) {
					if (typeof val === 'undefined') {
						return currentValue;
					} else {
						if (currentValue !== val && !locked) {
							currentValue = val;
							if (!lockedSubscr) {
								for (var i = 0; i < length; i++) {
									subscriptions[i](currentValue);
								}
							}
						}
						return this;
					}
				};
			obs.subscribe = function(handler) {
				if (typeof handler === 'function') {
					subscriptions.push(handler);
					length++;
				}
				return this;
			};
			obs.lock = function(flag) {
				locked = flag || true;
				return this;
			};
			obs.lockSubscriptions = function(flag) {
				lockedSubscr = flag || true;
				return this;
			};
			return obs;
		},
		load = function(options) {
			var cfg = $.extend({
				url: null,
				parameters: 'async=true',
				onSuccess: function(data) {},
				onError: function(data){}
			}, options);

			if (typeof cfg.url === 'string') {
				var nexus = (cfg.url.indexOf('?') !== -1) ? '&' : '?';
				$.ajax({
					url: cfg.url + nexus + cfg.parameters,
					success: cfg.onSuccess,
					error: cfg.onError
				});
			}
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
		observable: observable,
		load: load,
		empty: function() {}
	}
})();