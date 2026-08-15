/* =====================================================
   RALKERIE — EYE OF CTHULHU EASTER EGG

   - Small eye button
   - Click to summon Eye of Cthulhu
   - Eye dashes around the screen
   - Bounces off screen edges
   - Plays eoc.mp3 on every new direction
   - Eye faces movement direction
   - Clicking the moving eye creates a pixel burst
   - ESC closes it
===================================================== */

(() => {

    "use strict";


    /* =================================================
       ELEMENTS
    ================================================= */

    const button =
        document.getElementById("eoc-button");

    const eye =
        document.getElementById("eoc-easter-egg");

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
     * Your PNG faces opposite the movement
     * direction.
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
       DASH SOUND
    ================================================= */

    function playDashSound() {

        audio.pause();

        audio.currentTime = 0;

        audio.play().catch(() => {});
    }


    /* =================================================
       RANDOM DIRECTION
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
         * Every new dash starts the sound.
         */
        playDashSound();
    }


    /* =================================================
       HIT BURST
    ================================================= */

    function createHitBurst() {

        const burst =
            document.createElement("div");


        burst.className =
            "eoc-hit-burst";


        /*
         * Spawn exactly where the Eye
         * currently is.
         */

        burst.style.left =
            `${x}px`;

        burst.style.top =
            `${y}px`;


        document.body.appendChild(
            burst
        );


        /*
         * Create pixel particles.
         */

        const particleCount = 32;


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const particle =
                document.createElement("span");


            particle.className =
                "eoc-hit-particle";


            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                45 +
                Math.random() *
                150;


            const dx =
                Math.cos(angle) *
                distance;


            const dy =
                Math.sin(angle) *
                distance;


            particle.style.setProperty(
                "--dx",
                `${dx}px`
            );


            particle.style.setProperty(
                "--dy",
                `${dy}px`
            );


            const size =
                3 +
                Math.random() *
                8;


            particle.style.width =
                `${size}px`;


            particle.style.height =
                `${size}px`;


            /*
             * Slightly different speeds.
             */

            particle.style.animationDuration =
                `${450 + Math.random() * 300}ms`;


            burst.appendChild(
                particle
            );
        }


        /*
         * Remove the burst after
         * the animation finishes.
         */

        setTimeout(
            () => {

                if (
                    burst.parentNode
                ) {

                    burst.remove();
                }

            },
            800
        );
    }


    /* =================================================
       ACTIVATE
    ================================================= */

    function activateEye() {

        if (active) {

            return;
        }


        active = true;


        /* ---------------------------------------------
           RANDOM START POSITION
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


        eyeImage.style.transform =
            "rotate(0deg)";


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
       MOVE EYE
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
            eye.offsetWidth ||
            180;


        const height =
            eye.offsetHeight ||
            180;


        const halfWidth =
            width / 2;


        const halfHeight =
            height / 2;


        let changedDirection =
            false;


        /* ---------------------------------------------
           LEFT
        --------------------------------------------- */

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


        /* ---------------------------------------------
           RIGHT
        --------------------------------------------- */

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


        /* ---------------------------------------------
           TOP
        --------------------------------------------- */

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


        /* ---------------------------------------------
           BOTTOM
        --------------------------------------------- */

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


        /* ---------------------------------------------
           NEW DASH SOUND
        --------------------------------------------- */

        if (
            changedDirection
        ) {

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
       DEACTIVATE
    ================================================= */

    function deactivateEye() {

        active = false;


        clearTimeout(
            endTimer
        );


        endTimer = null;


        if (
            animationFrame
        ) {

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
       EYE CLICK
    ================================================= */

    eye.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            /*
             * Make the burst BEFORE hiding
             * the Eye so it appears exactly
             * at its current position.
             */

            if (active) {

                createHitBurst();
            }


            deactivateEye();
        }
    );


    /* =================================================
       BUTTON CLICK
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
                eye.offsetWidth ||
                180;


            const height =
                eye.offsetHeight ||
                180;


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


    /* =================================================
       READY
    ================================================= */

    console.log(
        "Ralkerie Eye of Cthulhu easter egg ready."
    );

})();
