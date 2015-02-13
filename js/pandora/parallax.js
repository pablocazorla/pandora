// PANDORA PARALLAX
(function() {
	
	PANDORA.PARALLAX = {
		defaults: {
			factor: 50
		}
	};
	

	var list = [],
		initialized = false,
		classSelection = 'parallax',
		transformFix = PANDORA.cssfix('transform'),

		setPosition = function(objElem) {
			var midWinHeight = PANDORA.$window.height() / 2,
				elemRectTop = objElem.elem.getBoundingClientRect().top - objElem.position,
				val = parseInt(objElem.factor * (midWinHeight - elemRectTop) / -100);

			if((val < 0 && objElem.toTop === 0) || (val > 0 && objElem.toBottom === 0)){
				val = 0;
			}

			objElem.position = val;
		},

		onScroll = function() {
			var l = list.length;
			for (var i = 0; i < l; i++) {
				var objElem = list[i];
				setPosition(objElem);
				objElem.elem.style[transformFix] = 'translateY(' + objElem.position + 'px)';
			}
		},
		select = function(context) {
			if (PANDORA.opened) {
				var ctx = (typeof context !== 'undefined') ? context + ' ' : '';


				list = [];

				$(ctx + '.' + classSelection).each(function() {
					var data = $(this).attr('data-parallax'),
						objElem = $.extend({
							factor: PANDORA.PARALLAX.defaults.factor,
							position: 0,
							toTop: 1,
							toBottom: 1,
						}, PANDORA.parseData(data));

					// Add elem
					objElem.elem = this;
					list.push(objElem);
				});



				onScroll();

				if (!initialized) {
					PANDORA.$window.scroll(onScroll).resize(onScroll);
					initialized = true;
				}
			}
		}

	PANDORA.PARALLAX.select = select;
})();