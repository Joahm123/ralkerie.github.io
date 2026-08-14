
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


    /*
       AUDIO START TIME

       35 = 35 seconds
    */

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
       OPEN METEOR
    ===================================================== */

    function meteorClicked() {

        popup.classList.add(
            "visible"
        );


        /*
           Start the song at 35 seconds.
        */

        audio.currentTime =
            AUDIO_START_TIME;


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


        /* ---------------------------------------------
           SPAWN POSITION
        --------------------------------------------- */

        hitbox.style.left =
            "180px";


        hitbox.style.top =
            (
                10 +
                Math.random() * 70
            ) + "vh";


        /* ---------------------------------------------
           ADD METEOR
        --------------------------------------------- */

        hitbox.appendChild(
            meteor
        );


        /* ---------------------------------------------
           CLICK
        --------------------------------------------- */

        hitbox.addEventListener(
            "click",
            meteorClicked
        );


        /* ---------------------------------------------
           INSERT
        --------------------------------------------- */

        container.appendChild(
            hitbox
        );


        console.log(
            "Meteor spawned"
        );


        /* ---------------------------------------------
           REMOVE
        --------------------------------------------- */

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
