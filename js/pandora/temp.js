// PANDORA LOADER
;
(function() {
	'use strict';
	var duration = 400, // o show or hide blank
		blanked = true,
		initialized = false,
		hostUrl = window.location.host,
		currentUrl = window.location.href,
		pushSt = (typeof history !== 'undefined' && typeof history.pushState !== 'undefined'),
		blackDimmer = false,
		isIE = PANDORA.BROWSER.msie,

		// Stores
		$blank, $loader, $mainContent,

		showBlank = function() {
			$loader.removeClass('hidden').addClass('to70');
			if (blackDimmer) {
				$blank.addClass('black');
			} else {
				$blank.removeClass('black');
			}
			$blank.fadeIn(duration, function() {
				blanked = true;
			});
		},
		hideBlank = function() {
			$loader.removeClass('to70').addClass('to100').addClass('hidden');
			$blank.fadeOut(duration, function() {
				$loader.removeClass('to100');
				blanked = false;
			});
		},
		onSuccess = null,
		onBefore = null,
		load = function(url) {
			var timer = null,
				changed = false,
				hash = null,
				s = (url.indexOf('?') === -1) ? '?' : '&',
				defaultChange = function() {
					window.location.href = url;
				},
				change = function(data) {
					PANDORA.$scroll.scrollTop(0);
					$mainContent.html(data);
					var title = $('#hidden-title').text();
					if (title === '') {
						title = document.title;
					} else {
						document.title = title;
					}
					history.pushState(null, title, url);
					if (hash !== null) {
						url += '#' + hash;
					}
					currentUrl = url;
					hideBlank();

					// On Complete
					if (typeof onSuccess === 'function') {
						onSuccess();
					}
				};
			if (url !== currentUrl) {
				if (url.indexOf('#') !== -1) {
					var arr = url.split('#');
					url = arr[0];
					hash = arr[1];
				}
				// On Before
				if (typeof onBefore === 'function') {
					onBefore();
				}
				showBlank();
				if (pushSt && url.indexOf(hostUrl) !== -1 && !isIE) {
					changed = false;
					$.ajax({
						url: url + s + 'async=1',
						success: function(data) {
							timer = setInterval(function() {
								if (blanked && !changed) {
									clearInterval(timer);
									timer = null;
									changed = true;
									change(data);
								}
							}, 50);
						},
						error: defaultChange
					});
				} else {
					defaultChange();
				}
			}
			return this;
		};

	PANDORA.LOADER = {
		init: function() {
			if (!initialized) {
				$blank = $('#blank-dimmer');
				$loader = $('#loader-line').addClass('to70');
				$mainContent = $('#content-main');
				setTimeout(function() {
					hideBlank();
				}, 400);
				initialized = true;
			}
			return this;
		},
		setLinks: function(context) {
			var ctx = context || '';
			if (pushSt) {
				$(ctx + 'a:not(.no-async)').click(function(e) {
					var $this = $(this),
						url = $this.attr('href');
					if (url.indexOf(hostUrl) !== -1) {
						e.preventDefault();
						blackDimmer = ($this.attr('data-blank') === 'black') ? true : false;
						load(url);
					}
				});
			}
			return this;
		},
		load: load,
		before: function(callback) {
			onBefore = callback;
			return this;
		},
		success: function(callback) {
			onSuccess = callback;
			return this;
		}
	};
})();