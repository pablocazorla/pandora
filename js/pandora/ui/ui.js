// PANDORA UI
(function() {



	var inputNumber = function(context) {
		$(context + 'input[type="number"]').not('.rendered').each(function() {
			var $this = $(this).addClass('rendered'),
				$cont = $('<div class="button-number-cont"></div>')
				$min = $('<a href="" class="button button-number">-</a>'),
				$max = $('<a href="" class="button button-number">+</a>'),
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
			$cont.append($max).append($min);
			$this.after($cont);

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

	var select = function(context) {
		var ctx = PANDORA.getContext(context);
		inputNumber(ctx);
	}

	PANDORA.UI = {
		select: select
	};
})();