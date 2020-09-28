(function () {
    "use strict";
    if (document.getElementById('save')) {
        var save = document.getElementById('save'),
            download = document.getElementById('download-octocat'),
            twitter = document.getElementById('twitter-submit'),
            emailTrigger = document.getElementById('email-trigger'),
            printTrigger = document.getElementById('print-trigger'),
            post = document.getElementById('email-submit'),
            octocat = document.getElementById('octocat'),
            exportModal = document.getElementById('export-modal'),
            whiskers = document.getElementById('whiskers').innerHTML,
            ears = '';

        save.onclick = function() {
            // Remove Unused objects from the artboard

            if(octocat.classList.contains('hide-ears')) {
                if(octocat.querySelector('#ears')){
                    ears = octocat.querySelector('#ears').innerHTML;
                    octocat.querySelector('#ears').innerHTML = '';
                    exportModal.classList.add('add-ears');
                }
            }

            if(octocat.classList.contains('no-big-hair')) {
                var bigHair = octocat.querySelectorAll('g.big-hair');
                for(var i = 0; i < bigHair.length; i++) {
                    bigHair[i].innerHTML = '';

                    if ( getComputedStyle(bigHair[i], null).display == 'none' ) {
                        bigHair[i].innerHTML = '';
                    }
                }


                var maskHair = octocat.querySelectorAll('g.hair #Original');
                for(var i = 0; i < maskHair.length; i++) {

                    if ( getComputedStyle(maskHair[i], null).display == 'none' ) {
                        maskHair[i].innerHTML = '';
                    }

                    //console.log( getComputedStyle(maskHair[i], null).display );
                }
            }

            if(octocat.classList.contains('no-medium-hair')) {
                if(octocat.querySelector('g.medium-hair')){
                    octocat.querySelector('g.medium-hair').innerHTML = '';
                }
            }
            if(octocat.classList.contains('no-hair')) {
                document.getElementById('hair-back-holder').innerHTML = '';
                document.getElementById('hair-holder').innerHTML = '';
                document.getElementById('hair-front-holder').innerHTML = '';
                //console.log('remove hair');
            }

            if(octocat.classList.contains('no-back-facialhair')) {
                document.getElementById('faceHair-back-holder').innerHTML = '';
            }
            if(octocat.classList.contains('no-pants')) {
                document.getElementById('bottoms-holder').innerHTML = '';
                document.getElementById('bottoms-front-holder').innerHTML = '';
            }

            if(octocat.classList.contains('no-xl-pants')) {
                if(octocat.querySelector('g.xl-pants')){
                    octocat.querySelector('g.xl-pants').innerHTML = '';
                }
            }
            if(octocat.classList.contains('no-xxl-pants')) {
                if(octocat.querySelector('g.xxl-pants')){
                    octocat.querySelector('g.xxl-pants').innerHTML = '';
                }
            }

            if(octocat.classList.contains('no-big-collars')) {
                if(octocat.querySelector('g.big-collar')){
                    octocat.querySelector('g.big-collar').innerHTML = '';
                }
            }

            if(octocat.classList.contains('hide-whiskers')) {
                document.getElementById('whiskers').innerHTML = '';
            }

            if(octocat.classList.contains('hide-low-facehair')) {
                document.getElementById('faceHair-low-holder').innerHTML = '';
            }

            exportModal.classList.add('is-active');
            document.body.classList.add('modal-is-active');
        };

        // Agree to Terms & Conditions
        document.getElementById('terms').onclick = function() {
            if ( this.checked ) {
                post.removeAttribute('disabled');
                twitter.removeAttribute('disabled');
                emailTrigger.removeAttribute('disabled');
                if(download) {
                    download.removeAttribute('disabled');
                }
                if(printTrigger) {
                    printTrigger.removeAttribute('disabled');
                }
            } else {
                post.setAttribute('disabled', '');
                twitter.setAttribute('disabled', '');
                emailTrigger.setAttribute('disabled', '');
                if(download) {
                    download.setAttribute('disabled', '');
                }
                if(printTrigger) {
                    printTrigger.setAttribute('disabled', '');
                }
            }
        };

        exportModal.querySelector('.screen').onclick = function() {
            exportModal.classList = 'modal-wrap';
            document.body.classList.remove('modal-is-active');
        };

        var closeExportModal = exportModal.querySelectorAll('.keep-editing');
        for(var i = 0; i < closeExportModal.length; i++) {
            closeExportModal[i].onclick = function(e) {
                e.preventDefault();
                //console.log(ears);
                if( exportModal.classList.contains('add-ears') ){
                    octocat.querySelector('#ears').innerHTML = ears;
                }
                exportModal.classList = 'modal-wrap';
                document.body.classList.remove('modal-is-active');



                if(octocat.classList.contains('hide-whiskers')) {
                    document.getElementById('whiskers').innerHTML = whiskers;
                }
            };
        }

        exportModal.querySelector('.back-to-options').onclick = function(e) {
            e.preventDefault();
            exportModal.classList.remove('error');
        };


        var svgMaskLoad = document.getElementById('load-svg-mask');

        if(download) {
            download.onclick = function(e) {
                e.preventDefault();
                convert('#artboard', downloadImg, true, false, false);

                setTimeout(function(){
                    console.log('downloaded');
                    exportModal.classList.add('completed');
                    sendToAws(false);
                }, 1000);
            };
        }

        var emailForm = document.getElementById('email-octocat');
        var printForm = document.getElementById('print-octocat');

        if( emailTrigger ) {
            emailTrigger.onclick = function(e) {
                e.preventDefault();
                var emailForm = document.getElementById('email-octocat');
                emailForm.classList.toggle('is-active');
                if(printForm){
                    printForm.classList.remove('is-active');
                }
            };
        }

        if(printTrigger) {
            printTrigger.onclick = function(e) {
                e.preventDefault();
                printForm.classList.toggle('is-active');
                emailForm.classList.remove('is-active');
            };
        }

        if( document.getElementById('print-email-submit') ){
            document.getElementById('print-email-submit').onclick = function(e) {
                e.preventDefault();
                convert('#artboard', sendToAwsPrinter, false, true, false);
            };
        }

        post.onclick = function(e) {
            e.preventDefault();
            convert('#artboard', sendToAws, false, false, true);
        };

        //var loginWindow = window.open('', '_blank');

        var loginWindow;

        twitter.onclick = function(e) {
            e.preventDefault();
            loginWindow = window.open('', "_blank", "width=400,height=400,status=yes,menubar=no,titlebar=no,toolbar=no,location=no");
            convert('#artboard', postToTwitter, false, false, false);
        };



        function convert(selectors, callbackFunction, downloadObject, printObject, emailObject){
            [].forEach.call(document.querySelectorAll(selectors),function(div){
                try{
                    var sourceImage;

                    var img = document.getElementById('img'),
                        svg  = document.getElementById('octocat'),
                        can  = document.getElementById('canvas'),
                        ctx  = can.getContext('2d');

                    //can.style["display"] = "none";
                    can.setAttribute("width", 2000);
                    can.setAttribute("height", 2000);

                    img.src = svgDataURL(svg);
                    var svgData = img.src;
                    sourceImage = new Image;
                    sourceImage.width  = 2000;
                    sourceImage.height = 2000;

                    var filename = "octocat";

                    sourceImage.onload = function(){
                        ctx.fillStyle = "#f6f8fa";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(sourceImage,0,0,2000,2000);

                        if(downloadObject) {
                            img.src = can.toDataURL();
                            var a = document.createElement("a");
                            a.download = filename+".png";
                            a.href = img.src;
                            document.body.appendChild(a);
                            a.click();
                        }

                        if(printObject) {
                            //img.src = can.toDataURL();v
                            // var a = document.createElement("a");
                            // a.download = "print-" + filename+".svg";
                            // a.href = svgData;
                            // document.body.appendChild(a);
                            // a.click();
                            //console.log('For printing');
                        }

                        svgData = new XMLSerializer().serializeToString(document.getElementById("octocat"));
                        var encodedData = window.btoa(svgData);

                        //console.log('Ssvg Data = ' +  encodedData);
                        //console.log('==========');

                        img.src = can.toDataURL();
                        var imgData = img.src;
                        imgData = img.src.split("data:image/png;base64,").pop();

                        //imgData = img.src.split("data:image/png+xml,").pop();

                        document.getElementById('twitter-image').value = imgData;
                        document.getElementById('form-image').value = imgData;

                        // document.getElementById('print-form-image').value = imgData;
                        // document.getElementById('print-form-svg').value = encodedData;

                        //console.log(imgData);

                        //if(emailObject) {
                        callbackFunction();
                        //}

                        document.getElementById('tweetPreviewImg').src = svgDataURL(svg);
                    };

                    sourceImage.src = svg ? svgDataURL(svg) : div.getAttribute('data-svgSource');

                }catch(e){ console.log(e) }
            });
        }

        function binEncode(data) {
            var binArray = [];
            var datEncode = "";

            for (i=0; i < data.length; i++) {
                binArray.push(data[i].charCodeAt(0).toString(2));
            }
            for (j=0; j < binArray.length; j++) {
                var pad = padding_left(binArray[j], '0', 8);
                datEncode += pad + ' ';
            }
            function padding_left(s, c, n) { if (! s || ! c || s.length >= n) {
                return s;
            }
            var max = (n - s.length)/c.length;
            for (var i = 0; i < max; i++) {
                s = c + s; } return s;
            }
            return binArray;
        }

        function postToTwitter() {
            //console.log('Posting image');
            var form = document.getElementById("share-on-twitter");
            var mediab64 = document.getElementById('twitter-image').value;

            TweenMax.to(svgMaskLoad, 10, { scaleY: 0.3, transformOrigin:"top center",ease: Power4.easeOut }).delay(0.4);
            exportModal.classList.add('posting');
            //console.log(window.location.hostname);

            var postUrl = 'https://octocat-generator.herokuapp.com/auth';
            if( window.location.hostname === '127.0.0.1' ) {
                postUrl = 'http://localhost:4000/';
            }
            window.fetch(postUrl, {
                method:'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type':'application/json'
                },
                body:JSON.stringify({ media_id: mediab64 })
            })
            .then((res) => res.json())
            .then((data) => {
                //console.log('el response = ' + JSON.stringify(data.success));
                //console.log('Admin authorized, now authorizing user');
                var herokuToken = data.success.oauth_token;
                var url = 'https://twitter.com/oauth/authenticate?oauth_token=' + herokuToken;
                var callbackUrl = window.location.origin + '/close';
                //var login = window.open(url, "_blank", "width=400,height=400,status=yes");

                loginWindow.location.href = url;

                // Send message to child window and check for twitter tokens
                function childRequest() {
                    var message = 'Checking for tokens...';
                	//console.log('Sending message: ' + message);
                	loginWindow.postMessage(message, callbackUrl); //send the message and target URI
                }
                var credsCheck = setInterval(childRequest, 2000);

                // listen for message back from child window
                window.addEventListener('message',function(event) {
                	//if(event.origin !== '') return;
                	//console.log('Response from child:  ', event.data);
                    if (event.data[0] === herokuToken) {
                        //console.log('Tokens match');
                        clearInterval(credsCheck);
                        loginWindow.close();
                        previewTweet(event.data[0], event.data[1]);
                    } else {
                        clearInterval(credsCheck);
                        loginWindow.close();
                        exportModal.classList.remove('posting');
                        exportModal.classList.add('error');
                    }
                },false);


                function previewTweet(auth, veri) {
                    //console.log("Preview Tweet");

                    exportModal.classList.add('previewing');

                    document.getElementById('tweet').onclick = function(e) {
                        e.preventDefault();
                        var text = document.getElementById('tweet-text').value;
                        callback(auth, veri, text);
                    };
                }


                function callback(auth, veri, text) {

                    exportModal.classList.remove('previewing');

                    var postUrl = 'https://octocat-generator.herokuapp.com/tweet';
                    if( window.location.hostname === '127.0.0.1' ) {
                        postUrl = 'http://localhost:4000/auth';
                    }
                    window.fetch(postUrl, {
                        method:'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-type':'application/json'
                        },
                        body:JSON.stringify({oauth_token: auth, oauth_token_secret: data.success.oauth_token_secret, oauth_verifier: veri, media_id: mediab64, tweetText: text})
                    }).then((res) => res.json())
                    .then((data) => {

                        // console.log('++++++++++++++++++');
                        // console.log('response = ' + JSON.stringify(data.success));
                        // console.log('response = ' + JSON.stringify(data.msg));
                        // console.log('++++++++++++++++++');

                        if( data.success === true ){
                            TweenMax.to(svgMaskLoad, 2, { scaleY: 0, transformOrigin:"top center", ease: Power0.easeNone }).delay(1.4);
                            setTimeout(function(){
                                exportModal.classList.remove('posting');
                                exportModal.classList.add('completed');
                                sendToAws(false);
                                TweenMax.to(svgMaskLoad, 1, { scaleY: 1}).delay(1);
                                var url = data.url,
                                    params = data.params;
                            }, 2300);

                        } else {
                            setTimeout(function(){
                                //console.log('There was an issue');
                                exportModal.classList.remove('posting');
                                exportModal.classList.add('error');
                            }, 4300);
                        }
                    })
                }
            })
        }

        function sendToAws(genEmail) {
            if(genEmail != false) {
                genEmail = true;
            }

            var form = document.getElementById("email-octocat");
            var emailAddress = document.getElementById('form-email');
            var mediab64 = document.getElementById('form-image').value;

            if(genEmail) {
                if(emailAddress.value == '') {
                    emailAddress.classList.add('form-error');
                    return;
                }
            }

            TweenMax.to(svgMaskLoad, 4, { scaleY: 0.3, transformOrigin:"top center",ease: Power4.easeOut }).delay(0.4);
            exportModal.classList.add('posting');
            emailAddress.classList.remove('form-error');

            var postUrl = 'https://octocat-generator.herokuapp.com/';
            //var postUrl = 'https://ar-tweet-server.herokuapp.com/aws';
            if( window.location.hostname === '127.0.0.1' ) {
                postUrl = 'http://localhost:4000/';
            }
            fetch(postUrl, {
                method:'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type':'application/json'
                },
                body:JSON.stringify({image: mediab64, email: emailAddress.value })
            })
            .then((res) => res.json())
            //.then(text => console.log(text))
            .then((data) => {
                //console.log('success = ' + data.imgUrl);

                //console.log(data.imgUrl);
                if( data.success === true ){
                    TweenMax.to(svgMaskLoad, 2, { scaleY: 0, transformOrigin:"top center", ease: Power0.easeNone }).delay(1.4);
                    setTimeout(function(){
                        exportModal.classList.remove('posting');
                        exportModal.classList.add('completed');
                        TweenMax.to(svgMaskLoad, 1, { scaleY: 1}).delay(1);

                        var elq = data.url,
                            p = data.params;

                        //console.log(data.url);

                        if(genEmail) {
                            sendEmail(elq, p);
                            //console.log('send email');
                        }
                    }, 2300);
                    //console.log("Now continue the process");
                } else {
                    setTimeout(function(){
                        console.log('There was an issue: ' +  data.msg);
                        exportModal.classList.remove('posting');
                        exportModal.classList.add('error');
                    }, 4300);
                }
            });
        }


        function makeid(length) {
           var result           = '';
           var characters       = 'ABCD0123456789';
           var charactersLength = characters.length;
           for ( var i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
           }
           return result;
        }

        function sendToAwsPrinter(genEmail) {
            document.getElementById('print-form-order-id').value = makeid(6);

            var form = document.getElementById("print-octocat");
            var emailAddress = document.getElementById('print-form-email');
            var name = document.getElementById('print-form-name');
            var mediab64 = document.getElementById('print-form-image').value;
            var svgMediab64 = document.getElementById('print-form-svg').value;
            var orderId = document.getElementById('print-form-order-id').value;


            TweenMax.to(svgMaskLoad, 4, { scaleY: 0.3, transformOrigin:"top center",ease: Power4.easeOut }).delay(0.4);
            exportModal.classList.add('posting');
            emailAddress.classList.remove('form-error');

            var postUrl = 'https://octocat-generator.herokuapp.com/';
            //var postUrl = 'https://ar-tweet-server.herokuapp.com/aws';
            if( window.location.hostname === '127.0.0.1' ) {
                postUrl = 'http://localhost:4000/';
            }
            fetch(postUrl, {
                method:'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type':'application/json'
                },
                body:JSON.stringify({image: mediab64, email: emailAddress.value, name: name.value, orderId: orderId })
            })
            .then((res) => res.json())
            //.then(text => console.log(text))
            .then((data) => {
                //console.log('success = ' + data.success);
                //console.log('For print = ' + data.forPrint);
                //console.log('PNG URL = ' + data.imgUrl);

                //FOR PRINT, SO SEND SVG TO AWS ALSO
                if( data.success === true && data.forPrint === true ){

                    //console.log('For print: Send svg data to AWS');

                    var postUrl = 'https://octocat-generator.herokuapp.com/svg';
                    if( window.location.hostname === '127.0.0.1' ) {
                        postUrl = 'http://localhost:4000/';
                    }
                    fetch(postUrl, {
                        method:'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-type':'application/json'
                        },
                        body:JSON.stringify({ svgimage: svgMediab64, image: data.imgUrl, email: emailAddress.value, name: name.value, orderId: orderId })
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        //console.log('success = ' + data.success);

                        if( data.success === true ){

                            TweenMax.to(svgMaskLoad, 2, { scaleY: 0, transformOrigin:"top center", ease: Power0.easeNone }).delay(1.4);

                            setTimeout(function(){
                                exportModal.classList.remove('posting');
                                exportModal.classList.add('completed');
                                TweenMax.to(svgMaskLoad, 1, { scaleY: 1}).delay(1);

                                var elq = data.url,
                                    p = data.params;

                                //console.log( JSON.stringify(data.params) );

                                sendEmail(elq, p);
                                //console.log('send email');

                            }, 2300);
                            //console.log("Now continue the process");
                        } else {
                            console.log('There was an issue with SVG submit: ' +  data.success);

                            setTimeout(function(){
                                console.log('There was an issue: ' +  data.success);
                                exportModal.classList.remove('posting');
                                exportModal.classList.add('error');
                            }, 4300);
                        }
                    });
                } else {
                    console.log('There was an issue with init submit: ' +  data.success);
                    setTimeout(function(){
                        console.log('There was an issue: ' +  data.success);
                        exportModal.classList.remove('posting');
                        exportModal.classList.add('error');
                    }, 4300);
                }
            });
        }


        function downloadImg() {
            //console.log('download');
        }

        function printOctocat() {
            //console.log('printing stuffs here');
        }

        function sendEmail(url, params) {
            // var userEmail = document.getElementById('email-userEmail');
            // var userImg = document.getElementById('email-userImg');
            // var source = 'web';
            // if(document.body.classList.contains('kiosk')){
            //     source = 'kiosk';
            // }
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            //Send the proper header information along with the request
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {
                    //console.log('email sent');
                }
            };
            http.send(params);
        }


        function sendPrintEmail(url, params) {
            // var userEmail = document.getElementById('email-userEmail');
            // var userImg = document.getElementById('email-userImg');
            // var source = 'web';
            // if(document.body.classList.contains('kiosk')){
            //     source = 'kiosk';
            // }
            var http = new XMLHttpRequest();
            http.open('POST', url, true);
            //Send the proper header information along with the request
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            http.onreadystatechange = function() {//Call a function when the state changes.
                if(http.readyState == 4 && http.status == 200) {
                    //console.log('email sent');
                }
            };
            http.send(params);
        }

        function svgDataURL(svg) {
            var svgAsXML = (new XMLSerializer).serializeToString(svg);
            return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
        }
    }


    var tweetText = document.getElementById('tweet-text'),
        charCount = document.getElementById('tweet-text-count');
        var truncate = function (elem, limit) {
            if (!elem || !limit) return;
        };

    var tweetTextCount = function (event) {
        var cc = tweetText.value.length;
        charCount.innerHTML = cc;
    };

    tweetTextCount();

    tweetText.addEventListener('keydown', tweetTextCount, false);
    tweetText.addEventListener('keyup', tweetTextCount, false);
    tweetText.addEventListener('change', tweetTextCount, false);
})();
