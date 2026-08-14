/* =====================================================
   RALKERIE METEORS
   NORMAL SPAWN POSITION
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


        meteorAudio.currentTime =
            0;


        meteorAudio.play()
            .catch(() => {});
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
           NORMAL SPAWN

           Back to the original area.
        --------------------------------------------- */

        const y =
            15 +
            Math.random() * 65;


        const x =
            -80 -
            Math.random() * 120;


        meteor.style.left =
            `${x}px`;


        meteor.style.top =
            `${y}vh`;


        meteor.style.opacity =
            "1";


        meteor.style.visibility =
            "visible";


        /* ---------------------------------------------
           CLICK METEOR
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
           MOVEMENT
        --------------------------------------------- */

        const duration =
            2800 +
            Math.random() * 1800;


        const distance =
            window.innerWidth +
            800;


        const animation =
            meteor.animate(

                [
                    {
                        transform:
                            "translate3d(0, 0, 0)",

                        opacity: 1
                    },

                    {
                        transform:
                            `translate3d(${distance}px, 0, 0)`,

                        opacity: 1
                    }
                ],

                {
                    duration:
                        duration,

                    easing:
                        "linear",

                    fill:
                        "forwards"
                }

            );


        /* ---------------------------------------------
           CLEANUP
        --------------------------------------------- */

        animation.finished
            .then(() => {

                meteor.remove();

            })
            .catch(() => {

                meteor.remove();

            });
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
            Math.random() * 4500;


        setTimeout(
            spawnMeteor,
            delay
        );
    }


    setTimeout(
        spawnMeteor,
        3500
    );

})();
