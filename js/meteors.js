(() => {

    "use strict";

    /* =====================================================
       SETTINGS
    ===================================================== */

    const AUDIO_FILE =
        "./assets/audio/meteor.mp3";

    const GIF_FILE =
        "./assets/images/meteor.gif";

    const SONG_START_TIME = 35;

    const meteorContainer =
        document.getElementById("meteors");


    /* =====================================================
       CHECK
    ===================================================== */

    if (!meteorContainer) {
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

    const meteorAudio =
        new Audio();

    meteorAudio.src =
        AUDIO_FILE;

    meteorAudio.preload =
        "auto";

    meteorAudio.load();


    /* =====================================================
       POPUP
    ===================================================== */

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


    /* =====================================================
       OPEN POPUP + PLAY AUDIO
    ===================================================== */

    function openPopup() {

        popup.classList.add(
            "visible"
        );


        /*
           Make sure the audio is loaded
           before seeking to 35 seconds.
        */

        const playMeteorSound = () => {

            try {

                /*
                   If the song is shorter than
                   35 seconds, start at the beginning.
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

        };


        /*
           Audio is already loaded.
        */

        if (
            meteorAudio.readyState >= 1
        ) {

            playMeteorSound();

        } else {

            meteorAudio.addEventListener(
                "loadedmetadata",
                playMeteorSound,
                {
                    once: true
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


    /* =====================================================
       CREATE METEOR
    ===================================================== */

    function createMeteor() {

        const hitbox =
            document.createElement("div");

        hitbox.className =
            "meteor-hitbox";


        const meteor =
            document.createElement("div");

        meteor.className =
            "meteor";


        /* =================================================
           SPAWN POSITION

           FARTHER RIGHT
        ================================================= */

        const spawnY =
            15 +
            Math.random() * 65;


        hitbox.style.left =
            "180px";

        hitbox.style.top =
            `${spawnY}vh`;


        hitbox.appendChild(
            meteor
        );


        /* =================================================
           CLICK
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
           ADD
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


    /* =====================================================
       FIRST METEOR
    ===================================================== */

    createMeteor();


    /* =====================================================
       SPAWN LOOP
    ===================================================== */

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
