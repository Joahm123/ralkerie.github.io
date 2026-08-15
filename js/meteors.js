/* =====================================================
   RALKERIE METEORS
   LIGHTWEIGHT + VISIBLE
   MOVEMENT: ↘ DOWN + RIGHT
===================================================== */

(() => {

    "use strict";

    const container =
        document.getElementById("meteors");

    if (!container) {
        console.error("Ralkerie: #meteors not found.");
        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    const SPAWN_INTERVAL = 1800;
    const METEOR_LIFETIME = 6000;
    const MAX_METEORS = 4;

    let spawnTimer = null;


    /* =================================================
       AUDIO
    ================================================= */

    const audio =
        new Audio(
            "./assets/audio/Rune%20of%20September.mp3"
        );

    audio.preload = "metadata";


    /* =================================================
       POPUP
    ================================================= */

    const popup =
        document.createElement("div");

    popup.className = "meteor-popup";

    popup.innerHTML = `

        <div class="meteor-popup-box">

            <button
                class="meteor-popup-close"
                type="button"
                aria-label="Close"
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

    document.body.appendChild(popup);


    const closeButton =
        popup.querySelector(".meteor-popup-close");


    function meteorClicked() {

        popup.classList.add("visible");

        audio.currentTime = 0;

        audio.play().catch(() => {});

    }


    function closePopup() {

        popup.classList.remove("visible");

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

            if (event.target === popup) {
                closePopup();
            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closePopup();
            }

        }
    );


    /* =================================================
       CREATE METEOR
    ================================================= */

    function createMeteor() {

        if (document.hidden) {
            return;
        }


        const active =
            container.querySelectorAll(
                ".meteor-hitbox"
            ).length;


        if (active >= MAX_METEORS) {
            return;
        }


        const hitbox =
            document.createElement("div");

        hitbox.className =
            "meteor-hitbox";


        const meteor =
            document.createElement("div");

        meteor.className =
            "meteor";


        /* =================================================
           SPAWN

           Spawn across the ENTIRE top of the screen.

           Some start slightly above the screen,
           while others start inside the top area.
        ================================================= */

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        const startX =
            -150 +
            Math.random() *
            (width + 300);


        const startY =
            -180 +
            Math.random() *
            (height * 0.18);


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


        container.appendChild(
            hitbox
        );


        /* =================================================
           CLEANUP
        ================================================= */

        setTimeout(
            () => {

                if (hitbox.parentNode) {
                    hitbox.remove();
                }

            },
            METEOR_LIFETIME
        );

    }


    /* =================================================
       SPAWN
    ================================================= */

    createMeteor();


    spawnTimer =
        setInterval(
            createMeteor,
            SPAWN_INTERVAL
        );


    /* =================================================
       HIDDEN TAB
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                container
                    .querySelectorAll(
                        ".meteor-hitbox"
                    )
                    .forEach(
                        meteor =>
                            meteor.remove()
                    );

            }

        }
    );


    /* =================================================
       START
    ================================================= */

    console.log(
        "Ralkerie lightweight meteors loaded."
    );

})();
