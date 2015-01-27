// Box
var PANDORA = {
	opened: false,
	open: function(callback) {
		//var callback = callback || function(){};
		if (typeof jQuery !== 'undefined' && !this.opened) {
			jQuery('document').ready(function($) {

				// Store
				PANDORA.$window = $(window);
				PANDORA.$html = $('html,body');

				// Open the box: do the magic
				PANDORA.opened = true;
				// Execute callback
				callback($);
			});
		}
		return this;
	},
	close: function() {
		PANDORA.opened = false;
		return this;
	},
	parseData: function(data) {
		var obj = {},
			arr, len, i, attr, prop, val;
		if (data !== '' && data !== undefined && data !== null) {
			arr = data.split(',');
			len = arr.length;
			for (i = 0; i < len; i++) {
				attr = arr[i].split(':');
				prop = $.trim(attr[0]);
				val = parseInt(attr[1]);
				obj[prop] = val;
			}
		}
		return obj;
	},
	cssfix: (function() {
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
	})()
};
PANDORA.init = PANDORA.open;