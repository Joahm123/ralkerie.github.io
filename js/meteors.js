/* =====================================================
   RALKERIE METEORS
   TOP-WIDE SPAWN → DOWN + RIGHT
===================================================== */

(() => {

    "use strict";


    /* =================================================
       CONTAINER
    ================================================= */

    const container =
        document.getElementById("meteors");


    if (!container) {

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

    const audio =
        new Audio(
            "./assets/audio/Rune%20of%20September.mp3"
        );

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
                src="./assets/images/meteor.gif"
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

    function meteorClicked() {

        popup.classList.add(
            "visible"
        );


        audio.currentTime = 0;


        audio.play().catch(
            () => {}
        );
    }


    /* =================================================
       CLOSE POPUP
    ================================================= */

    function closePopup() {

        popup.classList.remove(
            "visible"
        );


        audio.pause();

        audio.currentTime = 0;
    }


    closeButton.addEventListener(
        "click",
        closePopup
    );


    popup.addEventListener(
        "click",
        event => {

            if (
                event.target === popup
            ) {

                closePopup();
            }
        }
    );


    document.addEventListener(
        "keydown",
        event => {

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


        /* =================================================
           HUGE TOP SPAWN AREA

           X:
           Anywhere from far LEFT
           to far RIGHT.

           Y:
           Anywhere across the upper
           portion of the screen.

           This gives the whole screen
           coverage instead of a single
           spawn point.
        ================================================= */

        const spawnWidth =
            window.innerWidth +
            500;


        const spawnHeight =
            window.innerHeight *
            0.35;


        const startX =
            -250 +
            Math.random() *
            spawnWidth;


        const startY =
            -250 +
            Math.random() *
            spawnHeight;


        hitbox.style.left =
            `${startX}px`;


        hitbox.style.top =
            `${startY}px`;


        hitbox.appendChild(
            meteor
        );


        /* =================================================
           CLICK
        ================================================= */

        hitbox.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                meteorClicked();
            }
        );


        /* =================================================
           ADD
        ================================================= */

        container.appendChild(
            hitbox
        );


        console.log(
            "Meteor spawned:",
            Math.round(startX),
            Math.round(startY)
        );


        /* =================================================
           REMOVE
        ================================================= */

        setTimeout(
            () => {

                hitbox.remove();

            },
            6000
        );
    }


    /* =================================================
       FIRST METEOR
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
        1800
    );


})();
