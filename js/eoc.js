/* =====================================================
   RALKERIE — EYE OF CTHULHU EASTER EGG

   - Small button summons Eye
   - Large invisible hitbox follows Eye
   - Eye dashes around screen
   - Bounces off edges
   - eoc.mp3 restarts every direction change
   - Eye faces movement direction
   - Clicking anywhere on Eye hitbox creates burst
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
            "Ralkerie EoC: missing #eoc-button or #eoc-easter-egg."
        );

        return;
    }


    /* =================================================
       IMAGE
    ================================================= */

    const eyeImage =
        eye.querySelector("img");


    if (!eyeImage) {

        console.error(
            "Ralkerie EoC: Eye image not found."
        );

        return;
    }


    /* =================================================
       FORCE HITBOX
    ================================================= */

    eye.style.pointerEvents =
        "auto";

    eye.style.cursor =
        "pointer";

    eyeImage.style.pointerEvents =
        "none";


    /* =================================================
       AUDIO
    ================================================= */

    const audio =
        new Audio(
            "./assets/audio/eoc.mp3"
        );

    audio.preload =
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
       SOUND
    ================================================= */

    function playDashSound() {

        audio.pause();

        audio.currentTime =
            0;

        audio.play().catch(
            () => {}
        );
    }


    /* =================================================
       NEW DIRECTION
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
       HIT EFFECT
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


        for (
            let i = 0;
            i < 32;
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
       START
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


        let changed =
            false;


        /* LEFT */

        if (
            x <= halfWidth
        ) {

            x =
                halfWidth;

            vx =
                Math.abs(vx);

            changed =
                true;
        }


        /* RIGHT */

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

            changed =
                true;
        }


        /* TOP */

        if (
            y <= halfHeight
        ) {

            y =
                halfHeight;

            vy =
                Math.abs(vy);

            changed =
                true;
        }


        /* BOTTOM */

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

            changed =
                true;
        }


        if (changed) {

            playDashSound();
        }


        /* POSITION */

        eye.style.left =
            `${x}px`;

        eye.style.top =
            `${y}px`;


        /* ROTATION */

        const angle =
            Math.atan2(
                vy,
                vx
            ) *
            180 /
            Math.PI;


        eyeImage.style.transform =
            `rotate(${angle + ROTATION_OFFSET}deg)`;


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


        audio.pause();

        audio.currentTime =
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
       EYE CLICK
    ================================================= */

    eye.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            if (!active) {

                return;
            }


            createHitBurst();

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


    console.log(
        "Ralkerie Eye of Cthulhu easter egg ready."
    );

})();
