// ---------------------------------------------------------------------
// Global JavaScript
// Authors: Andrew Ross & a little help from my friends
// ---------------------------------------------------------------------

(function() {

general();
viewPort();
lines();
homepage();

// ---------------------------------------------------------------------
// Browser and Feature Detection
// ---------------------------------------------------------------------
function general() {
    this.doc = document.documentElement;

    setTimeout(function(){
        document.body.classList.add('page-loaded');
    }, 400);

	if ( ! ('ontouchstart' in window) ) {
        this.doc.classList.add('no-touch');
    }

	if ( 'ontouchstart' in window ) {
        this.doc.classList.add('is-touch');
    }

	if (document.documentMode || /Edge/.test(navigator.userAgent)) {
        if(navigator.appVersion.indexOf('Trident') === -1) {
            this.doc.classList.add('isEDGE');
        } else {
            this.doc.classList.add('isIE isIE11');
        }
    }

    // var mt = document.getElementById('menu-toggle');
	// 	bd = document.body;
    //
	// mt.onclick = function() {
	// 	if( bd.classList.contains('menu-is-open') ){
	// 		bd.classList.remove('menu-is-open');
	// 	} else {
	// 		bd.classList.add('menu-is-open');
	// 	}
	// }
}



// ---------------------------------------------------------------------
// Detect when an element is in the viewport
// ---------------------------------------------------------------------

function viewPort(){
    var items = document.querySelectorAll('*[data-animate-in], *[data-detect-viewport]'),
        pageOffset = window.pageYOffset;

    function isScrolledIntoView(el) {
        var rect = el.getBoundingClientRect(),
            elemTop = rect.top,
            elemBottom = rect.top + el.offsetHeight,
            bottomWin = pageOffset + window.innerHeight;

        return (elemTop < bottomWin && elemBottom > 0);
    }

    function detect() {
        for(var i = 0; i < items.length; i++) {
            if ( isScrolledIntoView(items[i]) ) {
                if( !items[i].classList.contains('in-view') ) {
                    var el = items[i];
                    el.classList.add('in-view');
                    var delay = parseFloat(el.getAttribute('data-animate-in-delay'));
                    if(!el.getAttribute('data-animate-in-delay')) {
                        delay = 0;
                    }
                    if(el.getAttribute('data-animate-in') == 'up'){
                        TweenMax.to(el, .8, { alpha: 1, y: 0 }).delay(delay);
                        TweenMax.to(el, .8, { scale: 1, rotation: 0, ease: Elastic.easeOut.config(1, 0.7) }).delay(delay);
                    } else {
                        TweenMax.to(el, .1, { alpha: 1, ease: Power4.easeOut }).delay(delay);
                    }

                }
            }
            else {
                if( items[i].classList.contains('in-view') ) {
                    items[i].classList.remove('in-view');
                }
            }
        }
    }

    window.addEventListener('scroll', detect);
    window.addEventListener('resize', detect);


	for(var i = 0; i < items.length; i++) {
		var d = 0,
			el = items[i];

        if( el.getAttribute('data-animate-in') == 'up' ){
            TweenMax.to(items[i], 0, { scale: 0.6, rotation: 15, alpha: 0 });
        } else {
            TweenMax.to(items[i], 0, { alpha: 0 });
        }
        //
		// if( items[i].getAttribute('data-animate-in-delay') ) {
		// 	d = items[i].getAttribute('data-animate-in-delay') / 1000 + 's';
		// } else {
		// 	d = 0;
		// }
        // el.style.transitionDelay = d;
	}

    setTimeout(function(){
        detect();
    }, 500);
}





// ---------------------------------------------------------------------
// Detect when an element is in the viewport
// ---------------------------------------------------------------------

function lines() {
    if(document.getElementById('draw-svg')) {

        var svg = document.getElementById('draw-svg'),
            //line = document.getElementById('draw-svg-line'),
            arrow = document.getElementById('draw-svg-arrow');

        arrow.onclick = function() {
            TweenLite.to(window, 1, {scrollTo:"#how-it-works"});
        }

        //TweenMax.to(line, 0, {alpha:0});



        // var orig = line, length, timer;
        // var timing = 2;
        //
        // var obj = {
        //     length: 0,
        //     pathLength: orig.getTotalLength()
        // }

        // TweenMax.to(line, 0.4, {alpha:.2}).delay(1);
        // var t = TweenMax.to(obj, timing, {length:obj.pathLength, onUpdate:drawLine, ease:Linear.easeInOut}).delay(1);
        //
        // function drawLine() {
        //     orig.style.strokeDasharray = [obj.length,obj.pathLength].join(' ');
        // }

        TweenMax.to(arrow, 0, { scale:0.4, alpha: 0, transformOrigin:"50% 50%" });

        var scaleW = 1;

        if( window.innerWidth < 600) {
            scaleW = 1;
        }
        TweenMax.to(arrow, .4, {alpha: 1, ease: Power0.easeNone }).delay(.8);
        TweenMax.to(arrow, 3, { scale:scaleW, ease: Elastic.easeOut.config(1, 0.3) }).delay(.8);

        function resizeArrow() {
            var scaleW = 1;

            if( window.innerWidth < 600) {
                scaleW = 1;
            }
            TweenMax.to(arrow, 1, { scale:scaleW, ease: Elastic.easeOut.config(1, 0.3) });
        }

        window.addEventListener('resize', resizeArrow);

    }


    if (document.getElementById('js-draggable')){
        var panel = document.getElementById('js-draggable'),
            currentScroll = panel.scrollLeft;

        panel.onmousedown = function(event) {

            //console.log('Mouse down on element');
            var par = this;
            par.classList.add('dragging');
            mouseStart = event.clientX;
            currentScrollPos =  par.scrollLeft;

            document.onmousemove = function(event) {
                par.classList.add('moving');
                amountMoved = -(event.clientX - mouseStart);
                scrollAmount = (currentScrollPos + amountMoved);

                finalScroll = scrollAmount * 1;
                timing = 0.6;

                if( finalScroll >= (par.scrollWidth - window.innerWidth) ) {
                    finalScroll = par.scrollWidth - window.innerWidth;
                    timing = 0;
                }

                TweenMax.to(par, timing, {scrollLeft: finalScroll, ease: Circ.ease });


            }

            panel.onmouseout = function(event) {
                document.onmousemove = '';
                this.classList.remove('moving');
                this.classList.remove('dragging');
            }

        }

        panel.onmouseup = function(event) {
            document.onmousemove = '';
            this.classList.remove('moving');
            this.classList.remove('dragging');
        }
    }

}


// ---------------------------------------------------------------------
// Detect when an element is in the viewport
// ---------------------------------------------------------------------

function homepage() {
    if(document.getElementById('scroll-wrap-right')) {

        var right = document.getElementById('scroll-wrap-right');
        var left = document.getElementById('scroll-wrap-left');
        var scrollWrap = document.getElementById('js-draggable-home');
        var xPos = 0;

        right.onclick = function() {
            if(xPos < 60) {
                right.classList.remove('disabled');
                xPos = xPos + 33.3333;
                xPos = xPos;

        		TweenMax.to(scrollWrap, .8, { x: '-' + xPos + '%', ease: Elastic.easeOut.config(1, 0.7) });
                if(xPos > 60) {
                    right.classList.add('disabled');
                }
            } else {
                right.classList.add('disabled');
            }

            if(xPos >= 33) {
                left.classList.remove('disabled');
            }
        }

        left.onclick = function() {
            if(xPos >= 33) {
                left.classList.remove('disabled');
                xPos = xPos - 33.3333;
                xPos = xPos;
        		TweenMax.to(scrollWrap, .8, { x: '-' + xPos + '%', ease: Elastic.easeOut.config(1, 0.7) });

                if(xPos > 60) {
                    left.classList.add('disabled');
                }
            } else {
                left.classList.add('disabled');
            }

            if(xPos < 60) {
                right.classList.remove('disabled');
            }

            if(xPos < 33) {
                left.classList.add('disabled');
            }
        }


        function resetScroll() {
            xPos = 0;
            left.classList.add('disabled');
            right.classList.remove('disabled');
            TweenMax.to(scrollWrap, 0, { x: 0 + '%', ease: Elastic.easeOut.config(1, 0.7) });
        }

        window.addEventListener('resize', resetScroll);
    }



}


})();
