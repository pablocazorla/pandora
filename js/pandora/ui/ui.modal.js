// PANDORA UI MODAL
(function() {

	'use strict';

	var rendered = false,
		cfg = {
			timeToShow: 300,
			closeOnClickDimmer: false,
			contentLoading: '<div class="loading loading-modal">Loading...</div>'
		},

		showing = false,
		showed = false,

		content = undefined,

		showCallback = null,
		hideCallback = null,

		$dimmer = null,
		$modal = null,
		$toShow = null,
		$modalScroller = null,
		$modalContent = null,
		$modalCloser = null,
		$ctrls = null,

		setPosition = function() {
			var wh = PANDORA.$window.height(),
				padding = parseInt($modal.css('padding-top')) + parseInt($modal.css('padding-bottom')),
				mh = $modalContent.height() + padding,
				dif = parseInt(.5 * (wh - mh)),
				top = dif,
				height = 'auto',
				heightScroll = 'auto';

			if (dif < 10) {
				top = 10;
				height = (wh - 20) + 'px';
				heightScroll = (wh - 20 - padding) + 'px';
			}

			$modal.css({
				'top': top + 'px',
				'height': height
					//'max-height': height
			});
			$modalScroller.css({
				'scrollTop': 0,
				'height': heightScroll
			});
		},
		setControls = function(ct) {
			var ctrls = ct || null;
			if (ctrls !== null) {
				$modal.addClass('with-controls');
				$ctrls.append(ctrls);
			} else {
				$modal.removeClass('with-controls');
				$ctrls.html('');
			}
			return this;
		},
		show = function(cont) {
			if (!showing && !showed) {
				showing = true;

				var cnt = cont || content;
				if (cnt !== undefined) {
					$modalContent.html(cnt);
				}
				setPosition();

				$toShow.fadeIn(cfg.timeToShow, function() {
					showing = false;
					showed = true;
					if (typeof showCallback === 'function') {
						showCallback();
					}
				});
			}
			return this;
		},
		hide = function() {
			if (!showing && showed) {
				showing = true;
				$toShow.fadeOut(cfg.timeToShow, function() {
					showing = false;
					showed = false;
					if (typeof hideCallback === 'function') {
						hideCallback();
					}
				});
			}
			return this;
		},
		load = function(url, callback) {
			var cbk = callback || function() {};
			show(cfg.contentLoading);

			PANDORA.load({
				url: url,
				onSuccess: function(data) {
					$modalContent.html(data);
					setTimeout(function() {
						setPosition();
						setPositionForImage($modalContent.find('img'));
					}, 20);
					if (typeof cbk === 'function') {
						cbk();
					}
				},
				onError: function(){
					$modalContent.find('.loading').addClass('error').html('Sorry, there has been an error loading the content.<br>Please, try again.');
					setPosition();
				}
			});
			return this;
		},
		setPositionForImage = function($img) {
			$img.load(function() {
				setPosition();
			});
		},
		setContent = function(cont) {
			content = cont;
			return this;
		};

	PANDORA.UI.initFunctions.modal = function() {
		if (!rendered) {
			rendered = true;
			$dimmer = $('<div id="dimmer" class="dimmer" style="display:none"></div>').appendTo('body');
			$modal = $('<div id="modal" class="modal" style="display:none"></div>').appendTo('body');
			$modalScroller = $('<div id="modal-scroller" class="modal-scroller"></div>').appendTo($modal);
			$modalContent = $('<div id="modal-content" class="modal-content"></div>').appendTo($modalScroller);
			$modalCloser = $('<div id="modal-closer" class="button secondary smallest modal-closer">X</div>').appendTo($modal);
			$ctrls = $('<div id="modal-ctrls" class="modal-ctrls"></div>').appendTo($modal);

			$toShow = $modal.add($dimmer);

			setTimeout(function() {
				setPosition();
			}, 100);

			PANDORA.$window.resize(function() {
				setPosition();
			});
			$modalCloser.click(function() {
				hide();
			});
			$dimmer.click(function() {
				if (cfg.closeOnClickDimmer) {
					hide();
				}
			});
		}
	};
	PANDORA.UI.MODAL = {
		config: function(options) {
			cfg = $.extend(cfg, options);
			return this;
		},
		onShow: function(callback) {
			showCallback = callback;
			return this;
		},
		onHide: function(callback) {
			hideCallback = callback;
			return this;
		},
		setContent: setContent,
		setControls: setControls,
		show: show,
		hide: hide,
		load: load
	};

})();