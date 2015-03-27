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
				$(ctx + 'pre').not('.no-print').each(function() {
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
			},
			dropdown: function(ctx) {
				$(ctx + 'select.dropdown').each(function() {
					var $select = $(this).removeClass('dropdown').hide(),
						$options = $select.find('option'),
						$drop = $('<span class="dropdown"></span>'),
						$a = $('<a href="" class="button"></a>').text($options.filter(':selected').text()).appendTo($drop),
						$ul = $('<ul></ul>').appendTo($drop),
						strLi = '';
					for (var i = 0; i < $options.length; i++) {
						strLi += '<li><a href="">'+ $options.eq(i).text() +'</a></li>';
					}
					$ul.html(strLi);
					$select.after($drop);
					if($select.hasClass('to-top')){
						$drop.addClass('to-top');
					}
					if($select.hasClass('to-right')){
						$drop.addClass('to-right');
					}
					$drop[0].dataSelect = $select;
				});

				$(ctx + '.dropdown').not('.rendered').each(function() {
					var $this = $(this),
						$btn = $this.addClass('rendered').find('> .button'),
						$ul = $this.find('> ul'),
						duration = 150,
						opened = false,
						changing = false;

					$btn.click(function(e) {
						e.preventDefault();
						if (!opened && !changing) {
							changing = true;
							$ul.fadeIn(duration, function() {
								opened = true;
								changing = false;
							});
						}
					});
					PANDORA.$window.click(function() {
						if (opened && !changing) {
							changing = true;
							$ul.fadeOut(duration, function() {
								opened = false;
								changing = false;
							});
						}
					});
					// For selects
					if(typeof this.dataSelect !== 'undefined'){
						var $options = this.dataSelect.find('option');							
						$ul.find('a').each(function(index){
							$(this).click(function(e){
								e.preventDefault();
								$btn.text($(this).text());
								$options.eq(index).prop('selected', true);
							});
						});
					}
				});
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