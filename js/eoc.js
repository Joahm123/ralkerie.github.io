/* =====================================================
   RALKERIE — EYE OF CTHULHU EASTER EGG

   - Small eye button beside LIVE
   - Click to summon giant Eye of Cthulhu
   - Dashes around the entire screen
   - Bounces off screen edges
   - Faces the direction it is moving
   - Plays eoc.mp3
   - Automatically disappears
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

    const DASH_DURATION =
        2600;


    const MIN_SPEED =
        8;


    const MAX_SPEED =
        18;


    /*
     * Your PNG faces opposite the movement
     * direction, so we rotate it 180 degrees.
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
       START EYE
    ================================================= */

    function activateEye() {

        if (active) {

            return;
        }


        active =
            true;


        /* ---------------------------------------------
           RANDOM START POSITION
        --------------------------------------------- */

        const margin =
            120;


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
           RANDOM MOVEMENT
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
           RESET IMAGE ROTATION
        --------------------------------------------- */

        eyeImage.style.transform =
            "rotate(0deg)";


        /* ---------------------------------------------
           PLAY SOUND
        --------------------------------------------- */

        audio.currentTime =
            0;


        audio.play().catch(
            () => {}
        );


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

    function moveEye(
        time
    ) {

        if (!active) {

            return;
        }


        const delta =
            Math.min(
                time -
                lastTime,
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
           GET SIZE
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


            changeVerticalDirection();
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


            changeVerticalDirection();
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


            changeHorizontalDirection();
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


            changeHorizontalDirection();
        }


        /* ---------------------------------------------
           POSITION
        --------------------------------------------- */

        eye.style.left =
            `${x}px`;


        eye.style.top =
            `${y}px`;


        /* ---------------------------------------------
           FACE MOVEMENT DIRECTION
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
       CHANGE VERTICAL DIRECTION
    ================================================= */

    function changeVerticalDirection() {

        const speed =
            Math.max(
                Math.abs(vy),
                MIN_SPEED
            );


        vy =
            (
                Math.random() > 0.5
                    ? 1
                    : -1
            ) *
            speed;
    }


    /* =================================================
       CHANGE HORIZONTAL DIRECTION
    ================================================= */

    function changeHorizontalDirection() {

        const speed =
            Math.max(
                Math.abs(vx),
                MIN_SPEED
            );


        vx =
            (
                Math.random() > 0.5
                    ? 1
                    : -1
            ) *
            speed;
    }


    /* =================================================
       STOP
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


        /* ---------------------------------------------
           STOP AUDIO
        --------------------------------------------- */

        audio.pause();


        audio.currentTime =
            0;


        /* ---------------------------------------------
           HIDE
        --------------------------------------------- */

        eye.classList.remove(
            "active"
        );


        /* ---------------------------------------------
           RESET ROTATION
        --------------------------------------------- */

        eyeImage.style.transform =
            "rotate(0deg)";


        /* ---------------------------------------------
           RESET POSITION
        --------------------------------------------- */

        eye.style.left =
            "50%";


        eye.style.top =
            "50%";


        eye.style.transform =
            "translate(-50%, -50%) scale(0)";
    }


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
       BIG EYE CLICK
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
       PAGE VISIBILITY
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
