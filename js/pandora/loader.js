// PANDORA LOADER
(function() {
	'use strict';
	PANDORA.LOADER = {
		defaults: {
			before: null,
			beforeTime: 10,
			after: null,
			afterTime: 10,
			getTitle: null,
			exceptionClass: 'no-async',
			classSelection: null,
			parameterUrl: 'async=1',
			container: '#main-container'
		},
		config: function(options) {
			this.defaults = $.extend(this.defaults, options);
			return this;
		}
	};

	var hostUrl = window.location.host,
		currentUrl = window.location.href,
		initialUrl = window.location.href,
		isAsyncUrl = function(url) {
			return (url.indexOf(hostUrl) !== -1)
		},
		enablePush = false;

	PANDORA.LOADER.load = function(url, back) {
		var isBack = back || false,
			timer = null,
			changed = false,
			hash = null,
			nexus = (url.indexOf('?') === -1) ? '?' : '&',
			loadSync = function() {
				window.location.href = url;
			},
			change = function(data) {
				//PANDORA.$scroll.scrollTop(0);
				$(PANDORA.LOADER.defaults.container).html(data);
				var title = document.title;
				if (typeof PANDORA.LOADER.defaults.getTitle === 'function') {
					title = PANDORA.LOADER.defaults.getTitle();
					document.title = title;
				}
				if (hash !== null) {
					url += '#' + hash;
				}
				if (!isBack) {
					history.pushState({
						path: url
					}, title, url);
				}
				currentUrl = url;

				// After
				if (typeof PANDORA.LOADER.defaults.after === 'function') {
					setTimeout(function() {
						PANDORA.LOADER.defaults.after();
					}, PANDORA.LOADER.defaults.afterTime);
				}
			};
		if (url !== currentUrl) {
			// Before
			if (typeof PANDORA.LOADER.defaults.before === 'function') {
				PANDORA.LOADER.defaults.before();
			}

			if (enablePush && isAsyncUrl(url)) {
				if (url.indexOf('#') !== -1) {
					var arr = url.split('#');
					url = arr[0];
					hash = arr[1];
				}
				$.ajax({
					url: url + nexus + PANDORA.LOADER.defaults.parameterUrl,
					success: function(data) {
						timer = setTimeout(function() {
							if (!changed) {
								clearTimeout(timer);
								timer = null;
								changed = true;
								change(data);
							}
						}, PANDORA.LOADER.defaults.beforeTime);
					},
					error: loadSync
				});

			} else {
				loadSync();
			}
		}
	};
	PANDORA.LOADER.setLinks = function(context) {
		var ctx = PANDORA.getContext(context);
		if (enablePush) {
			$(ctx + 'a:not(.' + PANDORA.LOADER.defaults.exceptionClass + ')').click(function(e) {
				var $this = $(this),
					url = $this.attr('href');
				if (isAsyncUrl(url)) {
					e.preventDefault();
					PANDORA.LOADER.load(url);
				}
			});
		}
		return this;
	};
	PANDORA.LOADER.init = function() {
		enablePush = (typeof history !== 'undefined' && typeof history.pushState !== 'undefined' && !PANDORA.BROWSER.msie);
		if (enablePush) {
			PANDORA.$window.bind('popstate', function(event) {

				var state = event.originalEvent.state;
				if (state) {
					PANDORA.LOADER.load(state.path, true);
				} else {
					console.log('Va');
					window.location.href = initialUrl;	    	
				}
			});
		}
		return this;
	};
})();