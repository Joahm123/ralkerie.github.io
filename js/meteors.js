```javascript
/* =====================================================
   RALKERIE METEORS
   SMALL METEOR + LARGE HITBOX + AUDIO + GIF
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const AUDIO_FILE =
        "./assets/audio/Rune of September.mp3";

    const GIF_FILE =
        "./assets/images/meteor.gif";

    const SONG_START_TIME =
        35;


    /* =================================================
       METEOR CONTAINER
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
        new Audio();

    meteorAudio.src =
        AUDIO_FILE;

    meteorAudio.preload =
        "auto";

    meteorAudio.load();


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
       OPEN POPUP + AUDIO
    ================================================= */

    function openPopup() {

        popup.classList.add(
            "visible"
        );


        function playMeteorAudio() {

            try {

                /*
                   Start at 35 seconds if the
                   song is long enough.
                */

                if (
                    Number.isFinite(
                        meteorAudio.duration
                    ) &&
                    meteorAudio.duration >
                    SONG_START_TIME
                ) {

                    meteorAudio.currentTime =
                        SONG_START_TIME;

                } else {

                    meteorAudio.currentTime =
                        0;

                }


                const playPromise =
                    meteorAudio.play();


                if (
                    playPromise !== undefined
                ) {

                    playPromise.catch(
                        (error) => {

                            console.error(
                                "Meteor audio failed:",
                                error
                            );

                        }
                    );

                }

            } catch (error) {

                console.error(
                    "Meteor audio error:",
                    error
                );

            }
        }


        /*
           Wait for metadata if necessary.
        */

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
       CLICK OUTSIDE POPUP
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
       ESCAPE KEY
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

        /*
           Large invisible clickable area.
        */

        const hitbox =
            document.createElement("div");

        hitbox.className =
            "meteor-hitbox";


        /*
           Visible meteor.
        */

        const meteor =
            document.createElement("div");

        meteor.className =
            "meteor";


        /* =================================================
           RANDOM VERTICAL POSITION
        ================================================= */

        const spawnY =
            15 +
            Math.random() * 65;


        /* =================================================
           SPAWN FARTHER RIGHT
        ================================================= */

        hitbox.style.left =
            "180px";

        hitbox.style.top =
            `${spawnY}vh`;


        /* =================================================
           PUT METEOR INSIDE HITBOX
        ================================================= */

        hitbox.appendChild(
            meteor
        );


        /* =================================================
           CLICK METEOR / HITBOX
        ================================================= */

        hitbox.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();

                openPopup();

            }
        );


        /* =================================================
           ADD TO PAGE
        ================================================= */

        meteorContainer.appendChild(
            hitbox
        );


        /* =================================================
           CLEANUP
        ================================================= */

        setTimeout(
            () => {

                if (
                    hitbox.isConnected
                ) {

                    hitbox.remove();

                }

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


    /* =================================================
       START SPAWNING
    ================================================= */

    setTimeout(
        spawnMeteor,
        3000
    );

})();
```
