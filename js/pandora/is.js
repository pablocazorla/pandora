// PANDORA IS
(function() {

	'use strict';

	var is = {
			version: '0.1',
			not: {},
			any: {},
			all: {}
		},

		// cache some methods to call later on
		toString = Object.prototype.toString,
		arraySlice = Array.prototype.slice,
		hasOwnProperty = Object.prototype.hasOwnProperty,

		// helper function which reverses the sense of predicate result
		not = function(func) {
			return function() {
				return !func.apply(null, arraySlice.call(arguments));
			};
		},
		// helper function which call predicate function per parameter and return true if all pass
		all = function(func) {
			return function() {
				var parameters = arraySlice.call(arguments),
					length = parameters.length;
				if (length === 1 && is.array(parameters[0])) { // support array
					parameters = parameters[0];
					length = parameters.length;
				}
				for (var i = 0; i < length; i++) {
					if (!func.call(null, parameters[i])) {
						return false;
					}
				}
				return true;
			};
		},
		// helper function which call predicate function per parameter and return true if any pass
		any = function(func) {
			return function() {
				var parameters = arraySlice.call(arguments),
					length = parameters.length;
				if (length === 1 && is.array(parameters[0])) { // support array
					parameters = parameters[0];
					length = parameters.length;
				}
				for (var i = 0; i < length; i++) {
					if (func.call(null, parameters[i])) {
						return true;
					}
				}
				return false;
			};
		};

	// Type checks
	/* -------------------------------------------------------------------------- */
	// is a given value Array?
	is.array = Array.isArray || function(value) { // check native isArray first
		return toString.call(value) === '[object Array]';
	};

	// is a given value Boolean?
	is.boolean = function(value) {
		return value === true || value === false || toString.call(value) === '[object Boolean]';
	};

	// is a given value Date Object?
	is.date = function(value) {
		return toString.call(value) === '[object Date]';
	};

	// is a given value function?
	is.function = function(value) { // fallback check is for IE
		return toString.call(value) === '[object Function]' || typeof value === 'function';
	};

	// is a given value NaN?
	is.nan = function(value) { // NaN is number :) Also it is the only value which does not equal itself
		return value !== value;
	};

	// is a given value null?
	is.null = function(value) {
		return value === null || toString.call(value) === '[object Null]';
	};

	// is a given value number?
	is.number = function(value) {
		return is.not.nan(value) && toString.call(value) === '[object Number]';
	};

	// is a given value object?
	is.object = function(value) {
		var type = typeof value;
		return type === 'function' || type === 'object' && !!value;
	};

	// is given value a pure JSON object?
	is.json = function(value) {
		return toString.call(value) === '[object Object]';
	};

	// is a given value RegExp?
	is.regexp = function(value) {
		return toString.call(value) === '[object RegExp]';
	};

	// are given values same type?
	// prevent NaN, Number same type check
	is.sameType = function(value1, value2) {
		if (is.nan(value1) || is.nan(value2)) {
			return is.nan(value1) === is.nan(value2);
		}
		return toString.call(value1) === toString.call(value2);
	};
	// sameType method does not support 'all' and 'any' interfaces
	is.sameType.api = ['not'];

	// is a given value String?
	is.string = function(value) {
		return toString.call(value) === '[object String]';
	};

	// is a given value Char?
	is.char = function(value) {
		return is.string(value) && value.length === 1;
	};

	// is a given value undefined?
	is.undefined = function(value) {
		return value === void 0;
	};

	// Presence checks
    /* -------------------------------------------------------------------------- */

    // is a given value existy?
    is.existy = function(value) {
        return value !== null && value !== undefined;
    };

    // is a given value truthy?
    is.truthy = function(value) {
        return is.existy(value) && value !== false && is.not.nan(value) && value !== "" && value !== 0;
    };

    // is a given value falsy?
    is.falsy = not(is.truthy);









	


	PANDORA.IS = is;
})();