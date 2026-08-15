/* =====================================================
   RALKERIE — EYE OF CTHULHU EASTER EGG
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
        eye?.querySelector("img");


    if (!button || !eye || !eyeImage) {

        console.error(
            "Ralkerie EoC: required elements not found."
        );

        return;
    }


    /* =================================================
       AUDIO

       CHANGE THIS IF YOUR MP3 HAS A DIFFERENT NAME
    ================================================= */

    const audio =
        new Audio(
            "./assets/audio/eoc.mp3"
        );

    audio.preload = "auto";


    /* =================================================
       SETTINGS
    ================================================= */

    const DASH_DURATION = 2600;

    const MIN_SPEED = 8;

    const MAX_SPEED = 18;


    let active = false;

    let animationFrame = null;

    let endTimer = null;

    let x = 0;

    let y = 0;

    let vx = 0;

    let vy = 0;

    let lastTime = 0;


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
           START IN RANDOM AREA
        --------------------------------------------- */

        const margin = 100;


        x =
            margin +
            Math.random() *
            (
                window.innerWidth -
                margin * 2
            );


        y =
            margin +
            Math.random() *
            (
                window.innerHeight -
                margin * 2
            );


        chooseDirection();


        /* ---------------------------------------------
           SHOW
        --------------------------------------------- */

        eye.classList.add("active");


        eye.style.left =
            `${x}px`;

        eye.style.top =
            `${y}px`;


        eye.style.transform =
            "translate(-50%, -50%) scale(1)";


        /* ---------------------------------------------
           AUDIO
        --------------------------------------------- */

        audio.currentTime = 0;

        audio.play().catch(() => {});


        /* ---------------------------------------------
           START MOVEMENT
        --------------------------------------------- */

        lastTime =
            performance.now();


        animationFrame =
            requestAnimationFrame(
                moveEye
            );


        /* ---------------------------------------------
           END
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
       MOVEMENT
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


        /*
         * Convert velocity to frame movement.
         */

        x +=
            vx *
            delta /
            16.67;


        y +=
            vy *
            delta /
            16.67;


        /*
         * Eye dimensions.
         */

        const width =
            eye.offsetWidth ||
            180;

        const height =
            eye.offsetHeight ||
            180;


        /*
         * Bounce around the ENTIRE screen.
         */

        if (
            x <= width / 2
        ) {

            x =
                width / 2;

            vx =
                Math.abs(vx);

            chooseVerticalDirection();
        }


        if (
            x >=
            window.innerWidth -
            width / 2
        ) {

            x =
                window.innerWidth -
                width / 2;

            vx =
                -Math.abs(vx);

            chooseVerticalDirection();
        }


        if (
            y <= height / 2
        ) {

            y =
                height / 2;

            vy =
                Math.abs(vy);

            chooseHorizontalDirection();
        }


        if (
            y >=
            window.innerHeight -
            height / 2
        ) {

            y =
                window.innerHeight -
                height / 2;

            vy =
                -Math.abs(vy);

            chooseHorizontalDirection();
        }


        eye.style.left =
            `${x}px`;

        eye.style.top =
            `${y}px`;


        /*
         * Rotate toward movement.
         */

        const angle =
            Math.atan2(
                vy,
                vx
            ) *
            180 /
            Math.PI;


        eyeImage.style.transform =
            `rotate(${angle}deg)`;


        animationFrame =
            requestAnimationFrame(
                moveEye
            );
    }


    /* =================================================
       DIRECTION HELPERS
    ================================================= */

    function chooseVerticalDirection() {

        const speed =
            Math.abs(vy);


        vy =
            (
                Math.random() > 0.5
                    ? 1
                    : -1
            ) *
            Math.max(
                speed,
                MIN_SPEED
            );
    }


    function chooseHorizontalDirection() {

        const speed =
            Math.abs(vx);


        vx =
            (
                Math.random() > 0.5
                    ? 1
                    : -1
            ) *
            Math.max(
                speed,
                MIN_SPEED
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


        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;
        }


        audio.pause();

        audio.currentTime = 0;


        eye.classList.remove(
            "active"
        );


        eyeImage.style.transform =
            "rotate(0deg)";


        /*
         * Reset position after hiding.
         */

        eye.style.left =
            "50%";

        eye.style.top =
            "50%";

        eye.style.transform =
            "translate(-50%, -50%) scale(0)";
    }


    /* =================================================
       CLICK
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
       ALSO ALLOW CLICKING THE BIG EYE
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
       RESIZE SAFETY
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


            x =
                Math.max(
                    width / 2,
                    Math.min(
                        x,
                        window.innerWidth -
                        width / 2
                    )
                );


            y =
                Math.max(
                    height / 2,
                    Math.min(
                        y,
                        window.innerHeight -
                        height / 2
                    )
                );

        },
        {
            passive: true
        }
    );


    console.log(
        "Ralkerie Eye of Cthulhu easter egg ready."
    );

})();
