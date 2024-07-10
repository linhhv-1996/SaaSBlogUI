/* global grecaptcha,jQuery, site_vars */
var process_form, after_ajax_dom, after_ajax_error_alert, onsolveCallbackBlogTyrant, gen_scr, gen_scr_req;
jQuery(document).ready(function($){
    var adjustTwoColumnHeight = function($elem, childrenElems) {
        childrenElems = childrenElems || [''];
        $.each(childrenElems, function(i, selector){
            $elem.each(function(i){
                if ( i % 2 === 0 ) {
                    var $this = $(this),
                        $next = $this.next();
                    if (selector !== '') {
                        adjustNElemHeight([$this.find(selector), $next.find(selector)]);
                    }
                    adjustNElemHeight([$this, $next]);
                }
            });
        });
    };
    var adjustNElemHeight = function(elemsArr) {
        var heightArr = [];
        $.each(elemsArr, function(i, $elem){
            $elem.css('height', 'auto');
        });
        $.each(elemsArr, function(i, $elem){
            heightArr.push($elem.outerHeight());
        });
        var maxHt = heightArr.reduce(function(a, b) {
            return Math.max(a, b);
        });
        $.each(elemsArr, function(i, $elem){
            $elem.outerHeight(maxHt);
        });
    };
    var adjustThreeColumnHeight = function($elem, childrenElems) {
        childrenElems = childrenElems || [''];
        $.each(childrenElems, function(i, selector){
            $elem.each(function(i){
                if ( i % 3 === 0 ) {
                    var $this = $(this),
                        $next = $this.next(),
                        $third = $next.next();
                    if (selector !== '') {
                        adjustNElemHeight([$this.find(selector), $next.find(selector), $third.find(selector)]);
                    }
                    adjustNElemHeight([$this, $next, $third]);
                }
            });
        });
    };
    var $featPosts = $('.feat-posts .allp .main');
    if ( $featPosts.length > 0 ) {
        $( window ).on('resize', function() {
            adjustThreeColumnHeight($featPosts, ['h2', '.exc']);
        });
        adjustThreeColumnHeight($featPosts, ['h2', '.exc']);
        setTimeout(function() {
            adjustThreeColumnHeight($featPosts, ['h2', '.exc']);
        }, 350);
    }
    var $singleLatestPosts = $('.single .latest-posts .post');
    if ( $singleLatestPosts.length > 0 ) {
        $( window ).on('resize', function() {
            adjustThreeColumnHeight($singleLatestPosts, ['h2']);
        });
        adjustThreeColumnHeight($singleLatestPosts, ['h2']);
        setTimeout(function() {
            adjustThreeColumnHeight($singleLatestPosts, ['h2']);
        }, 350);
    }
    var $sub = $('.topics .sub');
    if ( $sub.length > 0 ) {
        $( window ).on('resize', function() {
            adjustTwoColumnHeight($sub);
        });
        adjustTwoColumnHeight($sub);
        setTimeout(function() {
            adjustTwoColumnHeight($sub);
        }, 350);
    }
    var $archivePosts = $('.otherp .main-con');
    if ( $archivePosts.length > 0 ) {
        $( window ).on('resize', function() {
            adjustTwoColumnHeight($archivePosts, ['h2', '.exc']);
        });
        adjustTwoColumnHeight($archivePosts, ['h2', '.exc']);
        setTimeout(function() {
            adjustTwoColumnHeight($archivePosts, ['h2', '.exc']);
        }, 350);
    }
    var $fullscreensearch = $('#fullscreensearch'),
				$inputSiteSearch = $('input.s.search-input');
    $('.site-header .search .fa-search').on('click', function () {
        $fullscreensearch.show().addClass('open');
				$inputSiteSearch.focus();
    });
    $('.closesearch').on('click', function () {
        $fullscreensearch.hide().removeClass('open');
    });
    $('.topmenu #menu-top > li.menu-item-has-children').on('click', function(){
        $(this).toggleClass('open');
    });
    var $topMenu = $('.topmenu'),
        $header = $('header');
    $('.mob-menu').on('click', function () {
        $(this).toggleClass('mobile-open');
        $(this).find( 'i' ).toggleClass( 'fa-bars' ).toggleClass( 'fa-times-fas' );
        $topMenu.toggleClass('mobile');
        $header.toggleClass('mobile-con-open');
    });
    var $blockquote = $('blockquote.css-quote');
    if ( $blockquote.length > 0 ) {
        $blockquote.attr( 'style', '' );
    }
    $('.collapse-block h2').on('click', function() {
        $(this).toggleClass( 'open' );
    });
	$('.accordion > dd:not(:first)').hide();
	$('.accordion > dt:first > a').addClass('selected');
	$('.accordion > dt:first > a span.indicator').addClass('active');
	$('.accordion > dt > a').click( function() {
		// Check whether item is open or closed
		if ( $(this).hasClass('selected') ) {
			// Open - close it
			$(this).removeClass('selected');
			$('span.indicator', $(this )).removeClass('active');
			$('.accordion > dd').slideUp();
		} else {
			// Close - open it
			// Remove selected class and reset symbol
			$('.accordion > dt > a ').each(function() {
				$(this).removeClass('selected');
				$('span.indicator', $( this )).removeClass('active');
			} );

			// Hide all panels
			$('.accordion > dd').slideUp();

			// Mark clicked item as selected
			$(this).addClass('selected');

			// Show selected panel
			$(this).parent().next().slideDown();

			// Update symbol
			$('span.indicator', $(this )).addClass('active');
		}
		return false;
	});

		$('.show-back').click(function(){
				$('html,body').animate({ scrollTop: 0 }, 'slow');
				return false;
		});
		$('.tweet-ths-lnk').click(function(e){
				event.preventDefault();
				var tweetedLink = window.location.href;
				var tweetSnippet = $('blockquote.tweet p').data('tweet');
				window.open("http://twitter.com/intent/tweet?url=" + tweetedLink + "&text=" + tweetSnippet + "&via=blogtyrant&", "twitterwindow", "height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0");
		});

		/** Adjust the H2, H3 tags in post-content to support numbered headings */
		var $postContentHeaders = $( '.post-body.mc h2, .post-body.mc h3' );
		if ( $postContentHeaders.length > 0 ) {
			$postContentHeaders.each( function( i ) {
				var $headerThis = $(this),
					headerText = $headerThis.html();
				if (!$headerThis.hasClass('no-num-class')) {
    				if ( headerText.match( /^\d/ ) ) {
    					$headerThis.html( headerText.replace( /(^\d+.)(.+$)/i, '<span>$1</span>$2' ) ).addClass( 'num-head' );
    				} else {
    					var $headerOrig = $headerThis;
    					$headerThis = $headerThis.find( 'a' );
    					if ( $headerThis.length > 0 ) {
    						headerText = $headerThis.html();
    						if ( headerText.match( /^\d/ ) ) {
    							$headerThis.html( headerText.replace( /(^\d+.)(.+$)/i, '<span>$1</span>$2' ) );
    							$headerOrig.addClass( 'num-head' );
    						}
    					}
    				}
				}
			} );
		}

    /** Nameboy Tool */
    var $document = $(document),
        urlbase = 'https://bluehost.sjv.io/c/11535/1434313/11352?sharedid=isitwp&u=https%3A%2F%2Fwww.bluehost.com%2Fspecial%2Fnameboy';

    /* Captcha Callback */
    var onsolveCallbackNameboy = function( g_recaptcha_response ) {
        queryNames( parseInt( $pageNum.val() ), g_recaptcha_response );
    };

    window.onsolveCallbackNameboy = onsolveCallbackNameboy;

    window.onloadCallbackNameboy = function() {
        grecaptcha.render( 'g_recaptcha', {
            'sitekey' : '6LcpX6kUAAAAAKDN5icukI_rvZ8lRtIMD08UNTkW',
            'callback' : onsolveCallbackNameboy
        });
    };

    $( '.options .optt' ).on( 'click', function(e){
        $( this ).toggleClass( 'fal' ).toggleClass( 'fas' );
    });

    /* Search form submit */
    $( '.sp-widget #searchform > div' ).append( '<div class="search-button"></div>' );
    $( 'body' ).on( 'click', '.sp-widget #searchform > div > .search-button', function(e){
        $( 'form#searchform' ).submit();
    });

    /* Span Tool - Waterfall */
    $document.on( 'click', 'tr.infr', function(e){
        var $this = $( this ),
            $reqhd = $this.next( '.reqhd' );

        $this.toggleClass( 'selected' );
        $reqhd.toggleClass( 'selected' );
    });

    /* Pagespeed suggestions */
    $document.on( 'click', 'h2.sbttl', function(e){
        var $this = $(this);
            $this.toggleClass( 'open' );
        $( '#' + $this.attr( 'id' ).replace( 'h2-', 'dsc-' ) ).toggle();
        $this.find( '.fa-chevron-up' ).toggle();
        $this.find( '.fa-chevron-down' ).toggle();
    });

    /* Nameboy Search */
    var $nboyInputSubmit = $( '#search-submit.search-submit-nameboy' );
    if ($nboyInputSubmit.length > 0) {
        var $results_section = $( '.container.result' ),
            $results_container = $( '.results' ),
            $results_wrap = $( '.atf-results' ),
            $input = $( '.search-input-nameboy' ),
            $next = $( '.pagin-s .next' ),
            $kwin = $( '.kwin' ),
            $loader = $( '.loader' ),
            $pageNum = $('#page-num'),
            openedWindow = 0;

        $nboyInputSubmit.off( 'click' );

        $input.keyup( function( e ){
            if ( e.keyCode == 13 ) {
                $nboyInputSubmit.click();
            }
        });

        $nboyInputSubmit.on( 'click', function(e){
            console.log(e);
            if ( $input.val() == '' ){
                return;
            }
            var recap = '',
                url = 'https://bluehost.sjv.io/c/11535/1434313/11352?sharedid=isitwp&u=https%3A%2F%2Fwww.bluehost.com%2Fspecial%2Fnameboy';
            if ( openedWindow == 0 && $( '.options .optt' ).hasClass( 'fas' ) ) {
                window.open(url, '_blank', 'location=yes,height=' + window.innerHeight + ',width=' + ( window.innerWidth * 65 / 100 ) + ',scrollbars=yes,status=yes');
                openedWindow = 1;
            }
            $results_wrap.show();
            $results_section.show();
            queryNames(1);
            $('html, body').animate({
                scrollTop: $results_section.offset().top
            }, 1000);
        });

        $( '.pagin-s > span' ).on( 'click', function(e){
            var page = $pageNum.val();
            queryNames(parseInt(page));
        });

        /* Function to query the results */
        var queryNames = function( pageNum, recap ) {
            pageNum = pageNum || 1;
            recap = recap || '';
            // clear out if page is 1
            if ( pageNum == 1 ) {
                $results_container.hide();
                $results_container.empty();
            }
            var search_input = $input.val();
            $kwin.html( escape( search_input ).split( '%20' ).join( ' ' ) );
            // build request
            var post_data = {
                _ajax_nonce: site_vars.search_nonce,
                action: 'get_result_nb',
                dataType: 'json',
                search_input: search_input,
                recapt: recap,
                page : pageNum
            };
            $loader.show();
            $.post( site_vars.ajax_url, post_data, function( response ) {
                var $g_recaptcha = $( '.g-recaptcha' );
                if ( response.data.message == 'noop' ) {
                    $g_recaptcha.show();
                    $loader.hide();
                    return false;
                }
                if ( response.success && response.data.code == 2 ) {
                    var results = response.data.results.split('fa fa-arrow-repeat').join('fal fa-repeat');
                    $results_container.append( results );
                    $results_container.show();
                    $next.show();
                    $pageNum.val(pageNum+1);
                    $( 'body .rs' ).attr( 'href', urlbase );
                } else {
                    console.log( 'something went wrong' );
                }
                if ( $g_recaptcha.is( ':visible' ) ) {
                    $g_recaptcha.hide();
                    grecaptcha.reset();
                }
            })
            .fail(function() {
                console.log( 'something went wrong' );
            }).always(function(){
                $loader.hide();
            });
        };
    }
    else {
        /* All other Tools */
        if ( $('#search-submit').length > 0 ) {

            $('#search-submit').removeAttr('disabled');

            $('#search-input').on('keyup', function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    return process_form();
                }
            });

            $('#search-submit').on('click', function(e) {
                e.preventDefault();
                return process_form();
            });

            after_ajax_dom = function() {
                $('#floatingCirclesG').removeClass('loading');
                $('#search-submit').removeAttr('disabled').removeClass('disabled');
            };

            after_ajax_error_alert = function() {
                alert('We are having some unexpected technical difficulties. Please reload the page and try again.');
            };

            onsolveCallbackBlogTyrant = function( g_recaptcha_response ) {
                process_form( g_recaptcha_response );
            };

            window.onloadCallbackBlogTyrant = function() {
                grecaptcha.render( 'g_recaptcha', {
                    'sitekey' : '6LcpX6kUAAAAAKDN5icukI_rvZ8lRtIMD08UNTkW',
                    'callback' : onsolveCallbackBlogTyrant
                } );
            };

            gen_scr = function(domain) {
                var $imCon = $('body').find('.scrsht-im'),
                    $imLoader = $imCon.find('.loaderc'),
                    $immaCon = $imCon.find('.imma-con');

                $immaCon.hide();
                $imLoader.show();

                var post_data = { _ajax_nonce: site_vars.search_nonce,
                    action: 'scrsht',
                    dataType: 'json',
                    q: domain
                };

                gen_scr_req = $.post(site_vars.ajax_url, post_data, function(response){
                    if ( response.success ) {
                        if (response.data.image != '') {
                            $immaCon.html('<img src="' + response.data.image + '" class="previewimg" />');
                        } else {
                            $immaCon.html('<img src="' + site_vars.themeurl + '/assets/images/no-image-icon.jpg" class="previewimg" />');
                        }
                    } else {
                        $immaCon.html('<img src="' + site_vars.themeurl + '/assets/images/no-image-icon.jpg" class="previewimg" />');
                    }
                }).fail(function() {
                    $immaCon.html('<img src="' + site_vars.themeurl + '/assets/images/no-image-icon.jpg" class="previewimg" />');
                }).always(function() {
                    $immaCon.show();
                    $imLoader.hide();
                });
            };

        }
    }

    var $illus = $('.illus');
    if ($illus.length > 0) {
        $illus.css( 'background-image', 'url("/images/hero-illustration.png")' );
    }

    var $illusT = $('.toolspg .after-head .illus');
    if ($illusT.length > 0) {
        $illusT.css( 'background-image', 'url("/images/illustration-tool.png")' );
    }

}).bind(window.jQuery);
