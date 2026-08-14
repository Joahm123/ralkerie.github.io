/* =====================================================
   RALKERIE METEORS
   SMALL METEOR + LARGE HITBOX
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

    const SONG_START_TIME =
        35;


    /* =================================================
       CONTAINER
    ================================================= */

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
       POPUP
    ================================================= */

    function openPopup() {

        popup.classList.add(
            "visible"
        );


        meteorAudio.currentTime =
            SONG_START_TIME;


        meteorAudio.play()
            .catch(() => {});
    }


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

        /*
           OUTER HITBOX
        */

        const hitbox =
            document.createElement("div");

        hitbox.className =
            "meteor-hitbox";


        /*
           ACTUAL VISIBLE METEOR
        */

        const meteor =
            document.createElement("div");

        meteor.className =
            "meteor";


        /*
           POSITION
        */

        const y =
            15 +
            Math.random() * 65;


        hitbox.style.left =
            "-100px";

        hitbox.style.top =
            `${y}vh`;


        /*
           Put meteor inside hitbox.
        */

        hitbox.appendChild(
            meteor
        );


        /*
           CLICK THE LARGE HITBOX
        */

        hitbox.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                openPopup();

            }
        );


        /*
           ADD TO PAGE
        */

        meteorContainer.appendChild(
            hitbox
        );


        /*
           REMOVE AFTER A WHILE
        */

        setTimeout(
            () => {

                hitbox.remove();

            },
            6500
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
