String.prototype.format = function() {
    var args = arguments;

    if(typeof(arguments[0]) === 'object') {
    	args = arguments[0];
    }
    return this.replace(/{(\d+)}/g, function(match, number) { 
	    return typeof args[number] != 'undefined' ? args[number] : match;
    });
};


(function($) {
	"use strict"; // Start of use strict

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}


	function generate_random() {
		var x = window.innerWidth;
		var y = window.innerHeight;

		var _x = getRandomInt(200, x -200);
		var _y = getRandomInt(100, y -100);
		return [_x, _y];
	}

	function main_page() {

		console.log("sdvmsdknv")

		
		function drop_out(_content_text, orb_class, orb_tag, to_html, init_delay, drop_delay, animations) {
			// to_html = "<span style='position: absolute; font-size: 40%; top: {}px; left: {}px'>{0}</span>";

			console.log("sdvmsdknv--------1 ")
			_content_text.forEach(function (ch) {			
				$(orb_class).append(to_html.format(ch));
			});

			var orb = 0;
			var dropOrbs = function(){
				// $(orb_class+" "+orb_tag).eq(orb).velocity({top: '0px'}, 900).velocity({scaleX: 1, scaleY: 1}, 1000).css('position', 'relative');
				var transform = $(orb_class+" "+orb_tag).eq(orb);
				animations.forEach(function(animate) {
					var animate_delay = animate[1],
						animate_prop = animate[0],
						ease_in_type = animate[2];


					transform = transform.velocity(animate_prop, animate_delay, ease_in_type);
				});
				transform.css('position', 'relative');

				orb = orb + 1;
				if(orb < _content_text.length){
					setTimeout(dropOrbs, drop_delay);
				}
			}
			setTimeout(dropOrbs, init_delay);
		}

		/////////////////// Title ///////////////////
		var title_text = "Suman Saurabh".split("");
		var html_content = "<span style='position: absolute; font-size: 40%; top: -500px;'>{0}</span>";
		var new_postion = [{top: '0px'}, 1000, "easeInExpo"];
		var scale = [{'font-size': '110%'}, 900, "easeInExpo"];
		var animations = [new_postion, scale];
		drop_out(title_text, '.mb-1', 'span', html_content, 400, 100, animations);


		/////////////////////////////// DESC ////////////////////////////////////////////////

		var _desc_text = ["Hey, I'm a FullStack Developer from Bengaluru, India. I am an AI enthusiast as well", 
							"Currently, I am working at IQLECT building it's real-time infrastructure.", 
							"Please check out my blogs and github repo."];

		var html_content = "<p style='position: absolute; left: -900px; top: 0px'>{0}</p>";
		var new_postion = [{left: '0px'}, 200, "linear"];
		var scale = [{'font-size': '90%'}, 400, "linear"];
		var animations = [new_postion, scale];
		drop_out(_desc_text, '.masthead-content', 'p', html_content, 400, 100, animations);




		/////////////////////////////// DESC ////////////////////////////////////////////////
		var _desc_text = [["GITHUB", "github"], ["BLOG", "blog"], ["CONTACT", "contact"]];
		var html_content = '<button type="button" class="btn btn-primary" style="opacity: 0;" id="{1}-ln">{0}</button>';
		var new_opacity = [{opacity: 1}, 3000];
		var animations = [new_opacity];
		drop_out(_desc_text, '.masthead-links', 'button', html_content, 400, 100, animations);




		$("#github-ln").click(function(){
			// $('#main-view').addClass('animated zoomOut');
			Router.navigate('/github');
		});

		$("#blog-ln").click(function(){
			// $('#main-view').addClass('animated zoomOut');

			Router.navigate('/blog');
		});

		$("#contact-ln").click(function(){
			// $('#main-view').addClass('animated zoomOut');
			console.log("suamsdjias");
	  		// $('#main-content').addClass('animated hinge')
			$('#main-content').css({
	            '-webkit-transform': 'translateX( -120% ) rotateY( 180deg )',
	  			'transform': 'translateX( 120% ) rotateY( 180deg )'
	  		
	        }).promise().done(function() {
	        	setTimeout(function() {
		        	$('#main-content').css({'display': 'none'});
		        	$('#contact-form').css({
			            'display': 'unset',
			            'opacity': 0
			        });
		        }, 1000);
		        $('#contact-form').addClass('animated rollIn');
		        $('#contact-form').css({
			            'opacity': 1
			    });

	        });
	        
		});

		$('#contact-close').click(function(){
			// $('#main-view').addClass('animated zoomOut');
	  		// $('#main-content').addClass('animated hinge')
	  		$('#contact-form').removeClass('animated rollIn flipOutY');
	  		$('#contact-form').addClass('animated flipOutY');

	    	setTimeout(function() {
	    		$('#contact-form').css({'display': 'none'});
	        	$('#main-content').css({'display': 'unset'}).promise().done(function() {
	        		setTimeout(function(){
		        		$('#main-content').css({
				            '-webkit-transform': 'translateX( 0px ) rotateY( 0deg )',
				  			'transform': 'translateX( 0px ) rotateY( 0deg )'
				  		
				        });
		        	}, 20)
	        	});
	        }, 500);
		});

	}



	/////////////////////////////// Side Flag ///////////////////////////////////
	var masthead = $(".masthead-links-2");

	var masthead_flag;
	function flag_animation() {
		masthead_flag = setInterval( function(){

			masthead.velocity({rotateY: "-30deg",easing: "linear" },600); 
			masthead.velocity({rotateY: "30deg",easing: "easeOutSine" },500); 
			masthead.velocity({rotateY: "-25deg",easing: "easeOutSine" },800); 
			masthead.velocity({rotateY: "30deg",easing: "easeOutSine" },900); 

		},10);
	}

	// flag_animation();


///////////////////////////////////////////////////////////////////////////////////////////////////////

	// $("#burger-menu .menu").click(function(){
	//    $(this).parent().toggleClass("close-bg");
	// });


	var burgerMenu = document.getElementById('burger-menu');
	var overlay = document.getElementById('menu');
	burgerMenu.addEventListener('click',function(){
	  	toggle_burger_menu();
	});

	function toggle_burger_menu() {
		burgerMenu.classList.toggle("burger-close");
	  	overlay.classList.toggle("overlay");
	}

	

	console.log("----1> ",window.location.hash.substr(1));

	var x=window.location.hash.substr(1);

	Router.config({ mode: null, defaultPath: '/home'});

	// returning the user to the initial state
	Router.navigate();

	// adding routes
	Router
	.add(/home/, function() {
	    console.log('about');
	    console.log($('#route-content'));
	    // overlay.classList.remove("overlay");

	    if($('.burger-close').length > 0) toggle_burger_menu();
	    
	    $('#route-content').load("template/home.html", function(){
	    	main_page();
	    });
	    
	   
	})
	.add(/github/, function() {
	    console.log('about');
	    $('#burger-display').css({display: 'unset'});
	    // overlay.classList.remove("overlay");
	    // console.log($('route-content'));
	    if($('.burger-close') > 0) toggle_burger_menu();
	    $('#route-content').load("template/github.html", function(){
	    	$('#route-content').addClass('animated flipInX');
	    });
	   
	})
	.add(/blog/, function() {
	    console.log('about');
	    $('#burger-display').css({display: 'unset'});
	    if($('.burger-close') > 0) toggle_burger_menu();
	    $('#route-content').load("template/blog.html", function(){
	    	$('#route-content').addClass('animated fadeInLeft');
	    });
	})
	.add(function() {
	    console.log('default');
	    // console.log('about');
	    // console.log($('route-content'));
	    // $('route-content').load("template/home.html");
	    // setTimeout(function(){

	    // 	main_page();
	    // }, 1)
	    // Router.navigate('/home');
	}).listen();

	console.log("----2> ",window.location.hash.substr(1));
	
	if(x== null || x == ''){
		x='/home'
	}
	Router.navigate(x);




})(jQuery); // End of use strict
