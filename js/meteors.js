
(function () {

    "use strict";


    /* =====================================================
       FIND METEOR CONTAINER
    ===================================================== */

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


    /* =====================================================
       POPUP
    ===================================================== */

    var popup =
        document.createElement("div");

    popup.className =
        "meteor-popup";


    popup.innerHTML = `

        <div class="meteor-popup-box">

            <button
                class="meteor-popup-close"
                type="button"
            >
                ×
            </button>

            <img
                class="meteor-popup-gif"
                src="./assets/images/meteor.gif"
                alt="Meteor"
            >

        </div>

    `;


    document.body.appendChild(
        popup
    );


    var closeButton =
        popup.querySelector(
            ".meteor-popup-close"
        );


    /* =====================================================
       OPEN METEOR
    ===================================================== */

    function meteorClicked() {

        popup.classList.add(
            "visible"
        );


        audio.currentTime = 0;


        audio.play()
            .catch(
                function (error) {

                    console.error(
                        "Meteor audio error:",
                        error
                    );

                }
            );

    }


    /* =====================================================
       CLOSE POPUP
    ===================================================== */

    function closePopup() {

        popup.classList.remove(
            "visible"
        );


        audio.pause();

        audio.currentTime = 0;

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
         * SPAWN POSITION
         *
         * Much farther toward the right.
         *
         * The random amount prevents every
         * meteor from appearing at exactly
         * the same height.
         */

        hitbox.style.left =
            (
                300 +
                Math.random() * 180
            ) +
            "px";


        hitbox.style.top =
            (
                5 +
                Math.random() * 75
            ) +
            "vh";


        hitbox.appendChild(
            meteor
        );


        /* =================================================
           CLICK
        ================================================= */

        hitbox.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                meteorClicked();

            }
        );


        /* =================================================
           ADD
        ================================================= */

        container.appendChild(
            hitbox
        );


        console.log(
            "Meteor spawned."
        );


        /* =================================================
           REMOVE
        ================================================= */

        setTimeout(
            function () {

                hitbox.remove();

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

    /*
     * Lower number = more meteors.
     *
     * 2200ms = about one every 2.2 seconds.
     */

    setInterval(
        function () {

            if (
                !document.hidden
            ) {

                createMeteor();

            }

        },
        2200
    );


})();

