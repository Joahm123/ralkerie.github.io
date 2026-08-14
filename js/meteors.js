```javascript
/* =====================================================
   RALKERIE METEORS
   METEORS + LARGE HITBOX + AUDIO
===================================================== */

(() => {

    "use strict";


    /* =================================================
       PREVENT DUPLICATE SCRIPT
    ================================================= */

    if (window.ralkerieMeteorsLoaded) {

        console.warn(
            "Ralkerie meteors already loaded."
        );

        return;
    }

    window.ralkerieMeteorsLoaded = true;


    /* =================================================
       SETTINGS
    ================================================= */

    const AUDIO_FILE =
        "./assets/audio/Rune%20of%20September.mp3";

    const GIF_FILE =
        "./assets/images/meteor.gif";

    const SONG_START_TIME = 35;


    /* =================================================
       CONTAINER
    ================================================= */

    const meteorContainer =
        document.getElementById("meteors");


    if (!meteorContainer) {

        console.error(
            "Ralkerie: #meteors does not exist."
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
       PLAY AUDIO
    ================================================= */

    function playMeteorAudio() {

        /*
           Reset the audio first.
        */

        meteorAudio.pause();

        /*
           Start at 35 seconds.
        */

        try {

            meteorAudio.currentTime =
                SONG_START_TIME;

        } catch {

            meteorAudio.currentTime =
                0;
        }


        const promise =
            meteorAudio.play();


        if (promise) {

            promise.catch(
                (error) => {

                    console.error(
                        "Meteor audio failed:",
                        error
                    );

                }
            );

        }
    }


    /* =================================================
       OPEN POPUP
    ================================================= */

    function openPopup() {

        popup.classList.add(
            "visible"
        );


        if (
            meteorAudio.readyState >= 1
        ) {

            playMeteorAudio();

        } else {

            meteorAudio.addEventListener(
                "loadedmetadata",
                playMeteorAudio,
                {
                    once: true
                }
            );

        }
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

        const hitbox =
            document.createElement("div");

        hitbox.className =
            "meteor-hitbox";


        const meteor =
            document.createElement("div");

        meteor.className =
            "meteor";


        /* ---------------------------------------------
           POSITION
        --------------------------------------------- */

        const spawnY =
            15 +
            Math.random() * 65;


        /*
           Spawn farther right.
        */

        hitbox.style.left =
            "180px";

        hitbox.style.top =
            `${spawnY}vh`;


        /* ---------------------------------------------
           METEOR INSIDE HITBOX
        --------------------------------------------- */

        hitbox.appendChild(
            meteor
        );


        /* ---------------------------------------------
           CLICK
        --------------------------------------------- */

        hitbox.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();

                openPopup();

            }
        );


        /* ---------------------------------------------
           ADD
        --------------------------------------------- */

        meteorContainer.appendChild(
            hitbox
        );


        console.log(
            "Meteor spawned"
        );


        /* ---------------------------------------------
           CLEANUP
        --------------------------------------------- */

        setTimeout(
            () => {

                hitbox.remove();

            },
            6000
        );
    }


    /* =================================================
       SPAWN
    ================================================= */

    createMeteor();


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
```
