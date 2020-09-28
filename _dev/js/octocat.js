// ---------------------------------------------------------------------
// Global JavaScript
// Authors: Andrew Ross
// ---------------------------------------------------------------------

var andrewrossco = andrewrossco || {};

(function(APP) {

    if( document.getElementById('artboard') ){
        var artboard = document.getElementById('artboard'),
            generator = document.getElementById('octocat-generator'),
            octocat = document.getElementById('octocat');

        function setHeights() {
            // artboard height

            if( window.innerWidth < 800 ) {
                ah = window.innerHeight - (document.getElementById('site-header').offsetHeight + document.getElementById('object-nav').offsetHeight);
            } else {
                ah = window.innerHeight - document.getElementById('ui-wrapper').offsetHeight - document.getElementById('site-header').offsetHeight;
            }

            // generator height (window height minus header)
            gh = window.innerHeight - document.getElementById('site-header').offsetHeight;

            if(document.body.classList.contains('kiosk')){
                artboard.style.height = (ah - 12) + 'px';
            } else {
                artboard.style.height = (ah - 12) + 'px';
            }

            // at least 400px tall
            if(gh < 400) {
                generator.style.height = '400px';
            } else {
                generator.style.height = gh + 'px';
            }

            if( !generator.classList.contains('is-ready') ) {
                setTimeout(function(){
                    generator.classList.add('is-ready');
                }, 200);
            }

            var puddleRec = document.getElementById('Puddle').getBoundingClientRect(),
                bgArea = document.getElementById('bg-area');
            bgArea.style.height = (puddleRec.top - (puddleRec.height * 2)) + 'px';


        }
        setHeights();

        window.addEventListener("resize", function() {
            setHeights();
        });

        // In-activity timer for kiosk
        var inactivityTime = function () {
            window.onload = resetTimer;
            document.onmousemove = resetTimer;
            document.onkeypress = resetTimer;
        };

        var t;
        inactivityTime();
        var warningTimer = 50000 * 5; // 1 minute * x

        function resetTimer() {
            if(document.body.classList.contains('kiosk')) {
                clearTimeout(t);
                t = setTimeout(warning, warningTimer);
            }
        }
        function logout() {
            window.location.reload();
        }
        function warning() {
            document.getElementById('timeout-modal').classList.add('is-active');
            t = setTimeout(logout, 10000);
        }

        document.getElementById('timeout-modal-close').onclick = function(e) {
            e.preventDefault();
            document.getElementById('timeout-modal').classList.remove('is-active');
            resetTimer();
        }

        document.querySelector('#timeout-modal .screen').onclick = function(e) {
            e.preventDefault();
            document.getElementById('timeout-modal').classList.remove('is-active');
            resetTimer();
        }



        ///////////////////////// Control Panel /////////////////////////
        var cp = document.getElementById('control-panel'),
            ears = document.getElementById('ears'),
            category = cp.querySelectorAll('.category-tile'),
            categoryPanel = document.querySelectorAll('.object-panel-wrap');

        function clearActive() {
            for(var i = 0; i < category.length; i++) {
                category[i].classList.remove('is-active');
            }
            for(var p = 0; p < categoryPanel.length; p++) {
                categoryPanel[p].classList.remove('is-active');
            }
        }

        for(var i = 0; i < category.length; i++) {
            var el = category[i];

            el.onclick = function() {
                resetTimer();
                if( this.classList.contains('is-active') ) {
                    clearActive();
                    return
                } else {
                    clearActive();
                    this.classList.add('is-active');
                    target = this.getAttribute('data-target');
                    target = document.getElementById(target);
                    target.classList.add('is-active');

                    checkPanelWidth();
                }
            }
        }


        ///////////////////////// Body Color /////////////////////////
        var bodyColor = document.getElementById('body-color'),
            bodyColorSwatches = bodyColor.querySelectorAll('.color-swatch');

        for(var i = 0; i < bodyColorSwatches.length; i++) {
            var el = bodyColorSwatches[i];
            bgColor = el.getAttribute('data-color');
            secondColor = el.getAttribute('data-second-color');

            //el.style.background = bgColor;
            el.style.color = bgColor;

            el.onclick = function() {
                for(var cs = 0; cs < bodyColorSwatches.length; cs++) {
                    bodyColorSwatches[cs].parentNode.classList.remove('is-active');
                }
                this.parentNode.classList.add('is-active');

                mainColor = this.getAttribute('data-color');
                secondColor = this.getAttribute('data-second-color');
                thirdColor = this.getAttribute('data-third-color');

                octocat.setAttribute('body-color', mainColor);
                octocat.setAttribute('body-color-secondary', secondColor);
                octocat.setAttribute('body-color-teriary', thirdColor);
                colorCheck();
                mostRecent(this);
            }
        }
        // Set prop color classes
        var propObjects = document.querySelectorAll('.object.props [fill="#282828"], .object.headgear [fill="#282828"]');
        for(var i = 0; i < propObjects.length; i++) {
            propObjects[i].classList.add('main-body-fill');
        }
        // Set prop color classes
        propSecondObjects = document.querySelectorAll('.object.props [fill="#494949"]');
        for(var i = 0; i < propSecondObjects.length; i++) {
            propSecondObjects[i].classList.add('secondary-body-fill');
        }


        ///////////////////////// Face Color /////////////////////////
        var faceColor = document.getElementById('face-color'),
            colorSwatches = faceColor.querySelectorAll('.color-swatch');

        for(var i = 0; i < colorSwatches.length; i++) {
            var el = colorSwatches[i];
            bgColor = el.getAttribute('data-color');
            el.style.color = bgColor;

            el.onclick = function() {
                for(var cs = 0; cs < colorSwatches.length; cs++) {
                    colorSwatches[cs].parentNode.classList.remove('is-active');
                }
                this.parentNode.classList.add('is-active');

                bgColor = this.getAttribute('data-color');
                accentColor = this.getAttribute('data-color-nose');
                octocat.setAttribute('body-color-accent', accentColor);

                var currentBodyColor = artboard.querySelectorAll('.face-fill-color');
                for(var k = 0; k < currentBodyColor.length; k++) {
                    currentBodyColor[k].setAttribute('fill', bgColor);
                }
                colorCheck();
                mostRecent(this);
            }
        }


        ///////////////////////// Eye Color /////////////////////////
        var eyeColor = document.getElementById('eye-color'),
            eyeColorSwatches = eyeColor.querySelectorAll('.color-swatch');

        for(var i = 0; i < eyeColorSwatches.length; i++) {
            var el = eyeColorSwatches[i];
            bgColor = el.getAttribute('data-color');

            //el.style.background = bgColor;
            el.style.color = bgColor;

            el.onclick = function() {
                for(var cs = 0; cs < eyeColorSwatches.length; cs++) {
                    eyeColorSwatches[cs].parentNode.classList.remove('is-active');
                }
                this.parentNode.classList.add('is-active');
                bgColor = this.getAttribute('data-color');
                octocat.setAttribute('eye-color', bgColor);

                colorCheck();
                mostRecent(this);
            }
        }

        // Eye Accent Color
        var eyeObjects = document.querySelectorAll('.object.eyes [fill="#A34F3E"]');
        for(var i = 0; i < eyeObjects.length; i++) {
            eyeObjects[i].classList.add('eye-fill-color');
        }

        // Eye Accent Color
        var eyeAccentObjects = document.querySelectorAll('.object.eyes [fill="#8D5548"], .object.eyes [fill="#8d5548"]');
        for(var i = 0; i < eyeAccentObjects.length; i++) {
            eyeAccentObjects[i].classList.add('face-accent-fill-color');
        }

        ///////////////////////// Hair Color /////////////////////////
        var hairColor = document.getElementById('hair-color'),
            hairColorSwatches = hairColor.querySelectorAll('.color-swatch');

        for(var i = 0; i < hairColorSwatches.length; i++) {
            var el = hairColorSwatches[i];
            bgColor = el.getAttribute('data-color');
            el.style.color = bgColor;

            el.onclick = function() {
                for(var cs = 0; cs < hairColorSwatches.length; cs++) {
                    hairColorSwatches[cs].parentNode.classList.remove('is-active');
                }
                this.parentNode.classList.add('is-active');
                bgColor = this.getAttribute('data-color');
                octocat.setAttribute('hair-color', bgColor);
                colorCheck();
                mostRecent(this);
            }
        }
        // Set hair color classes
        var hairObjects = document.querySelectorAll('.object.hair [fill="#9F592A"]');
        for(var i = 0; i < hairObjects.length; i++) {
            hairObjects[i].classList.add('hair-color');
        }

        ///////////////////////// Facial Hair Color /////////////////////////
        var facehairColor = document.getElementById('facehair-color'),
            facehairColorSwatches = facehairColor.querySelectorAll('.color-swatch');

        for(var i = 0; i < facehairColorSwatches.length; i++) {
            var el = facehairColorSwatches[i];
            bgColor = el.getAttribute('data-color');
            el.style.color = bgColor;

            el.onclick = function() {
                for(var cs = 0; cs < facehairColorSwatches.length; cs++) {
                    facehairColorSwatches[cs].parentNode.classList.remove('is-active');
                }
                this.parentNode.classList.add('is-active');
                bgColor = this.getAttribute('data-color');
                octocat.setAttribute('face-hair-color', bgColor);
                colorCheck();
                mostRecent(this);
            }
        }
        // Set hair color classes
        var faceHairObjects = document.querySelectorAll('.object.faceHair [fill="#9F592A"]');
        for(var i = 0; i < faceHairObjects.length; i++) {
            faceHairObjects[i].classList.add('faceHair-color');
        }

        var hideEars = 0;
        var hideHeadgear = 0;
        var hideHand = 0;

        // ---------------------------------------------------------------------
        //  Add Object Controller
        // ---------------------------------------------------------------------

        var obj = cp.querySelectorAll('.object-preview');

        for(var i = 0; i < obj.length; i++) {
            var el = obj[i];

            el.onclick = function() {
                resetTimer();
                var cat = this.getAttribute('data-category'),
                    currCatCP = document.getElementById('cp-' + cat ),
                    currActive = currCatCP.querySelectorAll('.object-preview');



                if(cat == 'misc') {
                    var elClass = this.getAttribute('id');

                    if( this.classList.contains('is-active') ){
                        artboard.querySelector('.' + elClass).remove();
                        cp.querySelector('#' + elClass).classList.remove('is-active');
                        return;
                    }
                } else {

                    //Check if item is Active
                    if( this.classList.contains('is-active') ){
                        var removeBtn = currCatCP.querySelector('.remove-category[data-category=' + cat + ']');
                        if(removeBtn){
                            removeBtn.click();
                        }
                        mostRecent(this);
                        return;
                    }

                    // Assign Active Class in Control Panel
                    for(var t = 0; t < currActive.length; t++) {
                       currActive[t].classList.remove('is-active');
                    }

                    // Empty object holder incase anything is left behind
                    var objectHolder = artboard.querySelectorAll('[data-cat=' + cat + ']');
                    var ohKids = objectHolder.children;

                    for(var i = 0; i < objectHolder.length; i++) {
                        var h = objectHolder[i];

                        if ( h.classList.contains('hide-hand') ) {
                            h.classList.remove('hide-hand');
                            hideHand--;
                        }
                        h.innerHTML = '';
                    }

                }

                this.classList.add('is-active');

                var elClasses = this.getAttribute('data-classes').split(',');

                ////////// Add the element to artboard
                //Get asset objects
                var svgObjs = this.querySelectorAll('.object');

                for(var i = 0; i < svgObjs.length; i++) {
                    obj = svgObjs[i];

                    // get associated holder within the octocat svg
                    holderCat = obj.getAttribute('data-holder');
                    holder = document.getElementById(holderCat);

                    holder.classList = '';

                    if(elClasses.length > 0){
                        for(var c = 0; c < elClasses.length; c++) {
                            if(elClasses[c].length){
                                holder.classList.add(elClasses[c]);
                            }
                        }
                    }

                    if(cat == 'hair') {
                        if ( obj.classList.contains('big-hair') ) {
                            cp.classList.add('big-hair');
                        } else {
                            cp.classList.remove('big-hair');
                        }

                        if ( obj.classList.contains('medium-hair') ) {
                            cp.classList.add('medium-hair');
                        } else {
                            cp.classList.remove('medium-hair');
                        }

                        if ( obj.classList.contains('hair') ) {
                            cp.classList.add('hair');
                        } else {
                            cp.classList.remove('hair');
                        }
                    }

                    if(cat == 'headgear') {
                        if ( obj.classList.contains('no-big-hair') ) {
                            octocat.classList.add('no-big-hair');
                            cp.classList.add('no-big-hair');
                        } else {
                            octocat.classList.remove('no-big-hair');
                            cp.classList.remove('no-big-hair');
                        }

                        if ( obj.classList.contains('no-medium-hair') ) {
                            octocat.classList.add('no-medium-hair');
                            cp.classList.add('no-medium-hair');
                        } else {
                            octocat.classList.remove('no-medium-hair');
                            cp.classList.remove('no-medium-hair');
                        }

                        if ( obj.classList.contains('no-hair') ) {
                            octocat.classList.add('no-hair');
                            cp.classList.add('no-hair');
                        } else {
                            octocat.classList.remove('no-hair');
                            cp.classList.remove('no-hair');
                        }

                        if ( obj.classList.contains('hide-ears') ) {
                            octocat.classList.add('hide-ears');
                        } else {
                            octocat.classList.remove('hide-ears');
                        }

                        if ( obj.classList.contains('hide-whiskers') ) {
                            octocat.classList.add('hide-whiskers');
                            cp.classList.add('hide-whiskers');
                        } else {
                            octocat.classList.remove('hide-whiskers');
                            cp.classList.remove('hide-whiskers');
                        }

                        if ( obj.classList.contains('hide-low-facehair') ) {
                            octocat.classList.add('hide-low-facehair');
                        } else {
                            octocat.classList.remove('hide-low-facehair');
                        }

                        if ( obj.classList.contains('no-big-collars') ) {
                            octocat.classList.add('no-big-collars');
                            cp.classList.add('no-big-collars');
                        } else {
                            octocat.classList.remove('no-big-collars');
                            cp.classList.remove('no-big-collars');
                        }
                    }

                    if(cat == 'mouths') {
                        if ( obj.classList.contains('no-back-facialhair') ) {
                            octocat.classList.add('no-back-facialhair');
                            cp.classList.add('no-back-facialhair');
                        } else {
                            octocat.classList.remove('no-back-facialhair');
                            cp.classList.remove('no-back-facialhair');
                        }
                    }

                    if(cat == 'tops') {
                        if ( obj.classList.contains('no-pants') ) {
                            octocat.classList.add('no-pants');
                            cp.classList.add('no-pants');

                            holder.classList.add('disable-pants');
                        } else {
                            octocat.classList.remove('no-pants');
                            cp.classList.remove('no-pants');
                            holder.classList.remove('disable-pants');
                        }

                        if ( obj.classList.contains('no-xl-pants') ) {
                            octocat.classList.add('no-xl-pants');
                            cp.classList.add('no-xl-pants');
                        } else {
                            octocat.classList.remove('no-xl-pants');
                            cp.classList.remove('no-xl-pants');
                        }

                        if ( obj.classList.contains('no-xxl-pants') ) {
                            octocat.classList.add('no-xxl-pants');
                            cp.classList.add('no-xxl-pants');
                        } else {
                            octocat.classList.remove('no-xxl-pants');
                            cp.classList.remove('no-xxl-pants');
                        }

                        if ( obj.classList.contains('no-shorts') ) {
                            octocat.classList.add('no-shorts');
                            cp.classList.add('no-shorts');
                        } else {
                            octocat.classList.remove('no-shorts');
                            cp.classList.remove('no-shorts');
                        }

                        if ( obj.classList.contains('big-collar') ) {
                            holder.classList.add('big-collar');
                        } else {
                            holder.classList.remove('big-collar');
                        }
                    }

                    if(cat == 'bottoms') {
                        cp.classList.add('bottoms');

                        if ( obj.classList.contains('xl-pants') ) {
                            holder.classList.add('xl-pants');
                            cp.classList.add('xl-pants');
                        } else {
                            holder.classList.remove('xl-pants');
                            cp.classList.remove('xl-pants');
                        }

                        if ( obj.classList.contains('xxl-pants') ) {
                            holder.classList.add('xxl-pants');
                            cp.classList.add('xxl-pants');
                        } else {
                            holder.classList.remove('xxl-pants');
                            cp.classList.remove('xxl-pants');
                        }
                    }

                    if(cat == 'faceHair') {
                        if ( obj.classList.contains('back-facial-hair') ) {
                            cp.classList.add('back-facial-hair');
                        } else {
                            cp.classList.remove('back-facial-hair');
                        }
                    }

                    if ( obj.classList.contains('hide-hand') ) {
                        holder.classList.add('hide-hand');
                        hideHand++;
                    }

                    var svg = obj.querySelectorAll('svg > g');
                    for(var s = 0; s < svg.length; s++) {
                        var s = svg[s];
                        if(cat == 'misc') {
                            s.classList.add(elClass);
                        }
                        // Clone Objects
                        var gClone = s.cloneNode(true);
                        holder.append(gClone);
                    }
                }

                handCheck(hideHand);
                colorCheck();
                mostRecent(this);
            }
        }

        // ---------------------------------------------------------------------
        //  Remove Object Controller
        // ---------------------------------------------------------------------

        var removeObj = cp.querySelectorAll('.remove-category');

        for(var i = 0; i < removeObj.length; i++) {
            var el = removeObj[i];

            el.onclick = function() {
                resetTimer();
                var cat = this.getAttribute('data-category'),
                    currCatCP = document.getElementById('cp-' + cat ),
                    currActive = currCatCP.querySelectorAll('.object-preview');

                // Assign Active Class in Control Panel
                for(var t = 0; t < currActive.length; t++) {
                   currActive[t].classList.remove('is-active');
                }
                this.classList.add('is-active');

                // Empty object holder incase anything is left behind
                var objectHolder = artboard.querySelectorAll('[data-cat=' + cat + ']');
                var ohKids = objectHolder.children;

                for(var i = 0; i < objectHolder.length; i++) {
                    var h = objectHolder[i];

                    // Remove Rules
                    if(cat == 'headgear') {
                        octocat.classList.remove('no-medium-hair');
                        octocat.classList.remove('no-big-hair');
                        octocat.classList.remove('no-hair');
                        octocat.classList.remove('no-big-collars');
                        octocat.classList.remove('hide-whiskers');
                        octocat.classList.remove('hide-low-facehair');
                        octocat.classList.remove('hide-ears');

                        cp.classList.remove('no-medium-hair');
                        cp.classList.remove('no-big-hair');
                        cp.classList.remove('no-hair');
                        cp.classList.remove('no-big-collars');
                        cp.classList.remove('hide-whiskers');
                        cp.classList.remove('hide-ears');
                    }

                    if(cat == 'hair') {
                        document.getElementById('hair-holder').classList = '';
                        cp.classList.remove('hair');
                        cp.classList.remove('big-hair');
                    }

                    if(cat == 'tops') {
                        octocat.classList.remove('no-pants');
                        cp.classList.remove('no-pants');
                        cp.classList.remove('no-xl-pants');
                        cp.classList.remove('no-xxl-pants');
                        document.getElementById('tops-holder').classList = '';
                        document.getElementById('bottoms-preview').classList.remove('disabled');
                    }
                    if(cat == 'bottoms') {
                        cp.classList.remove('bottoms');
                        cp.classList.remove('xl-pants');
                        cp.classList.remove('xxl-pants');

                    }

                    if(cat == 'faceHair') {
                        cp.classList.remove('back-facial-hair');
                    }

                    if ( h.classList.contains('hide-hand') ) {
                        h.classList.remove('hide-hand');
                        hideHand--;
                    }
                    h.innerHTML = '';
                }
                handCheck(hideHand);
            }
        }

        var handCloned = false;
        var handClone = hand.innerHTML;

        function handCheck(count){
            var hand = document.getElementById('hand');
            if(count == 0) {
                octocat.classList.remove('hide-hand');
                hand.innerHTML = handClone;
                colorCheck();
            } else {
                octocat.classList.add('hide-hand');
                hand.innerHTML = '';
            }
        }

        function colorCheck() {
            // Primary Body Color
            var cbc = octocat.getAttribute('body-color');
            var bc = document.querySelectorAll('.main-body-fill');
            for(var ai = 0; ai < bc.length; ai++) {
                bc[ai].setAttribute('fill', cbc);
            }
            // Secondary Body Color
            var cbcs = octocat.getAttribute('body-color-secondary');
            var sbc = document.querySelectorAll('.secondary-body-fill');
            for(var ai = 0; ai < sbc.length; ai++) {
                sbc[ai].setAttribute('fill', cbcs);
            }


            // Teriary Body Color (Suction Cups)
            var cbct = octocat.getAttribute('body-color-teriary');
            var tbc = document.querySelectorAll('.teriary-body-fill');
            for(var ai = 0; ai < tbc.length; ai++) {
                tbc[ai].setAttribute('fill', cbct);
            }

            // Accent Colors
            var cac = artboard.querySelectorAll('.face-accent-fill-color');
            var ac = octocat.getAttribute('body-color-accent');
            for(var k = 0; k < cac.length; k++) {
                cac[k].setAttribute('fill', ac);
            }

            // Eye Color
            var cec = artboard.querySelectorAll('.eye-fill-color');
            var ec = octocat.getAttribute('eye-color');
            for(var k = 0; k < cec.length; k++) {
                cec[k].setAttribute('fill', ec);
            }

            // Hair Color
            var hc = octocat.getAttribute('hair-color');
            var hcc = document.querySelectorAll('.hair-color');
            for(var ai = 0; ai < hcc.length; ai++) {
                hcc[ai].setAttribute('fill', hc);
            }

            // Face Hair Color
            var fhc = document.querySelectorAll('.faceHair-color');
            for(var ai = 0; ai < fhc.length; ai++) {
                fhc[ai].setAttribute('fill', octocat.getAttribute('face-hair-color'));
            }
        }



        // ---------------------------------------------------------------------
        //  Panel Movement Controller
        // ---------------------------------------------------------------------

        var catPanel = document.querySelectorAll('.object-panel, .category-panel'),
            scrollDist = 350;

        function checkPanelWidth() {
            for(var i = 0; i < catPanel.length; i++) {
                var panel = catPanel[i],
                    scrollDown = panel.parentNode.getElementsByClassName('scroll-down')[0],
                    scrollUp = panel.parentNode.getElementsByClassName('scroll-up')[0];

                if( panel.scrollHeight > panel.offsetHeight ) {
                    scrollDown.classList.remove('disabled');
                }
            }
        }

        for(var i = 0; i < catPanel.length; i++) {
            var panel = catPanel[i],
                scrollDown = panel.getElementsByClassName('scroll-down')[0],
                scrollUp = panel.getElementsByClassName('scroll-up')[0],
                currentScroll = panel.scrollUp;

            function checkPos(el) {
                ml = window.getComputedStyle(el);
                addMargins = parseInt(ml.marginTop, 10) * 2;
                scrollDown = el.parentNode.getElementsByClassName('scroll-down')[0],
                scrollUp = el.parentNode.getElementsByClassName('scroll-up')[0];
                curScroll = el.scrollTop + el.offsetHeight;

                if( curScroll >= el.scrollHeight) {
                    scrollDown.classList.add('disabled');

                } else {
                    scrollDown.classList.remove('disabled');
                }

                if ( el.scrollTop <= 40) {
                    scrollUp.classList.add('disabled');
                } else {
                    scrollUp.classList.remove('disabled');
                }
            }


            scrollDown.onclick = function() {
                var par = this.parentNode.children[0];
                scrollDist = 350;

                currentScroll = par.scrollTop;
                //console.log("cur scroll = " + currentScroll);
                currentScroll = currentScroll + scrollDist;

                //var tl = new TimelineMax({ onComplete: checkPosition }}) ;

                TweenMax.to(par, 0.7, {scrollTop: currentScroll, ease: Circ.ease});

                checkPos(par);

                resetTimer();

                console.log('asdfsdf');
            }


            scrollUp.onclick = function() {
                var par = this.parentNode.children[0];
                scrollDist = 350;

                currentScroll = par.scrollTop;
                //console.log("cur scroll = " + currentScroll);

                currentScroll = currentScroll - scrollDist;
                TweenMax.to(par, 0.7, {scrollTop: currentScroll, ease: Circ.ease });
                checkPos(par);
                resetTimer();
            }


            panel.onmouseleave = function() {
                //currentScroll = this.scrollTop;
                //this.children[0].classList.add('asfasfasfasf');
                checkPos(this.children[0]);
            }

            panel.onmousedown = function(event) {
                var par = this;
                resetTimer();
                mouseStart = event.clientX;
                currentScrollPos =  par.scrollTop;

                document.onmouseover = function(event) {
                    par.classList.add('moving');
                    amountMoved = -(event.clientX - mouseStart);
                    scrollAmount = currentScrollPos + amountMoved;
                    TweenMax.to(par, 0.3, {scrollTop: scrollAmount, ease: Circ.ease });
                }
                panel.onmouseout = function(event) {
                    document.onmouseover = '';
                    this.classList.remove('moving');
                }
            }

            panel.onmouseup = function(event) {
                document.onmouseover = '';
                this.classList.remove('moving');
            }
        }



        // ---------------------------------------------------------------------
        //  Start Over
        // ---------------------------------------------------------------------


        var reset = document.getElementById('start-over'),
            icon = reset.querySelector('img'),
            resetModal = document.getElementById('reset-modal'),
            cookieInput = document.getElementById('reset-message');

        localStorage.removeItem('quickReset');

        reset.onclick = function() {
            if( localStorage.getItem('quickReset') ) {
                window.location.reload();
            } else {
                resetModal.classList.add('is-active');
                document.body.classList.add('modal-is-active');
            }
        }

        document.getElementById('reset').onclick = function(e) {
            e.preventDefault();
            window.location.reload();
        }


        function mostRecent(newEl) {
            var cur = document.querySelector('.most-recent');

            if( cur ){
                var par = cur.parentNode.parentNode,
                    lastItem = par.querySelector('.last-item');

                if( lastItem ) {
                    lastItem.classList.remove('last-item');
                }

                cur.classList.add('last-item');
                cur.classList.remove('most-recent');
            }

            if(cur == newEl) {
                newEl.classList.add('last-item');
                newEl.classList.add('most-recent');
            } else {
                newEl.classList.remove('last-item');
                newEl.classList.add('most-recent');
            }
        }

        var undo = document.getElementById('undo');
        undo.onclick = function() {
            var cur = document.querySelector('.most-recent');
            if(cur){
                var par = cur.parentNode.parentNode,
                lc = par.querySelector('.last-item');

                if( lc ){
                    lc.click();
                } else {
                    cur.click();
                }
            }
        }

        var random = document.getElementById('radomize'),
            misc = 0;

        random.onclick = function() {
            document.getElementById('rand-clear-misc').click();

            // Colors
            var colorGroup = document.querySelectorAll('.object-panel__colors .object-panel__inner');
            for(var i = 0; i < colorGroup.length; i++) {
                var objects = colorGroup[i].querySelectorAll('.color-swatch'),
                    item = objects[Math.floor(Math.random()*objects.length)];
                item.click();
            }

            // Objects
            var objectGroup = document.querySelectorAll('.object-panel__objects .object-panel__inner');
            for(var i = 0; i < objectGroup.length; i++) {
                var objects = objectGroup[i].querySelectorAll('.object-preview, .remove-category'),
                    item = objects[Math.floor(Math.random()*objects.length)];

                if( item.getAttribute('data-category') === 'misc' ) {
                    objects[Math.floor(Math.random()*objects.length)].click();
                    objects[Math.floor(Math.random()*objects.length)].click();
                    objects[Math.floor(Math.random()*objects.length)].click();
                } else {
                    item.click();
                }
            }
        }

        // Virtual Keyboard
        if( document.body.classList.contains('kiosk') ){

            document.getElementById('terms-link').onclick = function(e) {
                e.preventDefault();
                document.getElementById('terms-modal').classList.add('is-active');
            }
            document.getElementById('close-terms-link').onclick = function(e) {
                e.preventDefault();
                document.getElementById('terms-modal').classList.remove('is-active');
            }

            function checkKeyboard() {
                setTimeout(function(){
                    if( document.getElementById('virtualKeyboardChromeExtension').getAttribute('_state') == 'open' ) {
                        document.getElementById('export-modal').style.height = '60%';
                        console.log('Keyboard Open');
                    } else {
                        document.getElementById('export-modal').style.height = '100%';
                        console.log('Keyboard Closed');
                    }
                }, 1000);
            }

            var keyboardtrigger = document.getElementById('form-email');
            keyboardtrigger.addEventListener('focus', function () {
                document.getElementById('export-modal').style.height = '60%';
            });
            keyboardtrigger.addEventListener('focusout', function () {
                checkKeyboard();
            });

            // var printNameTrigger = document.getElementById('print-form-name');
            // printNameTrigger.addEventListener('focus', function () {
            //     document.getElementById('export-modal').style.height = '60%';
            // });
            // printNameTrigger.addEventListener('focusout', function () {
            //     checkKeyboard();
            // });
            // var printEmailTrigger = document.getElementById('print-form-email');
            // printEmailTrigger.addEventListener('focus', function () {
            //     document.getElementById('export-modal').style.height = '60%';
            // });
            // printEmailTrigger.addEventListener('focusout', function () {
            //     checkKeyboard();
            // });

        }


        // document.getElementById('reset').onclick = function(e) {
        //     e.preventDefault();
        //     if( cookieInput.checked ) {
        //         localStorage.setItem('quickReset', true);
        //         window.location.reload();
        //     } else {
        //         window.location.reload();
        //     }
        // }

        document.getElementById('close-reset-modal').onclick = function(e) {
            e.preventDefault();
            resetModal.classList.remove('is-active');
            document.body.classList.remove('modal-is-active');
        }

        resetModal.querySelector('.screen').onclick = function() {
            resetModal.classList.remove('is-active');
            document.body.classList.remove('modal-is-active');
        }

        // reset.addEventListener("mouseover", function( event ) {
        //     TweenMax.to(icon, 0.8, {rotation: -360, transformOrigin:"50% 50%", ease:  Power4.easeOut });
        // });
        //
        // reset.addEventListener("mouseout", function( event ) {
        //     TweenMax.to(icon, 0, {rotation: 0});
        // });

        document.getElementById('create-another').onclick = function(e) {
            e.preventDefault();
            window.location.reload();
        };

        // var finish = document.getElementById('save'),
        //     fIcon = finish.querySelector('img');
        //
        // finish.addEventListener("mouseover", function( event ) {
        //     TweenMax.to(fIcon, 0.8, {x: 4, ease:  Power4.easeOut });
        // });
        // finish.addEventListener("mouseout", function( event ) {
        //     TweenMax.to(fIcon, 0.8, {x: 0, ease:  Power4.easeOut });
        // });






        // ---------------------------------------------------------------------
        //  UI
        // ---------------------------------------------------------------------



    }
}(andrewrossco));
