/* =====================================================
   RALKERIE — EYE OF CTHULHU EASTER EGG

   - Small eye button beside LIVE
   - Click to summon giant Eye of Cthulhu
   - Dashes around the entire screen
   - Changes direction at screen edges
   - Restarts eoc.mp3 on every new dash
   - Eye faces movement direction
   - ESC closes it
===================================================== */

(() => {

    "use strict";


    /* =================================================
       ELEMENTS
    ================================================= */

    const button =
        document.getElementById(
            "eoc-button"
        );

    const eye =
        document.getElementById(
            "eoc-easter-egg"
        );

    const eyeImage =
        eye
            ? eye.querySelector("img")
            : null;


    if (
        !button ||
        !eye ||
        !eyeImage
    ) {

        console.error(
            "Ralkerie EoC: required elements not found."
        );

        return;
    }


    /* =================================================
       AUDIO
    ================================================= */

    const audio =
        new Audio(
            "./assets/audio/eoc.mp3"
        );

    audio.preload = "auto";


    /* =================================================
       SETTINGS
    ================================================= */

    const DASH_DURATION = 10000;

    const MIN_SPEED = 10;

    const MAX_SPEED = 20;

    /*
     * PNG points opposite the movement direction.
     */
    const ROTATION_OFFSET = 180;


    /* =================================================
       STATE
    ================================================= */

    let active = false;

    let animationFrame = null;

    let endTimer = null;

    let x = 0;

    let y = 0;

    let vx = 0;

    let vy = 0;

    let lastTime = 0;


    /* =================================================
       PLAY DASH SOUND
    ================================================= */

    function playDashSound() {

        /*
         * Restart the sound every time
         * the Eye starts a new dash.
         */

        audio.pause();

        audio.currentTime = 0;

        audio.play().catch(
            () => {}
        );
    }


    /* =================================================
       CHOOSE RANDOM DIRECTION
    ================================================= */

    function chooseDirection() {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            MIN_SPEED +
            Math.random() *
            (
                MAX_SPEED -
                MIN_SPEED
            );

        vx =
            Math.cos(angle) *
            speed;

        vy =
            Math.sin(angle) *
            speed;

        /*
         * New direction = new dash sound.
         */

        playDashSound();
    }


    /* =================================================
       START
    ================================================= */

    function activateEye() {

        if (active) {
            return;
        }

        active = true;


        /* ---------------------------------------------
           RANDOM START
        --------------------------------------------- */

        const margin = 140;

        x =
            margin +
            Math.random() *
            Math.max(
                1,
                window.innerWidth -
                margin * 2
            );

        y =
            margin +
            Math.random() *
            Math.max(
                1,
                window.innerHeight -
                margin * 2
            );


        /* ---------------------------------------------
           FIRST DASH
        --------------------------------------------- */

        chooseDirection();


        /* ---------------------------------------------
           SHOW
        --------------------------------------------- */

        eye.classList.add(
            "active"
        );

        eye.style.left =
            `${x}px`;

        eye.style.top =
            `${y}px`;

        eye.style.transform =
            "translate(-50%, -50%) scale(1)";


        /* ---------------------------------------------
           START ANIMATION
        --------------------------------------------- */

        lastTime =
            performance.now();

        animationFrame =
            requestAnimationFrame(
                moveEye
            );


        /* ---------------------------------------------
           AUTO END
        --------------------------------------------- */

        clearTimeout(
            endTimer
        );

        endTimer =
            setTimeout(
                deactivateEye,
                DASH_DURATION
            );
    }


    /* =================================================
       MOVE
    ================================================= */

    function moveEye(time) {

        if (!active) {
            return;
        }


        const delta =
            Math.min(
                time - lastTime,
                40
            );

        lastTime =
            time;


        /* ---------------------------------------------
           MOVE
        --------------------------------------------- */

        x +=
            vx *
            delta /
            16.67;

        y +=
            vy *
            delta /
            16.67;


        /* ---------------------------------------------
           SIZE
        --------------------------------------------- */

        const width =
            eye.offsetWidth || 180;

        const height =
            eye.offsetHeight || 180;

        const halfWidth =
            width / 2;

        const halfHeight =
            height / 2;


        /* ---------------------------------------------
           WALL COLLISION
        --------------------------------------------- */

        let changedDirection = false;


        if (
            x <= halfWidth
        ) {

            x =
                halfWidth;

            vx =
                Math.abs(vx);

            changedDirection =
                true;
        }


        if (
            x >=
            window.innerWidth -
            halfWidth
        ) {

            x =
                window.innerWidth -
                halfWidth;

            vx =
                -Math.abs(vx);

            changedDirection =
                true;
        }


        if (
            y <= halfHeight
        ) {

            y =
                halfHeight;

            vy =
                Math.abs(vy);

            changedDirection =
                true;
        }


        if (
            y >=
            window.innerHeight -
            halfHeight
        ) {

            y =
                window.innerHeight -
                halfHeight;

            vy =
                -Math.abs(vy);

            changedDirection =
                true;
        }


        /*
         * If the Eye hit a wall, it just
         * changed direction.
         *
         * Restart the dash noise.
         */

        if (changedDirection) {

            playDashSound();
        }


        /* ---------------------------------------------
           POSITION
        --------------------------------------------- */

        eye.style.left =
            `${x}px`;

        eye.style.top =
            `${y}px`;


        /* ---------------------------------------------
           ROTATION
        --------------------------------------------- */

        const angle =
            Math.atan2(
                vy,
                vx
            ) *
            180 /
            Math.PI;


        eyeImage.style.transform =
            `rotate(${angle + ROTATION_OFFSET}deg)`;


        /* ---------------------------------------------
           NEXT FRAME
        --------------------------------------------- */

        animationFrame =
            requestAnimationFrame(
                moveEye
            );
    }


    /* =================================================
       STOP
    ================================================= */

    function deactivateEye() {

        active = false;


        clearTimeout(
            endTimer
        );

        endTimer = null;


        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;
        }


        /* ---------------------------------------------
           STOP SOUND
        --------------------------------------------- */

        audio.pause();

        audio.currentTime = 0;


        /* ---------------------------------------------
           HIDE
        --------------------------------------------- */

        eye.classList.remove(
            "active"
        );


        eyeImage.style.transform =
            "rotate(0deg)";


        eye.style.left =
            "50%";

        eye.style.top =
            "50%";

        eye.style.transform =
            "translate(-50%, -50%) scale(0)";
    }


    /* =================================================
       BUTTON
    ================================================= */

    button.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            activateEye();
        }
    );


    /* =================================================
       EYE CLICK
    ================================================= */

    eye.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            deactivateEye();
        }
    );


    /* =================================================
       ESCAPE
    ================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                active
            ) {

                deactivateEye();
            }
        }
    );


    /* =================================================
       RESIZE
    ================================================= */

    window.addEventListener(
        "resize",
        () => {

            if (!active) {
                return;
            }


            const width =
                eye.offsetWidth || 180;

            const height =
                eye.offsetHeight || 180;

            const halfWidth =
                width / 2;

            const halfHeight =
                height / 2;


            x =
                Math.max(
                    halfWidth,
                    Math.min(
                        x,
                        window.innerWidth -
                        halfWidth
                    )
                );


            y =
                Math.max(
                    halfHeight,
                    Math.min(
                        y,
                        window.innerHeight -
                        halfHeight
                    )
                );
        },
        {
            passive: true
        }
    );


    /* =================================================
       HIDDEN TAB
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden &&
                active
            ) {

                deactivateEye();
            }
        }
    );


    console.log(
        "Ralkerie Eye of Cthulhu easter egg ready."
    );

})();
