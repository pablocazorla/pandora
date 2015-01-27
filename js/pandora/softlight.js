// PANDORA SOFTLIGHT
;
(function() {

	var list = [],
		remainingList = [],
		length = 0,
		defaultAnimation = {
			x: 0,
			y: 100,
			from: 0,
			duration: 500
		},
		classSelection = 'softlightx',



		cssfix = (function() {
			var style = document.createElement('dummy').style,
				prefixes = 'Webkit Moz O ms Khtml'.split(' '),
				memory = {};
			return function(prop) {
				if (typeof memory[prop] === "undefined") {
					var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
						props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
					memory[prop] = null;
					for (var i in props) {
						if (style[props[i]] !== undefined) {
							memory[prop] = props[i];
							break;
						}
					}
				}
				return memory[prop];
			};

		})(),


		getPosition = function(elem) {
			var winHeight = PANDORA.$window.height(),
				elemRect = elem.getBoundingClientRect();
			return parseInt(winHeight - elemRect.top);
		},
		test = function(objElem) {
			var top = getPosition(objElem.elem),
				visible = false;
			if (top >= objElem.from) {
				visible = true;
			}
			return visible;
		},

		setInitialPosition = function(elem, data) {
			var objElem = $.extend(defaultAnimation, PANDORA.parseData(data));

			// Add elem
			objElem.elem = elem;

			//correction of position
			objElem.from -= objElem.y;

			var isVisible = test(objElem);
			if (isVisible) {
				$(elem).removeClass(classSelection);
			} else {
				////
				list.push(objElem);
			}
		},



		select = function(context) {
			var ctx = (typeof context !== 'undefined') ? context + ' ' : '';

			$(ctx + '.' + classSelection).each(function() {
				var data = $(this).attr('data-softlight');
				setInitialPosition(this, data);
			});



		};



	PANDORA.SOFTLIGHT = {
		select: select
	};
})();