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

		setPosition = function() {
			var wh = PANDORA.$window.height(),
				mh = $modal.outerHeight(),
				dif = parseInt(.5 * (wh - mh)),
				top = (dif < 10) ? 10 : dif,
				height = (dif < 10) ? (wh - 20) + 'px' : 'auto';
			$modal.css({
				'top': top + 'px',
				//'height': height,
				'max-height': (wh - 20) + 'px'
			});
			$modalScroller.css({
				'scrollTop': 0
			});
		},
		show = function(cont) {
			if (!showing && !showed) {
				showing = true;

				var cnt = cont || content;
				if (cnt !== undefined) {
					$modalContent.html(cnt);
				}

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
			$.ajax({
				url: url + '?async=true',
				success: function(data) {
					$modalContent.html(data);
					setTimeout(function() {
						setPosition();
						setPositionForImage($modalContent.find('img'));
					}, 20);
					if (typeof cbk === 'function') {
						cbk();
					}
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
			$modalCloser = $('<div id="modal-closer" class="button smallest modal-closer">X</div>').appendTo($modal);

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
		show: show,
		hide: hide,
		load: load
	};

})();