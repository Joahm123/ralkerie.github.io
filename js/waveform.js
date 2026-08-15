/* =====================================================
   RALKERIE OSU-STYLE WAVEFORM
   ANIMATED PINK + WHITE
===================================================== */

(() => {

    "use strict";


    /* =================================================
       CANVAS
    ================================================= */

    const canvas =
        document.getElementById(
            "waveform-canvas"
        );


    if (!canvas) {

        console.error(
            "Ralkerie: #waveform-canvas not found."
        );

        return;
    }


    const ctx =
        canvas.getContext("2d");


    if (!ctx) {

        console.error(
            "Ralkerie: Could not create waveform canvas."
        );

        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    let width = 0;

    let height = 0;

    let centerY = 0;

    let devicePixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    let time = 0;


    /* =================================================
       RESIZE
    ================================================= */

    function resize() {

        devicePixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        width =
            window.innerWidth;


        height =
            window.innerHeight;


        centerY =
            height / 2;


        canvas.width =
            width *
            devicePixelRatio;


        canvas.height =
            height *
            devicePixelRatio;


        canvas.style.width =
            width + "px";


        canvas.style.height =
            height + "px";


        ctx.setTransform(
            devicePixelRatio,
            0,
            0,
            devicePixelRatio,
            0,
            0
        );

    }


    window.addEventListener(
        "resize",
        resize,
        {
            passive: true
        }
    );


    resize();


    /* =================================================
       WAVEFORM
    ================================================= */

    function drawWaveform() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /*
         * The waveform is strongest around
         * the center and fades toward the
         * edges.
         */

        const amplitude =
            Math.min(
                75,
                height * 0.09
            );


        const spacing = 5;


        /*
         * Pink glow
         */

        ctx.save();


        ctx.beginPath();


        for (
            let x = 0;
            x <= width;
            x += spacing
        ) {

            const normalized =
                x / width;


            /*
             * Multiple sine waves create
             * irregular audio-like movement.
             */

            const wave1 =
                Math.sin(
                    x * 0.025 +
                    time * 2.5
                );


            const wave2 =
                Math.sin(
                    x * 0.061 -
                    time * 3.7
                );


            const wave3 =
                Math.sin(
                    x * 0.11 +
                    time * 1.8
                );


            const wave4 =
                Math.sin(
                    x * 0.17 -
                    time * 4.2
                );


            /*
             * Combine the waves.
             */

            let wave =
                (
                    wave1 * 0.45 +
                    wave2 * 0.25 +
                    wave3 * 0.18 +
                    wave4 * 0.12
                );


            /*
             * Make the waveform stronger
             * around the center.
             */

            const edgeFade =
                Math.sin(
                    normalized *
                    Math.PI
                );


            wave *=
                edgeFade;


            const y =
                centerY +
                wave *
                amplitude;


            if (x === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );
            }

        }


        ctx.strokeStyle =
            "rgba(255, 61, 189, 0.65)";


        ctx.lineWidth =
            5;


        ctx.shadowBlur =
            18;


        ctx.shadowColor =
            "rgba(255, 61, 189, 0.9)";


        ctx.stroke();


        ctx.restore();


        /* =================================================
           WHITE CORE
        ================================================== */

        ctx.save();


        ctx.beginPath();


        for (
            let x = 0;
            x <= width;
            x += spacing
        ) {

            const normalized =
                x / width;


            const wave1 =
                Math.sin(
                    x * 0.025 +
                    time * 2.5
                );


            const wave2 =
                Math.sin(
                    x * 0.061 -
                    time * 3.7
                );


            const wave3 =
                Math.sin(
                    x * 0.11 +
                    time * 1.8
                );


            const wave4 =
                Math.sin(
                    x * 0.17 -
                    time * 4.2
                );


            let wave =
                (
                    wave1 * 0.45 +
                    wave2 * 0.25 +
                    wave3 * 0.18 +
                    wave4 * 0.12
                );


            const edgeFade =
                Math.sin(
                    normalized *
                    Math.PI
                );


            wave *=
                edgeFade;


            const y =
                centerY +
                wave *
                amplitude;


            if (x === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );
            }

        }


        ctx.strokeStyle =
            "#ffffff";


        ctx.lineWidth =
            1.2;


        ctx.shadowBlur =
            7;


        ctx.shadowColor =
            "#ff72cf";


        ctx.stroke();


        ctx.restore();


        /* =================================================
           SECOND PINK LINE
        ================================================== */

        ctx.save();


        ctx.beginPath();


        for (
            let x = 0;
            x <= width;
            x += spacing
        ) {

            const normalized =
                x / width;


            const wave =
                Math.sin(
                    x * 0.032 -
                    time * 2.8
                ) *
                Math.sin(
                    normalized *
                    Math.PI
                );


            const y =
                centerY +
                wave *
                amplitude *
                0.55;


            if (x === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );
            }

        }


        ctx.strokeStyle =
            "rgba(255, 114, 207, 0.35)";


        ctx.lineWidth =
            1;


        ctx.stroke();


        ctx.restore();

    }


    /* =================================================
       ANIMATION
    ================================================= */

    let lastTime =
        performance.now();


    function animate(currentTime) {

        let delta =
            (
                currentTime -
                lastTime
            ) / 1000;


        lastTime =
            currentTime;


        if (delta > 0.05) {

            delta = 0.05;
        }


        /*
         * Animation speed.
         */

        time +=
            delta;


        if (!document.hidden) {

            drawWaveform();

        }


        requestAnimationFrame(
            animate
        );

    }


    /* =================================================
       VISIBILITY FIX
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            lastTime =
                performance.now();

        }
    );


    /* =================================================
       START
    ================================================= */

    drawWaveform();


    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie waveform loaded."
    );

})();
