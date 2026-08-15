/* =====================================================
   RALKERIE METEORS
   PERFORMANCE OPTIMIZED

   - Max 4 meteors
   - Spawns across the entire top area
   - Moves DOWN + RIGHT ↘
   - Meteors stay behind the Discord card
   - Pauses while tab is hidden
   - Cleans up automatically
   - Click meteor to open GIF + audio
===================================================== */

(() => {

    "use strict";


    /* =====================================================
       CONTAINER
    ===================================================== */

    const container =
        document.getElementById("meteors");


    if (!container) {

        console.error(
            "Ralkerie: #meteors not found."
        );

        return;
    }


    /* =====================================================
       SETTINGS
    ===================================================== */

    const SPAWN_INTERVAL = 2200;

    const METEOR_LIFETIME = 5200;

    const MAX_METEORS = 4;


    /* =====================================================
       AUDIO
    ===================================================== */

    const audio =
        new Audio(
            "./assets/audio/Rune%20of%20September.mp3"
        );

    audio.preload = "metadata";


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


    document.body.appendChild(
        popup
    );


    const closeButton =
        popup.querySelector(
            ".meteor-popup-close"
        );


    /* =====================================================
       OPEN POPUP
    ===================================================== */

    function meteorClicked() {

        popup.classList.add(
            "visible"
        );


        audio.currentTime = 0;


        audio.play().catch(
            () => {}
        );
    }


    /* =====================================================
       CLOSE POPUP
    ===================================================== */

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


    /* =====================================================
       CREATE METEOR
    ===================================================== */

    function createMeteor() {

        /*
         * Don't create more than
         * MAX_METEORS.
         */

        if (
            container.children.length >=
            MAX_METEORS
        ) {

            return;
        }


        const hitbox =
            document.createElement(
                "div"
            );


        hitbox.className =
            "meteor-hitbox";


        const meteor =
            document.createElement(
                "div"
            );


        meteor.className =
            "meteor";


        /* =================================================
           SPAWN AREA

           Covers the entire width.

           Extra space above and
           outside both sides means
           meteors can enter naturally.
        ================================================= */

        const spawnWidth =
            window.innerWidth + 700;


        const spawnHeight =
            Math.max(
                300,
                window.innerHeight * 0.40
            );


        const startX =
            -350 +
            Math.random() *
            spawnWidth;


        const startY =
            -350 +
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
           ADD TO SCREEN
        ================================================= */

        container.appendChild(
            hitbox
        );


        /* =================================================
           CLEANUP

           Remove meteor after its
           animation has finished.
        ================================================= */

        setTimeout(
            () => {

                if (
                    hitbox.parentNode
                ) {

                    hitbox.remove();
                }

            },
            METEOR_LIFETIME
        );
    }


    /* =====================================================
       INITIAL METEOR
    ===================================================== */

    createMeteor();


    /* =====================================================
       SPAWN LOOP
    ===================================================== */

    const spawnTimer =
        setInterval(
            () => {

                /*
                 * Don't spawn while the
                 * browser tab is hidden.
                 */

                if (
                    document.hidden
                ) {

                    return;
                }


                createMeteor();

            },
            SPAWN_INTERVAL
        );


    /* =====================================================
       HIDDEN TAB
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                /*
                 * Remove active meteors
                 * while hidden.
                 */

                const active =
                    container.querySelectorAll(
                        ".meteor-hitbox"
                    );


                active.forEach(
                    meteor => {

                        meteor.remove();

                    }
                );

            } else {

                /*
                 * Spawn one immediately
                 * when returning.
                 */

                createMeteor();
            }

        }
    );


    /* =====================================================
       CLEANUP ON PAGE EXIT
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            clearInterval(
                spawnTimer
            );

            audio.pause();

        }
    );


    /* =====================================================
       READY
    ===================================================== */

    console.log(
        "Ralkerie optimized meteors loaded."
    );

})();
