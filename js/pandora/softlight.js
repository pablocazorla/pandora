// PANDORA SOFTLIGHT
;
(function() {

	PANDORA.SOFTLIGHT = {
		delay: 200,
		defaults: {
			x: 0,
			y: 120,
			scale: 1,
			rotate: 0,
			from: 100,
			duration: 400,
			delay: 0
		}
	};

	var list = [],
		length = 0,
		classSelection = 'softlight',
		initialized = false,
		delay = 0,
		
		transformFix = PANDORA.cssfix('transform'),
		transitionFix = PANDORA.cssfix('transition'),
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
			var objElem = $.extend({
				x: PANDORA.SOFTLIGHT.defaults.x,
				y: PANDORA.SOFTLIGHT.defaults.y,
				scale: PANDORA.SOFTLIGHT.defaults.scale,
				rotate: PANDORA.SOFTLIGHT.defaults.rotate,
				from: PANDORA.SOFTLIGHT.defaults.from,
				duration: PANDORA.SOFTLIGHT.defaults.duration,
				delay: PANDORA.SOFTLIGHT.defaults.delay
			}, PANDORA.parseData(data));

			// Add elem
			objElem.elem = elem;

			var isVisible = test(objElem);
			if (!isVisible) {
				//correction of position
				objElem.from -= objElem.y;
				//
				var transformStyle = '';
				if (objElem.x !== 0) {
					transformStyle += 'translateX(' + objElem.x + 'px)';
				}
				if (objElem.y !== 0) {
					transformStyle += ' translateY(' + objElem.y + 'px)';
				}
				if (objElem.scale !== 1) {
					transformStyle += ' scale(' + objElem.scale + ')';
				}
				if (objElem.rotate !== 0) {
					transformStyle += ' rotate(' + objElem.rotate + 'deg)';
				}
				objElem.elem.style.opacity = '0';
				objElem.elem.style[transformFix] = transformStyle;
				objElem.elem.style[transitionFix] = 'opacity ' + objElem.duration + 'ms ease-out ' + objElem.delay + 'ms, ' + transformFix + ' ' + objElem.duration + 'ms ease-out ' + objElem.delay + 'ms';
				list.push(objElem);
				length++;
			}
			$(elem).removeClass(classSelection);
		},
		show = function(ob) {
			setTimeout(function() {
				ob.elem.style.opacity = '1';
				ob.elem.style[transformFix] = 'none';
				setTimeout(function() {
					ob.elem.style[transitionFix] = 'none';
				}, ob.duration + ob.delay + 50);
			}, delay);
		},
		onScroll = function() {
			if (length > 0) {
				var remainingList = [],
					i;
				delay = 0;
				for (i = 0; i < length; i++) {
					var objElem = list[i],
						isVisible = test(objElem);
					if (isVisible) {
						show(objElem);
						delay += PANDORA.SOFTLIGHT.delay;
					} else {
						remainingList.push(objElem);
					}
				}
				list = remainingList;
				length = list.length;
			}
		},
		select = function(context) {
			if (PANDORA.opened) {
				var ctx = (typeof context !== 'undefined') ? context + ' ' : '';

				$(ctx + '.' + classSelection).each(function() {
					var data = $(this).attr('data-softlight');
					setInitialPosition(this, data);
				});

				if (!initialized) {
					PANDORA.$window.scroll(onScroll).resize(onScroll);
					initialized = true;
				}
			}
		};

	PANDORA.SOFTLIGHT.select = select;
})();