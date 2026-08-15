/* =====================================================
   RALKERIE — EYE OF CTHULHU EASTER EGG

   - Small button summons Eye
   - Eye dashes around screen
   - Bounces off edges
   - eoc.mp3 plays on every new dash
   - Eye faces movement direction
   - Clicking Eye creates pixel burst
   - Clicking Eye plays eockill.mp3
   - Kill sound plays once per kill
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


    if (!button || !eye) {

        console.error(
            "Ralkerie EoC: missing required elements."
        );

        return;
    }


    const eyeImage =
        eye.querySelector("img");


    if (!eyeImage) {

        console.error(
            "Ralkerie EoC: Eye image not found."
        );

        return;
    }


    /* =================================================
       HITBOX
    ================================================= */

    eye.style.pointerEvents =
        "auto";

    eye.style.cursor =
        "pointer";

    eyeImage.style.pointerEvents =
        "none";


    /* =================================================
       DASH AUDIO
    ================================================= */

    const dashAudio =
        new Audio(
            "./assets/audio/eoc.mp3"
        );

    dashAudio.preload =
        "auto";


    /* =================================================
       KILL AUDIO
    ================================================= */

    const killAudio =
        new Audio(
            "./assets/audio/eockill.mp3"
        );

    killAudio.preload =
        "auto";


    /* =================================================
       SETTINGS
    ================================================= */

    const DASH_DURATION =
        10000;

    const MIN_SPEED =
        10;

    const MAX_SPEED =
        20;

    /*
     * The PNG faces backwards by default.
     */
    const ROTATION_OFFSET =
        180;


    /* =================================================
       STATE
    ================================================= */

    let active =
        false;

    let animationFrame =
        null;

    let endTimer =
        null;

    let x =
        0;

    let y =
        0;

    let vx =
        0;

    let vy =
        0;

    let lastTime =
        0;


    /* =================================================
       PLAY DASH SOUND
    ================================================= */

    function playDashSound() {

        dashAudio.pause();

        dashAudio.currentTime =
            0;

        dashAudio.play().catch(
            () => {}
        );
    }


    /* =================================================
       PLAY KILL SOUND
    ================================================= */

    function playKillSound() {

        /*
         * Stop the dash sound immediately.
         */

        dashAudio.pause();

        dashAudio.currentTime =
            0;


        /*
         * Restart kill sound from
         * the beginning.
         */

        killAudio.pause();

        killAudio.currentTime =
            0;

        killAudio.play().catch(
            () => {}
        );
    }


    /* =================================================
       CHOOSE DIRECTION
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


        playDashSound();
    }


    /* =================================================
       HIT BURST
    ================================================= */

    function createHitBurst() {

        const burst =
            document.createElement(
                "div"
            );


        burst.className =
            "eoc-hit-burst";


        burst.style.left =
            `${x}px`;

        burst.style.top =
            `${y}px`;


        document.body.appendChild(
            burst
        );


        const particleCount =
            32;


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const particle =
                document.createElement(
                    "span"
                );


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


            particle.style.setProperty(
                "--dx",
                `${Math.cos(angle) * distance}px`
            );


            particle.style.setProperty(
                "--dy",
                `${Math.sin(angle) * distance}px`
            );


            const size =
                3 +
                Math.random() *
                8;


            particle.style.width =
                `${size}px`;

            particle.style.height =
                `${size}px`;


            particle.style.animationDuration =
                `${450 + Math.random() * 300}ms`;


            burst.appendChild(
                particle
            );
        }


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


        active =
            true;


        const margin =
            150;


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


        chooseDirection();


        eye.classList.add(
            "active"
        );


        eye.style.left =
            `${x}px`;

        eye.style.top =
            `${y}px`;

        eye.style.transform =
            "translate(-50%, -50%) scale(1)";


        lastTime =
            performance.now();


        animationFrame =
            requestAnimationFrame(
                moveEye
            );


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


        x +=
            vx *
            delta /
            16.67;


        y +=
            vy *
            delta /
            16.67;


        const width =
            eye.offsetWidth ||
            220;


        const height =
            eye.offsetHeight ||
            220;


        const halfWidth =
            width / 2;

        const halfHeight =
            height / 2;


        let changedDirection =
            false;


        /* ---------------------------------------------
           LEFT WALL
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
           RIGHT WALL
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
           TOP WALL
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
           BOTTOM WALL
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


        /*
         * New direction = new dash sound.
         */

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

        active =
            false;


        clearTimeout(
            endTimer
        );


        endTimer =
            null;


        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame =
                null;
        }


        dashAudio.pause();

        dashAudio.currentTime =
            0;


        eye.classList.remove(
            "active"
        );


        eye.style.left =
            "50%";

        eye.style.top =
            "50%";


        eye.style.transform =
            "translate(-50%, -50%) scale(0)";


        eyeImage.style.transform =
            "rotate(0deg)";
    }


    /* =================================================
       CLICK EYE — KILL
    ================================================= */

    eye.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (!active) {

                return;
            }


            /*
             * Create impact effect.
             */

            createHitBurst();


            /*
             * Play kill sound.
             */

            playKillSound();


            /*
             * Remove Eye.
             */

            deactivateEye();
        }
    );


    /* =================================================
       SUMMON BUTTON
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
                220;


            const height =
                eye.offsetHeight ||
                220;


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
        "Ralkerie Eye of Cthulhu kill system ready."
    );

})();
