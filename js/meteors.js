```javascript
/* =====================================================
   RALKERIE METEORS
===================================================== */

(() => {

    "use strict";

    /* Prevent duplicate copies */
    if (window.ralkerieMeteorSystem) {
        return;
    }

    window.ralkerieMeteorSystem = true;


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

    const container =
        document.getElementById("meteors");


    if (!container) {

        console.error(
            "Ralkerie: #meteors element not found."
        );

        return;
    }


    console.log(
        "Ralkerie meteor system loaded."
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
       OPEN METEOR
    ================================================= */

    function openMeteor() {

        popup.classList.add(
            "visible"
        );


        audio.currentTime =
            SONG_START_TIME;


        audio.play()
            .catch(
                error => {

                    console.error(
                        "Meteor audio error:",
                        error
                    );

                }
            );
    }


    /* =================================================
       CLOSE METEOR
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
            document.createElement("div");

        hitbox.className =
            "meteor-hitbox";


        const head =
            document.createElement("div");

        head.className =
            "meteor";


        /*
           Spawn slightly inside
           the right side.
        */

        const x =
            180;

        const y =
            10 +
            Math.random() * 65;


        hitbox.style.left =
            `${x}px`;

        hitbox.style.top =
            `${y}vh`;


        hitbox.appendChild(
            head
        );


        hitbox.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                openMeteor();

            }
        );


        container.appendChild(
            hitbox
        );


        console.log(
            "Meteor spawned"
        );


        /*
           Remove after animation.
        */

        setTimeout(
            () => {

                hitbox.remove();

            },
            5000
        );
    }


    /* =================================================
       SPAWN FIRST METEOR
    ================================================= */

    createMeteor();


    /* =================================================
       CONTINUOUS SPAWN
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
