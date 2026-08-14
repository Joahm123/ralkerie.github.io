/* =====================================================
   RALKERIE METEORS
   DIAGONAL + CLICK POPUP + SONG START TIME
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const AUDIO_FILE =
        "./assets/audio/meteor.mp3";

    const GIF_FILE =
        "./assets/images/meteor.gif";

    /*
       How far into the song to start.

       15 = starts at 0:15
       30 = starts at 0:30
       45 = starts at 0:45
    */

    const SONG_START_TIME = 35;


    const meteorContainer =
        document.getElementById("meteors");


    if (!meteorContainer) {

        console.error(
            "Ralkerie: #meteors not found."
        );

        return;
    }


    console.log(
        "Ralkerie meteors loaded."
    );


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
       OPEN POPUP
    ================================================= */

    function openPopup() {

        popup.classList.add(
            "visible"
        );


        /*
           Start farther into the song.
        */

        meteorAudio.currentTime =
            SONG_START_TIME;


        meteorAudio.play()
            .catch(() => {

                console.log(
                    "Meteor audio could not play."
                );

            });
    }


    /* =================================================
       CLOSE POPUP
    ================================================= */

    function closePopup() {

        popup.classList.remove(
            "visible"
        );


        meteorAudio.pause();

        meteorAudio.currentTime =
            0;
    }


    /* =================================================
       CLOSE BUTTON
    ================================================= */

    closeButton.addEventListener(
        "click",
        closePopup
    );


    /* =================================================
       CLICK OUTSIDE
    ================================================= */

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


    /* =================================================
       ESCAPE
    ================================================= */

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


        /*
           Normal spawn position.
        */

        const y =
            15 +
            Math.random() * 65;


        meteor.style.left =
            "-100px";


        meteor.style.top =
            `${y}vh`;


        meteor.style.opacity =
            "1";


        meteor.style.visibility =
            "visible";


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
           ADD METEOR
        --------------------------------------------- */

        meteorContainer.appendChild(
            meteor
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
       FIRST METEOR
    ================================================= */

    createMeteor();


    /* =================================================
       SPAWN LOOP
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
