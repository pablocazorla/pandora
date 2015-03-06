// PANDORA WOORATING
(function() {
	'use strict';

	var backgroundPosition = 16,
		setPosition = function($this, num) {
			$this.css('background-position', '0 -' + (backgroundPosition * num) + 'px');
		};

	PANDORA.WOORATING = {
		select: function(context) {
			var ctx = PANDORA.getContext(context);
			$(ctx + '.stars').each(function() {

				var $this = $(this),
					hoverNum = 0,
					$a = $this.find('a'),
					showActive = function() {
						var act = 0;
						$a.each(function(index) {
							if ($(this).hasClass('active')) {
								act = index + 1;
							}
						});
						setPosition($this, act);
					};

				$this.mouseover(function() {
					console.log(hoverNum);
					setPosition($this, hoverNum);
				}).mouseout(function() {
					showActive();
				});
				$a.mouseover(function() {
					hoverNum = parseInt($(this).text());
				});
			});
		}
	}
})();