/* =====================================================
   RALKERIE METEORS
   CLICK METEOR -> GIF + MP3 POPUP
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const METEOR_AUDIO =
        "./assets/audio/meteor.mp3";

    const METEOR_GIF =
        "./assets/images/meteor.gif";


    const meteorContainer =
        document.getElementById("meteors");


    if (!meteorContainer) {

        console.error(
            "Ralkerie: #meteors not found."
        );

        return;
    }


    /* =================================================
       AUDIO
    ================================================= */

    const meteorSound =
        new Audio(METEOR_AUDIO);

    meteorSound.preload = "auto";


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
                aria-label="Close"
            >
                ×
            </button>

            <img
                class="meteor-popup-gif"
                src="${METEOR_GIF}"
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

    function openMeteorPopup() {

        popup.classList.add(
            "visible"
        );


        /*
           Restart GIF.
        */

        const gif =
            popup.querySelector(
                ".meteor-popup-gif"
            );


        gif.src = "";

        requestAnimationFrame(() => {

            gif.src =
                METEOR_GIF;

        });


        /*
           Restart audio.
        */

        meteorSound.currentTime = 0;

        meteorSound.play()
            .catch(() => {

                /*
                   Browser may block audio
                   until user interaction.

                   Since this function is
                   triggered by a click,
                   it should normally work.
                */

            });
    }


    /* =================================================
       CLOSE POPUP
    ================================================= */

    function closeMeteorPopup() {

        popup.classList.remove(
            "visible"
        );


        meteorSound.pause();

        meteorSound.currentTime = 0;
    }


    /* =================================================
       CLOSE BUTTON
    ================================================= */

    closeButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            closeMeteorPopup();
        }
    );


    /* =================================================
       CLICK BACKGROUND TO CLOSE
    ================================================= */

    popup.addEventListener(
        "click",
        (event) => {

            if (
                event.target === popup
            ) {

                closeMeteorPopup();
            }
        }
    );


    /* =================================================
       ESCAPE TO CLOSE
    ================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeMeteorPopup();
            }
        }
    );


    /* =================================================
       METEOR CREATION
    ================================================= */

    function createMeteor() {

        const meteor =
            document.createElement("div");

        meteor.className =
            "meteor";


        /*
           Meteor position.

           Kept toward the left side
           like your current design.
        */

        const x =
            -50 -
            Math.random() * 100;


        const y =
            15 +
            Math.random() * 65;


        meteor.style.left =
            `${x}px`;

        meteor.style.top =
            `${y}vh`;


        /*
           Random speed.
        */

        const duration =
            2.5 +
            Math.random() * 2;


        meteor.style.animation =
            `meteorMove ${duration}s linear forwards`;


        /*
           Click meteor.
        */

        meteor.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                openMeteorPopup();
            }
        );


        meteorContainer.appendChild(
            meteor
        );


        /*
           Remove after animation.

           Prevents old meteors from
           building up in memory.
        */

        setTimeout(
            () => {

                meteor.remove();

            },
            (duration + 0.2) * 1000
        );
    }


    /* =================================================
       SPAWN METEORS
    ================================================= */

    function spawnMeteor() {

        if (
            document.hidden
        ) {

            return;
        }


        createMeteor();


        /*
           Random delay so meteors
           don't appear in groups.
        */

        const nextSpawn =
            2500 +
            Math.random() * 4500;


        setTimeout(
            spawnMeteor,
            nextSpawn
        );
    }


    /* =================================================
       START
    ================================================= */

    spawnMeteor();


    console.log(
        "Ralkerie meteors loaded."
    );

})();
