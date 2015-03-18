// PANDORA UI TABS
(function() {

	'use strict';
	var ctx = '',
		cfg = {
			cssClassContainer: 'tabs-container',
			cssClassTabList: 'tabs',
			cssClassTabContent: 'tab-content',
			initial: 0
		},
		render = function() {
			$(ctx + '.' + cfg.cssClassContainer).not('.rendered').each(function() {
				var $this = $(this),
					$tabs = $this.find('.' + cfg.cssClassTabList + ' li'),
					$contents = $this.find('.' + cfg.cssClassTabContent),
					current = -1,
					show = function(num){
						if(num !== current){
							$tabs.removeClass('active').eq(num).addClass('active');
							$contents.hide().eq(num).show();
							current = num;
						}
					};

				$tabs.each(function(index){
					$(this).click(function(){
						show(index);
					});
				}).find('a').click(function(e) {
					e.preventDefault();
				});
				show(cfg.initial);
				$this.addClass('rendered');
			});
		};

	PANDORA.UI.initFunctions.tabs = function(context) {
		ctx = context;
		render();
	};
	PANDORA.UI.TABS = {
		config: function(options) {
			cfg = $.extend(cfg, options);
			render();
		}
	};
})();