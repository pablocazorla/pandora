// PANDORA INPUTS
(function() {
	'use strict';



	PANDORA.INPUTS = {
		select: function(context) {
			var ctx = PANDORA.getContext(context);
			$(ctx + 'input[type=number]').each(function() {
				var $this = $(this).addClass('input-num'),
					$min = $('<a href="" class="circ-button to-left">-</a>'),
					$max = $('<a href="" class="circ-button to-right">+</a>'),
					min = parseInt($this.attr('min')),
					max = parseInt($this.attr('max')),
					orig = 1,
					changeNumValue = function(dif) {
						var v = parseInt($this.val()) + dif;
						if (isNaN(v)) {
							v = orig;
						} else {
							v = (v < min) ? min : v;
							v = (v > max) ? max : v;
							orig = v;
						}

						$this.val(v);
					};

				$this.before($min).after($max);

				$min.click(function(e) {
					e.preventDefault();
					changeNumValue(-1);
				});
				$max.click(function(e) {
					e.preventDefault();
					changeNumValue(1);
				});
			});
		}
	}
})();