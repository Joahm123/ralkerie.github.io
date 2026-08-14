/* =====================================================
   RALKERIE METEORS
===================================================== */

(() => {

    "use strict";


    /* =================================================
       ELEMENT
    ================================================= */

    const meteorContainer =
        document.getElementById("meteors");


    if (!meteorContainer) {

        console.error(
            "Ralkerie: #meteors was not found."
        );

        return;
    }


    console.log(
        "Ralkerie meteors loaded."
    );


    /* =================================================
       FILES
    ================================================= */

    const AUDIO_FILE =
        "./assets/audio/meteor.mp3";

    const GIF_FILE =
        "./assets/images/meteor.gif";


    /* =================================================
       AUDIO
    ================================================= */

    const meteorAudio =
        new Audio(AUDIO_FILE);

    meteorAudio.preload =
        "auto";


    /* =================================================
       POPUP
    ================================================= */

    const popup =
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
                src="${GIF_FILE}"
                alt="Meteor"
            >

        </div>
    `;


    document.body.appendChild(
        popup
    );


    const closeButton =
        popup.querySelector(
            ".meteor-popup-close"
        );


    /* =================================================
       POPUP OPEN
    ================================================= */

    function openPopup() {

        popup.classList.add(
            "visible"
        );


        meteorAudio.currentTime =
            0;


        meteorAudio.play()
            .catch(() => {

                console.log(
                    "Meteor audio could not play."
                );

            });
    }


    /* =================================================
       POPUP CLOSE
    ================================================= */

    function closePopup() {

        popup.classList.remove(
            "visible"
        );


        meteorAudio.pause();

        meteorAudio.currentTime =
            0;
    }


    closeButton.addEventListener(
        "click",
        closePopup
    );


    popup.addEventListener(
        "click",
        (event) => {

            if (
                event.target === popup
            ) {

                closePopup();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closePopup();

            }

        }
    );


    /* =================================================
       CREATE METEOR
    ================================================= */

    function createMeteor() {

        const meteor =
            document.createElement("div");


        meteor.className =
            "meteor";


        /* ---------------------------------------------
           NORMAL POSITION
        --------------------------------------------- */

        meteor.style.left =
            "-100px";


        meteor.style.top =
            (
                15 +
                Math.random() * 65
            ) + "vh";


        /* ---------------------------------------------
           CLICK
        --------------------------------------------- */

        meteor.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                openPopup();

            }
        );


        /* ---------------------------------------------
           ADD TO DOM
        --------------------------------------------- */

        meteorContainer.appendChild(
            meteor
        );


        console.log(
            "Meteor spawned."
        );


        /* ---------------------------------------------
           REMOVE OLD METEOR
        --------------------------------------------- */

        setTimeout(
            () => {

                meteor.remove();

            },
            6000
        );
    }


    /* =================================================
       SPAWN FIRST METEOR
    ================================================= */

    createMeteor();


    /* =================================================
       SPAWN MORE
    ================================================= */

    function spawnMeteor() {

        if (
            !document.hidden
        ) {

            createMeteor();

        }


        const delay =
            3000 +
            Math.random() * 4000;


        setTimeout(
            spawnMeteor,
            delay
        );
    }


    setTimeout(
        spawnMeteor,
        3000
    );


})();
