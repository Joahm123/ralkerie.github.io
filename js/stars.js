/* =====================================================
   RALKERIE STARS
   PERFORMANCE OPTIMIZED CANVAS VERSION

   - One canvas instead of 320 DOM elements
   - Much lower RAM usage
   - Much lower DOM overhead
   - Single animation loop
   - Automatically pauses when tab is hidden
===================================================== */

(() => {

    "use strict";

    const container = document.getElementById("stars");

    if (!container) {
        console.error("Ralkerie: #stars not found.");
        return;
    }

    /* =================================================
       CANVAS
    ================================================= */

    const canvas = document.createElement("canvas");

    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";

    container.appendChild(canvas);

    const ctx = canvas.getContext("2d", {
        alpha: true
    });

    if (!ctx) {
        console.error("Ralkerie: Canvas unavailable.");
        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    const DESKTOP_STARS = 180;
    const MOBILE_STARS = 100;

    const stars = [];

    let width = 0;
    let height = 0;

    let dpr = 1;


    /* =================================================
       RESIZE
    ================================================= */

    function resizeCanvas() {

        width = window.innerWidth;
        height = window.innerHeight;

        /*
         * Limit DPR.

         * 4K/high-DPI displays can otherwise
         * make the canvas extremely expensive.
         */

        dpr = Math.min(
            window.devicePixelRatio || 1,
            1.5
        );

        canvas.width =
            Math.floor(width * dpr);

        canvas.height =
            Math.floor(height * dpr);

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    /* =================================================
       STAR COUNT
    ================================================= */

    const starCount =
        width <= 700
            ? MOBILE_STARS
            : DESKTOP_STARS;


    /* =================================================
       CREATE STARS
    ================================================= */

    function createStars() {

        stars.length = 0;

        for (
            let i = 0;
            i < starCount;
            i++
        ) {

            const size =
                Math.random() < 0.85
                    ? 1
                    : 2;


            let x;

            /*
             * Keep the same left-heavy
             * distribution.
             */

            if (
                Math.random() < 0.70
            ) {

                x =
                    Math.random() *
                    width *
                    0.55;

            } else {

                x =
                    Math.random() *
                    width;
            }


            const y =
                Math.random() *
                height;


            stars.push({

                x,

                y,

                size,

                speed:
                    10 +
                    Math.random() * 30,

                phase:
                    Math.random() *
                    Math.PI *
                    2,

                twinkle:
                    1 +
                    Math.random() * 2

            });
        }
    }


    /* =================================================
       DRAW STAR
    ================================================= */

    function drawStar(star, time) {

        const sparkle =
            0.65 +
            Math.sin(
                time *
                0.001 *
                star.twinkle +
                star.phase
            ) *
            0.25;


        ctx.globalAlpha =
            sparkle;


        /*
         * Small stars don't need expensive
         * gradients or multiple box shadows.
         */

        if (
            star.size <= 1
        ) {

            ctx.fillStyle =
                "#ffd8f4";

            ctx.fillRect(
                Math.round(star.x),
                Math.round(star.y),
                1,
                1
            );

        } else {

            ctx.fillStyle =
                "#ffffff";

            ctx.fillRect(
                Math.round(star.x),
                Math.round(star.y),
                2,
                2
            );

        }
    }


    /* =================================================
       ANIMATION
    ================================================= */

    let lastTime =
        performance.now();

    let animationFrame = null;


    function animate(time) {

        if (
            document.hidden
        ) {

            animationFrame = null;

            return;
        }


        let delta =
            (
                time -
                lastTime
            ) / 1000;


        lastTime = time;


        /*
         * Prevent huge jumps.
         */

        delta =
            Math.min(
                delta,
                0.05
            );


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        for (
            const star of stars
        ) {

            star.x +=
                star.speed *
                delta;


            if (
                star.x >
                width + 5
            ) {

                star.x = -5;

                star.y =
                    Math.random() *
                    height;
            }


            drawStar(
                star,
                time
            );
        }


        ctx.globalAlpha = 1;


        animationFrame =
            requestAnimationFrame(
                animate
            );
    }


    /* =================================================
       VISIBILITY
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            lastTime =
                performance.now();


            if (
                !document.hidden &&
                !animationFrame
            ) {

                animationFrame =
                    requestAnimationFrame(
                        animate
                    );
            }

        }
    );


    /* =================================================
       RESIZE
    ================================================= */

    let resizeTimer = null;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        resizeCanvas();

                        createStars();

                    },
                    150
                );

        },
        {
            passive: true
        }
    );


    /* =================================================
       START
    ================================================= */

    resizeCanvas();

    createStars();

    animationFrame =
        requestAnimationFrame(
            animate
        );


    console.log(
        "Ralkerie optimized stars loaded."
    );

})();
