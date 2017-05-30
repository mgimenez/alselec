/**
 * Touchtap
 */
(function(win, doc, $){
    'use strict';

    var touchStartPos,
        distance;

    $(doc).on("touchstart", function (e) {
        touchStartPos = $(win).scrollTop();
    }).on("touchend", function (e) {
        distance = touchStartPos - $(win).scrollTop();
        if (distance < 20 && distance > -20) {
            $(e.target).trigger('touchtap');
        }
    });

})(window, window.document, window.jQuery);

/**
 * App
 */
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
			contact.init();
			tracking.init();
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
			});

			if (touchDetect.isTouchDevice()) {

				$('.js-cert').on('touchtap', function(e) {
					$(this).toggleClass('active');
					$('.sub-menu').toggleClass('active');
				});

			}

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

	contact = {

		init: function() {

				$('.submit').on('click', function (e) {
          e.preventDefault();
  				//Get the data from all the fields
  				var name = $('input[name=name]'),
  						email = $('input[name=email]'),
  						comment = $('textarea[name=comment]');

  				if (validations()) {
            $('.loading').show();

    				//organize the data properly
    				var data = 'name=' + name.val() + '&email=' + email.val() + '&comment='  + encodeURIComponent(comment.val());

    				//start the ajax
    				$.ajax({
    					url: "php/process.php",
    					type: "GET",
    					data: data,
    					cache: false,
    					success: function (html) {
    						//if process.php returned 1/true (send mail success)
    						if (html==1) {
    							// $('.form-container .fields-container').css('visibility', 'hidden');
    							$('.done').fadeIn('slow');
    							$('.loading').fadeOut('slow');
                  window.setTimeout(function() {
                    $('.done').fadeOut('slow');
                    name.val('');
                    email.val('');
                    comment.val('');
                  }, 5000);

    						//if process.php returned 0/false (send mail failed)
    						} else {
    							window.alert('Perdón, hubo un error. Por favor, vuelva a intentar.');
    						}
    					}
    				});
    					//cancel the submit button default behaviours
    					return false;
            }
				});

        $('input[name="name"]').on('keyup', function () {
          if ($(this).hasClass('hightlight')) {
            validateField($(this));
          }
        });

        $('input[name="email"]').on('keyup', function () {
          if ($(this).hasClass('hightlight')) {
            validateEmail($(this));
          }
        });

        $('textarea[name="comment"]').on('keyup', function () {
          if ($(this).hasClass('hightlight')) {
            validateField($(this));
          }
        });

        function validations() {
          var name = $('input[name=name]'),
  						email = $('input[name=email]'),
  						comment = $('textarea[name=comment]');

          validateField(name);
          validateEmail(email);
          validateField(comment);

          if (validateField(name) && validateEmail(email) && validateField(comment)) {
            return true;
          } else {
            return false;
          }
        }

				function validateField(field) {
					if (field.val()=== '') {
						field.addClass('hightlight');
						return false;
					} else {
						field.removeClass('hightlight');
            return true;
					}
				}

				function validateEmail(field) {
          // console.log('a');
				    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				    if(!re.test(field.val())) {
							field.addClass('hightlight');
							return false;
						} else {
							field.removeClass('hightlight');
              return true;
						}
				}

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
			return (!!('ontouchstart' in window));
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
					});

				}
		}

	},

  tracking = {

    init: function() {

      $('.btn-download, .js-sub-menu-cert a').on('click',function(ev){
      	ga('send', 'event', 'pdf', 'click - ' + this.href, this.href);
      });

      $('.btn-linkedin').on('click',function(){
      	ga('send', 'event', 'linkedin', 'click');
      });
    }

  };



}(window, window.document, window.jQuery));
