var Layout = {

	// Layout Theme Settings
	settings: {

		rippledButtons: true,
		autoScrollWhenMenuIsActive: false,
		improvePerformance: true,
		rtl: false,
		themeClass: '' // default color is indigo, available classes: brown, deep-purple, grey, red, teal

	},

	handleRtlLayout: function () {
		$body = $('body');

		if(this.settings.rtl)
			$body.addClass('layout-rtl');
		else
			$body.removeClass('layout-rtl');
	},

	handleThemeColor: function () {
		$body = $('body');

		$body.removeClass(function (index, css) {
			return (css.match (/(^|\s)theme-\S+/g) || []).join(' ');
		}).addClass('theme-'+this.settings.themeClass);
	},

	initLayer: function () {
		// Define neccessary elements
		var $windowHeight = $(window).height(),
				$windowWidth = $(window).width(),
				$startingPoint = $('.starting-point');

		// Calculate the diameter
		var diameterValue = (Math.sqrt( Math.pow($windowHeight, 2) + Math.pow($windowWidth, 2) ) * 2);

		// Animate
		$startingPoint.children('span').velocity({
			scaleX: 0,
			scaleY: 0,
			translateZ: 0,
		}, 10).velocity({
			height: diameterValue+'px',
			width: diameterValue+'px',
			top: -(diameterValue/2)+'px',
			left: -(diameterValue/2)+'px'
		}, 0);
	},

	layerResponsive: function () {
		// Define neccessary elements
		var $windowHeight = $(window).height(),
				$windowWidth = $(window).width(),
				$startingPoint = $('.starting-point');

		// Calculate the diameter
		var diameterValue = (Math.sqrt( Math.pow($windowHeight, 2) + Math.pow($windowWidth, 2) ) * 2);

		$startingPoint.children('span').css({
			height: diameterValue+'px',
			width: diameterValue+'px',
			top: -(diameterValue/2)+'px',
			left: -(diameterValue/2)+'px'
		});
	},

	listenForMenuLayer: function () {



		$('.nav-menu').on('click', function() {

			$(".search-layer").removeClass("activating active");
			$(".nav-search").removeClass("activating active");
			// Define neccessary elements
			var $this = $(this),
					$startingPoint = $('.starting-point'),
					$overlay = $('.overlay'),
					$menu = $('.menu-layer'),
					$overlaySecondary = $('.overlay-secondary'),
					$content = $('.content'),
					$body = $('body'),
					$scrollableTabs = $('.scrollable-tabs');

			// Add "open" class to active menu
			$menu.find('[data-open-after="true"]').addClass('open');

			// If Menu Layer is not active
			if( !$this.hasClass('active') ) {

				// start pulathisi 7/23/2015
            
                    $(".sidebaricons").removeClass("sidebaricons").addClass("sidebaricons-active");
                
               
            	// end pulathisi 7/23/2015

				if( !Pleasure.checkTouchScreen() && !Layout.settings.improvePerformance ) // If screen is desktop, add scaled effect
					$content.addClass('scaled');

				$menu.addClass('activating');
				$scrollableTabs.addClass('disabled');

				setTimeout(function () {
					$body.addClass('disable-scroll');
					$overlay.addClass('overlay-nav active');
					$this.addClass('active');
					//$menu.addClass('active');
					$overlaySecondary.addClass('fade-in');

					$menu.find('[data-open-after="true"]').parents('li').addClass('open animate');

					$.Velocity.animate($startingPoint.children('span'), {
						translateZ: 0,
						scaleX: 1,
						scaleY: 1
					}, { duration: 500, easing: [.42, 0, .58, 1] });

					if( Layout.settings.autoScrollWhenMenuIsActive ) {
						setTimeout(function () {
							$menu.animate({ scrollTop: $menu.find('[data-open-after="true"]').position().top + 200 }, 300);
						}, 600);
					}
				}, 50);

			} else {
			// If Menu Layer is active

			// start pulathisi 7/23/2015
            
                    $(".sidebaricons-active").removeClass("sidebaricons-active").addClass("sidebaricons");
               
            // end pulathisi 7/23/2015

				$this.addClass('rotating');

				$overlaySecondary.removeClass('fade-in');
				$content.removeClass('scaled');

				setTimeout(function() {
					$menu.removeClass('active');
					$.Velocity.animate($startingPoint.children('span'), {
						translateZ: 0,
						scaleX: 0,
						scaleY: 0
					}, {
						duration: 500,
						easing: [.42, 0, .58, 1],
						complete: function () {
							$overlay.removeClass('active overlay-nav');
							$this.removeClass('active rotating');
							$menu.removeClass('activating');
							$body.removeClass('disable-scroll');
							$menu.find('.open').removeClass('open animate');
							$scrollableTabs.removeClass('disabled');
						}
					})
				}, 200);

			}
		});

		// Close menu by clicking overlay
		$('.overlay').on('click', function () {
			$('.nav-menu').trigger('click');
		});
	},

	listenForSearchLayer: function () {
		$('.nav-search').on('click', function(){
			// start pulathisi 7/23/2015
			// when nav search is clicked change sidebar icon class, this changes icon colors
			$(".sidebaricons").removeClass("sidebaricons").addClass( "sidebaricons-active" );
			// end pulathisi 7/23/2015
			// Define neccessary elements
			var $this = $(this),
					$startingPoint = $('.starting-point'),
					$overlay = $('.overlay'),
					$body = $('body'),
					$content = $('.content'),
					$searchLayer = $('.search-layer'),
					$scrollableTabs = $('.scrollable-tabs');

			// If Search Layer is not active
			if( !$this.hasClass('active') ) {

				if( !Pleasure.checkTouchScreen() && !Layout.settings.improvePerformance ) // If screen is desktop, add scaled effect
					$content.addClass('scaled');

				$searchLayer.addClass('activating');
				$scrollableTabs.addClass('disabled');

				setTimeout(function () {
					$body.addClass('disable-scroll');
					$overlay.addClass('overlay-search active');
					$overlay.removeClass('overlay-nav');
					$this.addClass('active');
					$searchLayer.addClass('active');
					$.Velocity.animate($startingPoint.children('span'), {
						translateZ: 0,
						scaleX: 1,
						scaleY: 1
					}, {
						duration: 500,
						easing: [.42, 0, .58, 1],
						complete: function () {
							if( !Pleasure.checkTouchScreen() ) // if screen is desktop, focus search input
								$searchLayer.find('input').focus();
						}
					});
				}, 50);

			} else {
			// If Search Layer is active
				// start pulathisi 7/23/2015
				// when active nav search is clicked change sidebar icon class, this changes icon colors back to previous
				$(".sidebaricons-active").removeClass("sidebaricons-active").addClass( "sidebaricons" );
				// end pulathisi 7/23/2015

				$searchLayer.find('input').blur();
				$searchLayer.removeClass('active');
				$this.addClass('rotating');
				$content.removeClass('scaled');

				setTimeout(function() {
					$.Velocity.animate($startingPoint.children('span'), {
						translateZ: 0,
						scaleX: 0,
						scaleY: 0
					}, {
						duration: 500,
						easing: [.42, 0, .58, 1],
						complete: function () {
							$this.removeClass('active rotating');
							$overlay.removeClass('active overlay-search');
							$searchLayer.removeClass('activating');
							$body.removeClass('disable-scroll');
							$scrollableTabs.removeClass('disabled');
						}
					});
				}, 200);
			}
		});
	},

	listenForUserLayer: function () {
		$('.nav-user').on('click', function() {

			// Define neccessary elements
			var $this = $(this),
					$startingPoint = $('.starting-point'),
					$overlay = $('.overlay'),
					$body = $('body'),
					$content = $('.content'),
					$userLayer = $('.user-layer'),
					$messages = $('.messages'),
					$scrollableTabs = $('.scrollable-tabs');

			// When Message Tab is active
			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
				var target = $(e.target).attr('href');
				if ((target == '#messages'))
					$messages.scrollTop( $messages.prop('scrollHeight') );
			});


			// If User Layer is not active
			if( !$this.hasClass('active') ) {

				if( !Pleasure.checkTouchScreen() && !Layout.settings.improvePerformance ) // If screen is desktop, add scaled effect
					$content.addClass('scaled');

				$userLayer.addClass('activating');
				$scrollableTabs.addClass('disabled');

				setTimeout(function () {
					$('#send-message-input').val('').trigger('input');

					$body.addClass('disable-scroll');
					$overlay.addClass('overlay-user active');
					$this.addClass('active');
					$userLayer.addClass('active');

					$messages.scrollTop( $messages.prop('scrollHeight') );

					$.Velocity.animate($startingPoint.children('span'), {
						translateZ: 0,
						scaleX: 1,
						scaleY: 1
					}, { duration: 500, easing: [.42, 0, .58, 1] });
				}, 50);

			} else {
			// If User Layer is active
				$userLayer.removeClass('active');
				$this.addClass('rotating');
				$content.removeClass('scaled');

				setTimeout(function() {
					$.Velocity.animate($startingPoint.children('span'), {
						translateZ: 0,
						scaleX: 0,
						scaleY: 0
					}, {
						duration: 500,
						easing: [.42, 0, .58, 1],
						complete: function () {
							$this.removeClass('active rotating');
							$overlay.removeClass('active overlay-user');
							$userLayer.removeClass('activating');
							$body.removeClass('disable-scroll');
							$scrollableTabs.removeClass('disabled');
						}
					});
				}, 200);
			}
		});
	},

	listenKeyboardEvents: function () {

		$(document).keyup(function(e) {

			// Define neccessary elements
			var $navUser = $('.nav-user'),
					$navSearch = $('.nav-search'),
					$navMenu = $('.nav-menu');

			// If user press ESC and Menu Layer is active
			if (e.keyCode == 27 && $navMenu.hasClass('active')) {
				$navMenu.trigger('click');
			}

			// If user press ESC and Search Layer is active
			if (e.keyCode == 27 && $navSearch.hasClass('active')) {
				$navSearch.trigger('click');
			}

			// If user press ESC and User Layer is active
			if (e.keyCode == 27 && $navUser.hasClass('active')) {
				$navUser.trigger('click');
			}

		});
	},

	listenMenu: function () {

		// If user click any menu link
		$('.menu-layer a').on('click', function () {

			// Define neccessary elements
			var $this = $(this),
					$menu = $(this).parents('.menu-layer');

			if( $this.parents('ul').hasClass('child-menu') ) {
				// If user clicks child menu
				if( $this.parent().hasClass('open') ) {
					// If user wants to close the opened child menu
					$this.parent().removeClass('open animate');
				} else {
					// If user clicks new child menu in parent menu
					$this.parent().siblings('.has-child').removeClass('open animate');
					$this.parent().addClass('open');
					setTimeout(function () {
						$this.parent().addClass('animate');
					}, 100);
				}
			} else {
				// If user clicks parent menu
				if( $this.parents('li').hasClass('open') ) {
					// If user wants to close the parent menu
					$this.parents('li').removeClass('animate open');
				} else {
					// If user clicks another parent menu
					$menu.find('.open').removeClass('animate open');
					$this.parents('li').addClass('open');
					setTimeout(function () {
						$this.parents('li').addClass('animate');
					}, 10);
				}
			}
		});

		// Adding child icon to parent menu links
		$('.menu-layer').find('li:has("ul")').each( function () {
			$(this).addClass('has-child');
		});

		// Adding neccessary elements to the menu links to use for animation
		$('.menu-layer').find('li').each( function () {
			$(this).append('<span class="hover-bg"></span>');
		});

	},

	initSelectPicker: function () {
		// Find select elements with "selecter" class
		$('select.selecter').selectpicker();
	},

	initAutoSizeTextarea: function () {
		// Find textarea elements with "js-auto-size" class
		$('.js-auto-size').textareaAutoSize();
	},

	listenInputs: function () {
		// Find input and textarea elements with "inputer" class
		$('.inputer').on('keyup', function () {
			var $formControl = $(this).find('.form-control');
			if($formControl.val().length > 0)
				$formControl.addClass('valid');
			else
				$formControl.removeClass('valid');
		});
	},

	initInputerBorders: function () {
		// Disabled
		$('.inputer>.input-wrapper>.form-control:disabled').parents('.input-wrapper').addClass('disabled');

		// Readonly
		$('.inputer>.input-wrapper>.form-control[readonly]').parents('.input-wrapper').addClass('readonly');

		$('.inputer>.input-wrapper>.form-control').on('focus', function () {
			$('.input-wrapper.active').removeClass('active');
			$(this).parents('.input-wrapper').addClass('active');
		});
		$('.inputer>.input-wrapper>.form-control').on('blur', function () {
			$('.input-wrapper.active').removeClass('active');
		});
	},

	handleRippledButtons: function () {

		if( this.settings.rippledButtons ) {

			// Thanks to Andrew Tunnecliffe http://codepen.io/atunnecliffe/pen/VYayGp
			var element, ripple, d, x, y;
			var i = 1;
			var queue = [];

			$('.btn').addClass('btn-ripple');

			$('.btn-ripple').on('click', function(e) {
				element = $(this);

				// remove old items from queue and DOM
				// allow max 5 to be loaded
				if (queue.length > 5) {
					$('._' + queue.shift()).remove();
				}

				// Assume user can't click more than 1000 times / second
				//terrible overflow protection.
				if (i > 1000) {
					i = 0;
				}

				// add next item to queue
				i++;
				queue.push(i);

				// Build element
				element.append('<span class="ripple _' + i + '"></span>');
				ripple = element.find('._' + i);

				// Make it big enough to cover whole parent
				if(!ripple.height() && !ripple.width()) {
					d = Math.max(element.outerWidth(), element.outerHeight());
					ripple.css({height: d, width: d});
				}

				// Get origin
				x = e.pageX - element.offset().left - ripple.width() / 2;
				y = e.pageY - element.offset().top - ripple.height() / 2 ;

				// Set location and animate
				ripple.css({top: y+'px', left: x+'px'}).addClass('animate');
			});

		}
	},

	// Handle Sidebar Menu by Viewport
	handleSidebar: function () {
		var $window = $(window),
				$body = $('body');

		if( $window.width() <= 767 ) {
			$body.addClass('layout-device layout-tablet');
		} else if( $window.width() > 767 && $window.width() < 990 ) {
			$body.addClass('layout-tablet');
			$body.removeClass('layout-device');
		} else if( $window.width() > 990 ) {
			$body.removeClass('layout-device layout-tablet');
		}
		Layout.resetSendMessage();
	},

	// Listen Message Events
	listenMessageEvents: function () {

		// Open Single Message
		$('.message-list>li').on('click', function () {
			$(this).parent().find('.selected').removeClass('selected');
			$(this).addClass('selected');
			$('#messages').addClass('open');

			Layout.getMessageById( $(this).find('a').data('message-id') );
		});

		// When mobile close message overlay
		$('.message-list-overlay').on('click', function () {
			$('#messages').removeClass('open');
			$('.message-list').find('.selected').removeClass('selected');
		});

		$('.mobile-back-button').on('click', function () {
			$('.message-list-overlay').trigger('click');
			$(this).parent().removeClass('active');
		});
	},

	getMessageById: function (id) {
		// Define neccessary elements
		var $messages = $('#messages').find('.messages'),
				$messageSendContainer = $('.message-send-container'),
				$mobileBack = $('.mobile-back');

		// Adding Loading Bar
		$messageSendContainer.addClass('loading').prepend('<div class="loading-bar indeterminate"></div>');

		// For demo purposes, 1 second delay
		setTimeout( function () {
			var jqxhr = $.ajax({
				url: 'demo/messages/'+id+'.html',
				beforeSend: function() {
					$messages.html('');
					Layout.resetSendMessage();
				}
			}).done(function(data) {
				$messages.html(data);
				$messages.scrollTop( $messages.prop('scrollHeight') );
				$messageSendContainer.removeClass('loading').find('.loading-bar').remove();
			}).fail(function(jqXHR, textStatus) {
				$messageSendContainer.removeClass('loading').find('.loading-bar').remove();
			});
		}, 1000);

		// If Layout is mobile then return button should come to screen
		if( $('body').hasClass('layout-device') )
			$mobileBack.addClass('active');
	},

	resetSendMessage: function () {
		// Define neccessary elements
		var $sendMessageInput = $('#send-message-input');

		$sendMessageInput.val('').trigger('input');
		$sendMessageInput.trigger('change');
	},

	listenSendButtonOnMessages: function () {
		// Define neccessary elements
		var $sendMessageInput = $('#send-message-input'),
				$sendButton = $('#send-message-button'),
				$messages = $('#messages').find('.messages');

		// Listen message input on key events
		$sendMessageInput.on('change keyup paste', function() {

			$messages.height('calc(100% - '+($sendMessageInput.height()+60)+'px');

			if($('body').hasClass('layout-device')) {
				$messages.height('calc(100% - '+($sendMessageInput.height()+30)+'px');
			}

			$sendButton.height( $sendMessageInput.height()+5 );
		});

		// Sending Messages
		$sendButton.on('click', function () {
			var messageText = $sendMessageInput.val().trim();
			if( messageText.length == 0 )
				messageText = "Take an angled photo of your screen. All the cool kids do it.";

			var html = '<div class="message animate right">'+
					'<div class="message-text">'+messageText+'</div>'+
					'<img src="../../assets/globals/img/faces/tolga-ergin.jpg" class="user-picture" alt="">'+
					'</div>';
			$messages.append(html);
			Layout.resetSendMessage();
			$messages.scrollTop( $messages.prop('scrollHeight') );

		});
	},

	// Listen Card Events
	listenCardEvents: function () {
		// Toggle Card News More
		$('.toggle-card-news-more').on('click', function () {
			$(this).parents('.card').toggleClass('card-active');
		});
	},

	// Material Meaningful Animation
	handleMaterialAnimation: function () {
		// inspired by Kupletsky Sergey http://codepen.io/zavoloklom/pen/wtApI
		var speed = 2000;
		var container =  $('.display-animation');
		container.each(function() {
			var elements = $(this).find('.material-animate');
			elements.each(function() {
					var elementOffset = $(this).offset();
					var offset = elementOffset.left*0.8 + elementOffset.top;
					var delay = parseFloat(offset/speed).toFixed(2);

					$(this)
						.css("-webkit-animation-delay", delay+'s')
						.css("-o-animation-delay", delay+'s')
						.css("animation-delay", delay+'s');

					makeWatcher( $(this) );
				});
		});

		function makeWatcher( element ) {
			var watcher = scrollMonitor.create( element );

			function addClass() {
				if (watcher.enterViewport) {
					element.addClass('material-animated');
					watcher.destroy();
				}
			}

			watcher.stateChange(addClass);
			addClass();
		}
	},

	// Clickable Cards Animations
	listenClickableCards: function () {
		// inspired by Balapa http://codepen.io/balapa/pen/embYYB

		$('.floating-open').on('click', function () {
			var $this = $(this);
			$this.parents('.clickable-button').addClass('clicked');
			$this.parents('.clickable-button').next('.layered-content').addClass('active');

			setTimeout(function () {
				$this.parents('.card-heading').css('overflow', 'hidden');
			}, 100);

		});

		$('.floating-close').on('click', function () {
			var $this = $(this);
			$this.parents('.layered-content').prev('.clickable-button').removeClass('clicked');
			$this.parents('.layered-content').removeClass('active');

			setTimeout(function () {
				$this.parents('.card-heading').css('overflow', 'initial');
			}, 600);

		});
	},

	parallaxHeader: function () {
		var $pageHeader = $('.page-header');

		if( $pageHeader.hasClass('parallax') ) {
			$( window ).scroll(function() {
				var documentScrollTop = $(document).scrollTop(),
						headerHeight = $pageHeader.height(),
						$parallaxBg = $('.parallax-bg');

				$parallaxBg.css('top', (documentScrollTop*0.5));
				$parallaxBg.css('opacity', (1 - documentScrollTop/headerHeight*1));

			});
		}
	},

	scrollableTabs: function () {
		var $scrollableTabs = $('.scrollable-tabs');
		$scrollableTabs.each( function () {
			var $navtabs = $(this).find('.nav-tabs'),
					calculatedWidth = 0;
			$navtabs.children().each(function() { calculatedWidth += $(this).width(); });

			$navtabs.width(calculatedWidth+5);
		});
	},

	stickyHeader: function () {
		var $sticky = $('.sticky');

		if( $sticky.length > 0 ) {
			var stickyOffset = $sticky.offset().top;

			$( window ).scroll(function() {
				var scroll = $(window).scrollTop();

				if($('body').hasClass('layout-device')) {
					if (scroll + 61 >= stickyOffset)
						$sticky.addClass('fixed');
					else
						$sticky.removeClass('fixed');
				} else {
					if (scroll >= stickyOffset)
						$sticky.addClass('fixed');
					else
						$sticky.removeClass('fixed');
				}
			});
		}
	},

	init: function () {

		// Layout settings
		/*
		this.handleThemeColor();
		this.handleRtlLayout();
		*/

		// Layers
		this.initLayer();
		Pleasure.callOnResize.push( this.layerResponsive ); // Call layerResponsive function when resizing

		this.listenForMenuLayer();
		this.listenForSearchLayer();
		this.listenForUserLayer();
		this.listenKeyboardEvents();

		// Menu Links
		this.listenMenu();

		// Form Elements
		this.initSelectPicker();
		this.initAutoSizeTextarea();
		this.listenInputs();
		this.initInputerBorders();

		// Rippled Buttons
		this.handleRippledButtons();

		// Handle Sidebar
		this.handleSidebar();
		Pleasure.callOnResize.push( this.handleSidebar );

		// Listen Message Events
		this.listenMessageEvents();
		this.listenSendButtonOnMessages();

		// Listen Card Events
		this.listenCardEvents();

		// Handle Material Animation
		this.handleMaterialAnimation();

		// Listen Clickable Cards
		this.listenClickableCards();

		// Parallax
		this.parallaxHeader();

		// Sticky Header
		this.stickyHeader();

		// Scrollable Tabs
		this.scrollableTabs();

	}

};

