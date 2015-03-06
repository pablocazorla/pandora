// PANDORA WOOQUICKVIEW
(function() {
	'use strict';
	var completeLoaded = null,
		MODAL = {
			timeToShow: 300,
			showing: false,
			showed: false,
			render: function() {
				if ($('#woo-quickview-modal').length <= 0) {
					this.$dimmer = $('<div id="woo-quickview-dimmer" class="dimmer"></div>').appendTo('body');
					this.$modal = $('<div id="woo-quickview-modal" class="modal"></div>').appendTo('body');
					this.$modalCloser = $('<div class="modal-closer">x</div>').appendTo(this.$modal);
					this.$modalContent = $('<div class="modal-content quickview-product"></div>').appendTo(this.$modal);

					this.$toShow = this.$dimmer.add(this.$modal);

					var self = this;
					self.setPosition();
					setTimeout(function() {
						self.setPosition();
					}, 100);

					PANDORA.$window.resize(function() {
						self.setPosition();
					});

					this.$modalCloser.add(this.$dimmer).click(function() {
						self.hide();
					});
				}
			},
			setPosition: function() {
				var wh = PANDORA.$window.height(),
					mh = this.$modal.outerHeight(),
					dif = parseInt(.5 * (wh - mh)),
					top = (dif < 10) ? 10 : dif,
					height = (dif < 10) ? (wh - 20) + 'px' : 'auto';
				this.$modal.css({
					'top': top + 'px',
					//'height': height,
					'max-height': (wh - 20) + 'px',
					'scrollTop': 0
				});
				return this;
			},
			load: function(url, callback) {
				var cbk = callback || function() {},
					self = this;

				this.$modalContent.html('<img src="' + baseTemplateURL + '/img/loading.gif" class="loading"/>');
				this.show();

				$.ajax({
					url: url + '?async=true',
					success: function(data) {
						self.$modalContent.html(data);
						self.forImage(self.$modalContent.find('img'));

						var $full = $('<a href="' + url + '" class="full-dsecription">Ver detalles del producto</a>');

						self.$modalContent.find('.summary').append($full);
						setTimeout(function() {
							self.setPosition();
						}, 20);
						if(typeof completeLoaded === 'function'){
							completeLoaded();
						}						
					}
				});

				return this;
			},
			forImage: function($img) {
				var self = this;
				$img.load(function() {
					console.log('cargo');
					self.setPosition();
				});
			},
			show: function(callback) {
				var cbk = callback || function() {},
					self = this;
				if (!this.showing && !this.showed) {
					this.showing = true;
					this.$toShow.fadeIn(this.timeToShow, function() {
						self.showing = false;
						self.showed = true;
						cbk();
					});
				}
				return this;
			},
			hide: function(callback) {
				var cbk = callback || function() {},
					self = this;
				if (!this.showing && this.showed) {
					this.showing = true;
					this.$toShow.fadeOut(this.timeToShow, function() {
						self.showing = false;
						self.showed = false;
						cbk();
					});
				}
				return this;
			}
		},
		classForLoaded = 'quick-loader',

		setQuick = function($li) {
			$li.addClass('quick-loader');

			// $a
			$li.find('a').eq(0).click(function(e) {
				e.preventDefault();
				var url = $(this).attr('href');
				MODAL.load(url);
			});
		};

	PANDORA.WOOQUICKVIEW = {
		select: function(context) {
			var ctx = PANDORA.getContext(context);
			MODAL.render();
			$(ctx + 'ul.products > li:not(.' + classForLoaded + ')').each(function() {
				setQuick($(this));
			});
			return this;
		},
		onComplete:function(callback){
			completeLoaded = callback;
			return this;
		}
	};
})();