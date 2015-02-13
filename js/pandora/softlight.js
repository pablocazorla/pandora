// PANDORA SOFTLIGHT
(function() {
	'use strict';
	PANDORA.SOFTLIGHT = {		
		defaults: {
			x: 0,
			y: 120,
			z: 0,
			scale: 1,
			rotate: 0,
			rotateX: 0,
			rotateY: 0,
			rotateZ: 0,
			from: 50,
			duration: 400,
			delay: 0,
			delaySameRow: 200,
			classSelection: 'softlight'
		},
		config: function(obj) {
			this.defaults = $.extend(this.defaults, obj);
			return this;
		}
	};

	var list = [],
		length = 0,
		initialized = false,
		delay = 0,
		transformFix = PANDORA.cssfix('transform'),
		transitionFix = PANDORA.cssfix('transition'),
		perspectiveFix = PANDORA.cssfix('perspective'),
		test = function(objElem) {
			var winHeight = PANDORA.$window.height(),
				elemRect = objElem.elem.getBoundingClientRect();
			var top = parseInt(winHeight - elemRect.top),
				visible = (top >= objElem.from) ? true : false,
				ready = (top >= winHeight) ? true : false;
			return {
				ready: ready,
				visible: visible
			};
		},
		setInitialPosition = function(elem, data) {
			var objElem = $.extend({
				x: PANDORA.SOFTLIGHT.defaults.x,
				y: PANDORA.SOFTLIGHT.defaults.y,
				z: PANDORA.SOFTLIGHT.defaults.z,
				scale: PANDORA.SOFTLIGHT.defaults.scale,
				rotate: PANDORA.SOFTLIGHT.defaults.rotate,
				rotateX: PANDORA.SOFTLIGHT.defaults.rotateX,
				rotateY: PANDORA.SOFTLIGHT.defaults.rotateY,
				rotateZ: PANDORA.SOFTLIGHT.defaults.rotateZ,
				from: PANDORA.SOFTLIGHT.defaults.from,
				duration: PANDORA.SOFTLIGHT.defaults.duration,
				delay: PANDORA.SOFTLIGHT.defaults.delay
			}, PANDORA.parseData(data));

			// Add elem
			objElem.elem = elem;

			var isReady = test(objElem).ready;
			if (!isReady) {
				//correction of position
				objElem.from -= objElem.y;
				//
				var transformStyle = '',
					setPerspective = false;
				if (objElem.x !== 0) {
					transformStyle += 'translateX(' + objElem.x + 'px)';
				}
				if (objElem.y !== 0) {
					transformStyle += ' translateY(' + objElem.y + 'px)';
				}
				if (objElem.z !== 0) {
					transformStyle += ' translateZ(' + objElem.z + 'px)';
				}
				if (objElem.scale !== 1) {
					transformStyle += ' scale(' + objElem.scale + ')';
				}
				if (objElem.rotate !== 0) {
					transformStyle += ' rotate(' + objElem.rotate + 'deg)';
				} else {
					if (perspectiveFix !== null) {
						if (objElem.rotateX !== 0) {
							transformStyle += ' rotateX(' + objElem.rotateX + 'deg)';
							setPerspective = true;
						}
						if (objElem.rotateY !== 0) {
							transformStyle += ' rotateX(' + objElem.rotateY + 'deg)';
							setPerspective = true;
						}
						if (objElem.rotateZ !== 0) {
							transformStyle += ' rotateX(' + objElem.rotateZ + 'deg)';
						}
					}
				}
				if (setPerspective) {
					objElem.elem.parentNode.style[perspectiveFix] = '1000px';
				}

				objElem.elem.style.opacity = '0';
				objElem.elem.style[transformFix] = transformStyle;
				setTimeout(function(){
					objElem.elem.style[transitionFix] = 'opacity ' + objElem.duration + 'ms ease-out ' + objElem.delay + 'ms, ' + transformFix + ' ' + objElem.duration + 'ms ease-out ' + objElem.delay + 'ms';
				},5);
				list.push(objElem);
				length++;
			}
			$(elem).removeClass(PANDORA.SOFTLIGHT.defaults.classSelection);
		},
		show = function(ob) {

			setTimeout(function() {
				ob.elem.style.opacity = '';
				ob.elem.style[transformFix] = '';
				setTimeout(function() {
					ob.elem.style[transitionFix] = '';
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
						testElem = test(objElem),
						isVisible = testElem.visible,
						isReady = testElem.ready;
					if (isVisible) {
						show(objElem);

						if (isReady) {
							delay = 0;
						} else {
							delay += PANDORA.SOFTLIGHT.defaults.delaySameRow;
						}
					} else {
						remainingList.push(objElem);
					}
				}
				list = remainingList;
				length = list.length;
			}
		},
		select = function(context) {
			if (PANDORA.isOpened()) {
				var ctx = (typeof context !== 'undefined') ? context : '';

				$(ctx + '.' + PANDORA.SOFTLIGHT.defaults.classSelection).each(function() {
					var data = $(this).attr('data-softlight');
					setInitialPosition(this, data);
				});

				if (!initialized) {
					PANDORA.$window.scroll(onScroll).resize(onScroll);
					initialized = true;
				}
				setTimeout(function() {
					onScroll();
				}, 200);
			}
		},
		forceTest = function() {
			onScroll();
		};

	PANDORA.SOFTLIGHT.select = select;
	PANDORA.SOFTLIGHT.forceTest = forceTest;
})();