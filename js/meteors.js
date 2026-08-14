```javascript
/* =====================================================
   RALKERIE METEORS
===================================================== */

(() => {

    "use strict";

    /* =================================================
       SETTINGS
    ================================================= */

    const AUDIO_FILE =
        "./assets/audio/Rune%20of%20September.mp3";

    const GIF_FILE =
        "./assets/images/meteor.gif";

    const SONG_START_TIME = 35;


    /* =================================================
       GET CONTAINER
    ================================================= */

    const container =
        document.getElementById("meteors");


    if (!container) {

        console.error(
            "RALKERIE METEORS: #meteors was not found."
        );

        return;
    }


    console.log(
        "RALKERIE METEORS: system started."
    );


    /* =================================================
       AUDIO
    ================================================= */

    const audio =
        new Audio(AUDIO_FILE);

    audio.preload = "auto";


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

    function openMeteor() {

        popup.classList.add(
            "visible"
        );


        /*
           Wait until the audio knows
           its duration before seeking.
        */

        const startAudio = () => {

            try {

                if (
                    Number.isFinite(
                        audio.duration
                    ) &&
                    audio.duration > SONG_START_TIME
                ) {

                    audio.currentTime =
                        SONG_START_TIME;

                } else {

                    audio.currentTime = 0;

                }

            } catch (error) {

                console.warn(
                    "Could not seek audio:",
                    error
                );

            }


            audio.play()
                .catch(
                    error => {

                        console.error(
                            "Meteor audio error:",
                            error
                        );

                    }
                );
        };


        if (
            audio.readyState >= 1
        ) {

            startAudio();

        } else {

            audio.addEventListener(
                "loadedmetadata",
                startAudio,
                {
                    once: true
                }
            );

        }
    }


    /* =================================================
       CLOSE POPUP
    ================================================= */

    function closeMeteor() {

        popup.classList.remove(
            "visible"
        );

        audio.pause();

        audio.currentTime = 0;
    }


    closeButton.addEventListener(
        "click",
        closeMeteor
    );


    popup.addEventListener(
        "click",
        event => {

            if (
                event.target === popup
            ) {

                closeMeteor();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeMeteor();

            }

        }
    );


    /* =================================================
       CREATE METEOR
    ================================================= */

    function createMeteor() {

        const hitbox =
            document.createElement(
                "div"
            );

        hitbox.className =
            "meteor-hitbox";


        const head =
            document.createElement(
                "div"
            );

        head.className =
            "meteor";


        /* ---------------------------------------------
           START POSITION
        --------------------------------------------- */

        const spawnX =
            180;

        const spawnY =
            10 +
            Math.random() * 70;


        hitbox.style.left =
            `${spawnX}px`;

        hitbox.style.top =
            `${spawnY}vh`;


        /* ---------------------------------------------
           PUT HEAD INSIDE HITBOX
        --------------------------------------------- */

        hitbox.appendChild(
            head
        );


        /* ---------------------------------------------
           CLICK
        --------------------------------------------- */

        hitbox.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                openMeteor();

            }
        );


        /* ---------------------------------------------
           ADD METEOR
        --------------------------------------------- */

        container.appendChild(
            hitbox
        );


        console.log(
            "RALKERIE METEORS: meteor spawned."
        );


        /* ---------------------------------------------
           CLEANUP
        --------------------------------------------- */

        setTimeout(
            () => {

                if (
                    hitbox.parentNode
                ) {

                    hitbox.remove();

                }

            },
            5500
        );
    }


    /* =================================================
       FIRST METEOR
    ================================================= */

    createMeteor();


    /* =================================================
       SPAWN MORE
    ================================================= */

    setInterval(
        () => {

            if (
                !document.hidden
            ) {

                createMeteor();

            }

        },
        3500
    );


})();
```
