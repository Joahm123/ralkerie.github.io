
(function () {

    "use strict";

    var container =
        document.getElementById("meteors");


    if (!container) {

        console.error(
            "Ralkerie: #meteors not found."
        );

        return;
    }


    console.log(
        "Ralkerie meteors loaded."
    );


    /* =====================================================
       AUDIO
    ===================================================== */

    var audio =
        new Audio(
            "./assets/audio/Rune%20of%20September.mp3"
        );

    audio.preload = "auto";


    /* Start at 35 seconds */

    var AUDIO_START_TIME = 35;


    /* =====================================================
       POPUP
    ===================================================== */

    var popup =
        document.createElement("div");

    popup.className =
        "meteor-popup";


    var popupBox =
        document.createElement("div");

    popupBox.className =
        "meteor-popup-box";


    var closeButton =
        document.createElement("button");

    closeButton.className =
        "meteor-popup-close";

    closeButton.type =
        "button";

    closeButton.textContent =
        "×";


    var gif =
        document.createElement("img");

    gif.className =
        "meteor-popup-gif";

    gif.src =
        "./assets/images/meteor.gif";

    gif.alt =
        "Meteor";


    popupBox.appendChild(
        closeButton
    );

    popupBox.appendChild(
        gif
    );

    popup.appendChild(
        popupBox
    );

    document.body.appendChild(
        popup
    );


    /* =====================================================
       PLAY AUDIO AT 35 SECONDS
    ===================================================== */

    function playAudioFrom35() {

        /*
           Make sure the browser has loaded
           enough metadata to seek.
        */

        if (
            !isFinite(audio.duration)
        ) {

            console.warn(
                "Audio metadata has not loaded yet."
            );

            return;
        }


        /*
           Make sure 35 seconds actually
           exists in the song.
        */

        if (
            audio.duration <= AUDIO_START_TIME
        ) {

            console.warn(
                "Song is shorter than 35 seconds."
            );

            audio.currentTime = 0;

        } else {

            audio.currentTime =
                AUDIO_START_TIME;

        }


        /*
           Play after seeking.
        */

        var playPromise =
            audio.play();


        if (playPromise) {

            playPromise.catch(
                function (error) {

                    console.error(
                        "Meteor audio error:",
                        error
                    );

                }
            );

        }
    }


    /* =====================================================
       METEOR CLICK
    ===================================================== */

    function meteorClicked() {

        popup.classList.add(
            "visible"
        );


        /*
           If metadata is already loaded,
           seek immediately.
        */

        if (
            audio.readyState >= 1
        ) {

            playAudioFrom35();

        } else {

            /*
               Otherwise wait for metadata.
            */

            audio.addEventListener(
                "loadedmetadata",
                playAudioFrom35,
                {
                    once: true
                }
            );


            /*
               Start loading the audio.
            */

            audio.load();
        }
    }


    /* =====================================================
       CLOSE POPUP
    ===================================================== */

    function closePopup() {

        popup.classList.remove(
            "visible"
        );


        audio.pause();

        audio.currentTime =
            0;
    }


    closeButton.addEventListener(
        "click",
        closePopup
    );


    popup.addEventListener(
        "click",
        function (event) {

            if (
                event.target === popup
            ) {

                closePopup();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closePopup();

            }

        }
    );


    /* =====================================================
       CREATE METEOR
    ===================================================== */

    function createMeteor() {

        var hitbox =
            document.createElement("div");


        hitbox.className =
            "meteor-hitbox";


        var meteor =
            document.createElement("div");


        meteor.className =
            "meteor";


        /*
           Spawn position
        */

        hitbox.style.left =
            "180px";


        hitbox.style.top =
            (
                10 +
                Math.random() * 70
            ) + "vh";


        hitbox.appendChild(
            meteor
        );


        /*
           Click meteor
        */

        hitbox.addEventListener(
            "click",
            meteorClicked
        );


        container.appendChild(
            hitbox
        );


        console.log(
            "Meteor spawned"
        );


        /*
           Remove meteor
        */

        setTimeout(
            function () {

                if (
                    hitbox.parentNode
                ) {

                    hitbox.parentNode.removeChild(
                        hitbox
                    );

                }

            },
            5500
        );
    }


    /* =====================================================
       FIRST METEOR
    ===================================================== */

    createMeteor();


    /* =====================================================
       SPAWN LOOP
    ===================================================== */

    setInterval(
        function () {

            if (
                !document.hidden
            ) {

                createMeteor();

            }

        },
        3500
    );


})();

