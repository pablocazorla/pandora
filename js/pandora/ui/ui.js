// PANDORA UI
(function() {

	'use strict';

	var context = '',
		loadedPrettify = false,
		initFunctions = {
			inputNumber: function(ctx) {
				$(ctx + 'input[type="number"]').not('.rendered').each(function() {
					var $this = $(this).addClass('rendered'),
						$cont = $('<div class="button-number-cont"></div>'),
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
			},
			pre: function(ctx) {
				var somePre = false;
				$(ctx + 'xpre').not('.no-print').each(function() {
					var $this = $(this).addClass('prettyprint');
					$this.text($this.html());
					somePre = true;
				});
				if (somePre) {
					if (!loadedPrettify) {
						$.getScript('//google-code-prettify.googlecode.com/svn/loader/run_prettify.js?skin=desert', function() {
							loadedPrettify = true;
							//prettyPrint();
						});
						/*'//google-code-prettify.googlecode.com/svn/loader/run_prettify.js?skin=desert'*/
					} else {
						prettyPrint();
					}
				}
			}
		},
		select = function(ctx) {
			context = PANDORA.getContext(ctx);
			for (var a in this.initFunctions) {
				if (typeof this.initFunctions[a] === 'function') {
					this.initFunctions[a].apply(null, [context]);
				}
			}
		};

	PANDORA.UI = {
		initFunctions: initFunctions,
		init: select,
		select: select
	};
})();