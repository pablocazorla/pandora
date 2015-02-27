// PANDORA SOCIALSHARE
(function() {
	'use strict';
	var shareData;
	PANDORA.SOCIALSHARE = {
		defaults: {
			'shareContainerId': 'share-nav',
			'facebook': {
				'url': 'https://www.facebook.com/sharer/sharer.php?u='
			},
			'twitter': {
				'url': 'https://twitter.com/home?status=',
				'description': 'I want to share',
				'descriptionSeparator': ' ',
				'width': '635',
				'height': '430'
			},
			'google': {
				'url': 'https://plus.google.com/share?url=',
				'width': '560',
				'height': '580'
			},
			'pinterest': {
				'url': 'https://pinterest.com/pin/create/button/?url=',
				'width': '1000',
				'height': '600'
			}
		},
		config: function(options) {
			this.defaults = $.extend(this.defaults, options);
			return this;
		},
		setShareData: function(someData) {
			var $nav = $('#' + PANDORA.SOCIALSHARE.defaults.shareContainerId),
				d = PANDORA.attributeToObj($nav.attr('data-share'));
			shareData = $.extend({
				'title': document.title,
				'description': null,
				'srcImage': null,
				'url': window.location.href
			}, d);
			if (typeof someData !== 'undefined') {
				shareData = $.extend(shareData, someData);
			}

			return this;
		},
		init: function() {
			return this.setShareData().select();
		}
	};
	var share = function($a) {
		var on = $a.attr('data-share').toLowerCase(),
			url = shareData.url,
			cfg = $.extend({
				'width': '600',
				'height': '360',
				'mediaSeparator': '&media=',
				'descriptionSeparator': '&description=',
				'title': 'Share'
			}, PANDORA.SOCIALSHARE.defaults[on]),
			urlShare,
			windowWidth = PANDORA.$window.width(),
			heightWidth = PANDORA.$window.height(),
			w = parseInt(cfg['width']),
			h = parseInt(cfg['height']);
		if (windowWidth < (w + 30)) {
			w = windowWidth - 30;
			cfg['width'] = w;
		}
		if (heightWidth < (h + 60)) {
			h = heightWidth - 60;
			cfg['height'] = h;
		}
		var left = Math.round((windowWidth - w) / 2),
			top = Math.round((heightWidth - h) / 2);
		switch (on) {
			case 'pinterest':
				urlShare = cfg['url'] + url + cfg['mediaSeparator'] + shareData.srcImage + cfg['descriptionSeparator'] + shareData.title + ' %3A ' + shareData.description;
				break;
			case 'twitter':
				urlShare = cfg['url'] + cfg['description'] + ' %22' + shareData.title + ' %22 %3A (' + url + ')';
				break;
			default:
				urlShare = cfg['url'] + url;
		};
		urlShare = urlShare.replace(/\s/g, '%20');
		window.open(urlShare, cfg['title'], 'width=' + cfg['width'] + ', height=' + cfg['height'] + ',left=' + left + ',top=' + top);
	};
	PANDORA.SOCIALSHARE.select = function() {
		$('#' + PANDORA.SOCIALSHARE.defaults.shareContainerId + ' a:not(.sharing)').click(function(e) {
			e.preventDefault();
			var $a = $(this).addClass('sharing');
			share($a);
		});
	};
})();