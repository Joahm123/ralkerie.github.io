
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
       PLAY AUDIO
    ===================================================== */

    function playMeteorAudio() {

        /*
           Reset the audio.
        */

        audio.pause();


        /*
           Start from zero first.
           This happens directly from
           the meteor click.
        */

        audio.currentTime = 0;


        var playPromise =
            audio.play();


        if (!playPromise) {
            return;
        }


        playPromise.then(
            function () {

                /*
                   Once playback has actually
                   started, jump to 35 seconds.
                */

                try {

                    audio.currentTime =
                        AUDIO_START_TIME;

                } catch (error) {

                    console.error(
                        "Could not seek audio:",
                        error
                    );

                }

            }
        ).catch(
            function (error) {

                console.error(
                    "Audio playback failed:",
                    error
                );

            }
        );

    }


    /* =====================================================
       METEOR CLICK
    ===================================================== */

    function meteorClicked(event) {

        event.preventDefault();

        event.stopPropagation();


        popup.classList.add(
            "visible"
        );


        /*
           This is called directly by
           the user's click.
        */

        playMeteorAudio();

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
            document.createElement(
                "div"
            );


        hitbox.className =
            "meteor-hitbox";


        var meteor =
            document.createElement(
                "div"
            );


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


        /*
           Put meteor inside hitbox
        */

        hitbox.appendChild(
            meteor
        );


        /*
           Click
        */

        hitbox.addEventListener(
            "click",
            meteorClicked
        );


        /*
           Add to page
        */

        container.appendChild(
            hitbox
        );


        console.log(
            "Meteor spawned"
        );


        /*
           Remove after animation
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

