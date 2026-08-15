/* =====================================================
   RALKERIE METEORS
   FAST + LONG TRAILS + FULL SCREEN COVERAGE

   - Meteors move DOWN + RIGHT ↘
   - Long thick trails
   - Faster movement
   - Stay alive until they actually leave screen
   - Spawn across the entire upper area
   - Maximum 5 meteors
   - Pauses while tab is hidden
   - Click opens meteor popup
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


    /* =================================================
       SETTINGS
    ================================================= */

    const SPAWN_INTERVAL = 1800;

    const MAX_METEORS = 5;

    /*
     * Faster than before.
     */
    const SPEED_MIN = 420;

    const SPEED_MAX = 650;


    /*
     * Meteor travels roughly 46 degrees
     * down and right.
     */
    const ANGLE = 46;


    /*
     * Extra distance outside screen.
     */
    const OFFSCREEN_MARGIN = 500;


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
       RANDOM
    ================================================= */

    function random(min, max) {

        return (
            min +
            Math.random() *
            (max - min)
        );

    }


    /* =================================================
       CREATE METEOR
    ================================================= */

    function createMeteor() {

        if (
            document.hidden
        ) {

            return;

        }


        /*
         * Keep meteor count low.
         */

        if (
            container.querySelectorAll(
                ".meteor-hitbox"
            ).length >= MAX_METEORS
        ) {

            return;

        }


        /* =================================================
           HITBOX
        ================================================= */

        const hitbox =
            document.createElement(
                "div"
            );

        hitbox.className =
            "meteor-hitbox";


        /* =================================================
           METEOR
        ================================================= */

        const meteor =
            document.createElement(
                "div"
            );

        meteor.className =
            "meteor";


        /* =================================================
           SPAWN POSITION
           
           Entire upper portion of screen.
        ================================================= */

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        const startX =
            random(
                -300,
                width + 300
            );


        const startY =
            random(
                -450,
                height * 0.30
            );


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
           MOVEMENT
        ================================================= */

        const angle =
            ANGLE *
            Math.PI /
            180;


        const speed =
            random(
                SPEED_MIN,
                SPEED_MAX
            );


        const velocityX =
            Math.cos(angle) *
            speed;


        const velocityY =
            Math.sin(angle) *
            speed;


        /*
         * Use transform instead of
         * constantly changing left/top.
         *
         * This is much cheaper.
         */

        const createdAt =
            performance.now();


        let frame = null;


        function move(time) {

            /*
             * Meteor was removed.
             */

            if (
                !hitbox.parentNode
            ) {

                if (frame) {

                    cancelAnimationFrame(
                        frame
                    );

                }

                return;
            }


            /*
             * Stop moving while tab
             * isn't visible.
             */

            if (
                document.hidden
            ) {

                frame =
                    requestAnimationFrame(
                        move
                    );

                return;

            }


            const elapsed =
                (
                    time -
                    createdAt
                ) / 1000;


            const x =
                velocityX *
                elapsed;


            const y =
                velocityY *
                elapsed;


            hitbox.style.transform =
                `translate3d(${x}px, ${y}px, 0)`;


            /* =================================================
               DESPAWN ONLY AFTER FULLY LEAVING SCREEN
            ================================================= */

            const rect =
                hitbox.getBoundingClientRect();


            const completelyGone =
                rect.left >
                    window.innerWidth +
                    OFFSCREEN_MARGIN ||

                rect.top >
                    window.innerHeight +
                    OFFSCREEN_MARGIN ||

                rect.right <
                    -OFFSCREEN_MARGIN ||

                rect.bottom <
                    -OFFSCREEN_MARGIN;


            if (
                completelyGone
            ) {

                hitbox.remove();

                return;

            }


            frame =
                requestAnimationFrame(
                    move
                );

        }


        frame =
            requestAnimationFrame(
                move
            );

    }


    /* =================================================
       INITIAL METEORS
    ================================================= */

    createMeteor();

    setTimeout(
        createMeteor,
        500
    );

    setTimeout(
        createMeteor,
        1000
    );


    /* =================================================
       SPAWN LOOP
    ================================================= */

    const spawnTimer =
        setInterval(
            () => {

                if (
                    !document.hidden
                ) {

                    createMeteor();

                }

            },
            SPAWN_INTERVAL
        );


    /* =================================================
       HIDDEN TAB
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                const active =
                    container.querySelectorAll(
                        ".meteor-hitbox"
                    );


                active.forEach(
                    meteor => {

                        meteor.remove();

                    }
                );

            }

        }
    );


    /* =================================================
       RESIZE
    ================================================= */

    window.addEventListener(
        "resize",
        () => {

            /*
             * Nothing needs rebuilding.
             * Existing meteors continue moving.
             */

        },
        {
            passive: true
        }
    );


    console.log(
        "☄️ Ralkerie fast meteors ready."
    );

})();
