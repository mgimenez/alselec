(function(win, doc, $) {
	'use strict';

	$(doc).ready(function(){

	  app.init();

	});

	var app = {

		init: function() {
			header.init();
			slider.init();
			touchDetect.init();
			uncover.init();
		}

	},

	header = {

		init: function() {
			$('.js-slide-menu').on('click', function() {
				$('body').toggleClass('slide-menu-active');
			});

			$('.js-goto-products').on('click', function(e) {
				e.preventDefault();

				$('body').animate({scrollTop: $('.our-products').offset().top + 10}, 400);
			})
		}

	},

	slider = {

		init: function() {
			$('.slider').slick({
				autoplay: true,
	  		autoplaySpeed: 5000,
				infinite: true
			});
		}

	},

	touchDetect = {

		init: function() {
				touchDetect.setTouchDevice();

				$(win).on('resize', function() {
					touchDetect.setTouchDevice();
				});
		},

		isTouchDevice: function() {
			return (!!('ontouchstart' in window))
		},

		setTouchDevice: function() {

			var $body = $('body');
			$body.removeClass('touch-device non-touch-device');

			if(touchDetect.isTouchDevice()) {
				$body.addClass('touch-device');
			} else {
				$body.addClass('non-touch-device');
			}

		}

	},

	uncover = {

		init: function() {

				if (touchDetect.isTouchDevice()) {

					$('body').on('touchtap', function(e) {

						$('.js-uncover').removeClass('active');

						if ($(e.target).parents('.js-uncover').length > 0) {
							$(e.target).parents('.js-uncover').addClass('active');
						}
					})

				}
		}

	};



}(window, window.document, jQuery));
