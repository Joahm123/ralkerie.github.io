/* =====================================================
   RALKERIE STARS
   PERFORMANCE OPTIMIZED CANVAS VERSION

   - 350 desktop stars
   - 180 mobile stars
   - One canvas instead of hundreds of DOM elements
   - Low RAM usage
   - Low CPU usage
   - Low GPU usage
   - Left-heavy distribution
   - Stars continuously move right
   - Automatically pauses when tab is hidden
===================================================== */

(() => {

    "use strict";


    /* =================================================
       STAR CONTAINER
    ================================================= */

    const container =
        document.getElementById(
            "stars"
        );


    if (!container) {

        console.error(
            "Ralkerie: #stars not found."
        );

        return;
    }


    /* =================================================
       CANVAS
    ================================================= */

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.style.position =
        "absolute";

    canvas.style.inset =
        "0";

    canvas.style.width =
        "100%";

    canvas.style.height =
        "100%";

    canvas.style.pointerEvents =
        "none";


    container.appendChild(
        canvas
    );


    const ctx =
        canvas.getContext(
            "2d",
            {
                alpha: true
            }
        );


    if (!ctx) {

        console.error(
            "Ralkerie: Canvas unavailable."
        );

        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    const DESKTOP_STARS = 350;

    const MOBILE_STARS = 180;


    /*
     * Maximum device pixel ratio.

     * Prevents 4K / high-DPI screens
     * from making the canvas unnecessarily
     * expensive.
     */

    const MAX_DPR = 1.5;


    const stars = [];


    let width = 0;

    let height = 0;

    let dpr = 1;


    /* =================================================
       RESIZE CANVAS
    ================================================= */

    function resizeCanvas() {

        width =
            window.innerWidth;


        height =
            window.innerHeight;


        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                MAX_DPR
            );


        canvas.width =
            Math.floor(
                width * dpr
            );


        canvas.height =
            Math.floor(
                height * dpr
            );


        canvas.style.width =
            `${width}px`;


        canvas.style.height =
            `${height}px`;


        /*
         * Draw using normal CSS-pixel
         * coordinates.
         */

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

    function getStarCount() {

        if (
            width <= 700
        ) {

            return MOBILE_STARS;

        }


        return DESKTOP_STARS;
    }


    /* =================================================
       CREATE STARS
    ================================================= */

    function createStars() {

        stars.length = 0;


        const count =
            getStarCount();


        for (
            let i = 0;
            i < count;
            i++
        ) {


            /* =============================================
               SIZE
            ============================================= */

            let size;


            const sizeRoll =
                Math.random();


            if (
                sizeRoll < 0.82
            ) {

                size = 1;

            }

            else if (
                sizeRoll < 0.97
            ) {

                size = 2;

            }

            else {

                size = 3;

            }


            /* =============================================
               X POSITION

               70% of stars stay in the
               left 55% of the screen.
            ============================================= */

            let x;


            if (
                Math.random() < 0.70
            ) {

                x =
                    Math.random() *
                    width *
                    0.55;

            }

            else {

                x =
                    Math.random() *
                    width;

            }


            /* =============================================
               Y POSITION
            ============================================= */

            const y =
                Math.random() *
                height;


            /* =============================================
               MOVEMENT
            ============================================= */

            const speed =
                10 +
                Math.random() *
                30;


            /* =============================================
               TWINKLE
            ============================================= */

            const phase =
                Math.random() *
                Math.PI *
                2;


            const twinkle =
                0.8 +
                Math.random() *
                1.8;


            /* =============================================
               STAR DATA
            ============================================= */

            stars.push({

                x: x,

                y: y,

                size: size,

                speed: speed,

                phase: phase,

                twinkle: twinkle

            });

        }

    }


    /* =================================================
       DRAW STAR
    ================================================= */

    function drawStar(
        star,
        time
    ) {


        /* =============================================
           TWINKLE

           Cheap math instead of CSS
           animation on hundreds of elements.
        ============================================= */

        const sparkle =
            0.55 +
            (
                Math.sin(
                    time *
                    0.001 *
                    star.twinkle +
                    star.phase
                ) *
                0.30
            );


        ctx.globalAlpha =
            sparkle;


        /* =============================================
           SMALL STAR
        ============================================= */

        if (
            star.size === 1
        ) {

            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(

                Math.round(
                    star.x
                ),

                Math.round(
                    star.y
                ),

                1,

                1
            );


            return;
        }


        /* =============================================
           MEDIUM STAR
        ============================================= */

        if (
            star.size === 2
        ) {

            ctx.fillStyle =
                "#ffd8f4";


            ctx.fillRect(

                Math.round(
                    star.x
                ),

                Math.round(
                    star.y
                ),

                2,

                2
            );


            /*
             * Tiny glow cross.

             * Only medium stars get this,
             * preventing expensive glow on
             * every particle.
             */

            ctx.globalAlpha =
                sparkle *
                0.35;


            ctx.fillRect(

                Math.round(
                    star.x
                ) - 1,

                Math.round(
                    star.y
                ),

                4,

                1
            );


            ctx.fillRect(

                Math.round(
                    star.x
                ),

                Math.round(
                    star.y
                ) - 1,

                1,

                4
            );


            return;
        }


        /* =============================================
           LARGE STAR
        ============================================= */

        ctx.fillStyle =
            "#ffffff";


        ctx.globalAlpha =
            sparkle;


        ctx.fillRect(

            Math.round(
                star.x
            ) - 1,

            Math.round(
                star.y
            ) - 1,

            3,

            3
        );


        /*
         * Small pixel sparkle.
         */

        ctx.globalAlpha =
            sparkle *
            0.4;


        ctx.fillRect(

            Math.round(
                star.x
            ) - 2,

            Math.round(
                star.y
            ),

            5,

            1
        );


        ctx.fillRect(

            Math.round(
                star.x
            ),

            Math.round(
                star.y
            ) - 2,

            1,

            5
        );

    }


    /* =================================================
       ANIMATION
    ================================================= */

    let lastTime =
        performance.now();


    let animationFrame =
        null;


    function animate(
        time
    ) {


        /* =============================================
           STOP COMPLETELY WHEN HIDDEN
        ============================================= */

        if (
            document.hidden
        ) {

            animationFrame =
                null;

            return;
        }


        /* =============================================
           DELTA TIME
        ============================================= */

        let delta =
            (
                time -
                lastTime
            ) / 1000;


        lastTime =
            time;


        /*
         * Prevent huge jumps after
         * lag or tab switching.
         */

        if (
            delta > 0.05
        ) {

            delta = 0.05;

        }


        /* =============================================
           CLEAR
        ============================================= */

        ctx.clearRect(

            0,

            0,

            width,

            height

        );


        /* =============================================
           UPDATE + DRAW
        ============================================= */

        for (
            const star of stars
        ) {


            /*
             * Move right.
             */

            star.x +=
                star.speed *
                delta;


            /*
             * Respawn on left.
             */

            if (
                star.x >
                width + 5
            ) {

                star.x =
                    -5;


                star.y =
                    Math.random() *
                    height;

            }


            /*
             * Draw.
             */

            drawStar(
                star,
                time
            );

        }


        ctx.globalAlpha =
            1;


        /* =============================================
           NEXT FRAME
        ============================================= */

        animationFrame =
            requestAnimationFrame(
                animate
            );

    }


    /* =================================================
       VISIBILITY CHANGE
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {


            /*
             * Reset time so stars don't
             * jump when returning.
             */

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

    let resizeTimer =
        null;


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
        `Ralkerie optimized stars loaded: ${stars.length} stars.`
    );

})();
