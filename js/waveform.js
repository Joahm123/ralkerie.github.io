/* =====================================================
   RALKERIE WAVEFORM
   WRAPS AROUND DISCORD CARD
===================================================== */

(() => {

    "use strict";


    const canvas =
        document.getElementById(
            "waveform-canvas"
        );


    if (!canvas) {

        console.error(
            "Ralkerie: waveform canvas missing."
        );

        return;
    }


    const ctx =
        canvas.getContext("2d");


    if (!ctx) {

        console.error(
            "Ralkerie: waveform context failed."
        );

        return;
    }


    let width = 0;
    let height = 0;

    let dpr = 1;

    let time = 0;

    let lastTime =
        performance.now();


    /* =================================================
       RESIZE
    ================================================= */

    function resize() {

        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        const rect =
            canvas.getBoundingClientRect();


        width =
            rect.width;


        height =
            rect.height;


        canvas.width =
            width * dpr;


        canvas.height =
            height * dpr;


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

    }


    window.addEventListener(
        "resize",
        resize
    );


    resize();


    /* =================================================
       WAVE FUNCTION
    ================================================= */

    function waveY(
        x,
        center
    ) {

        const wave1 =
            Math.sin(
                x * 0.035 +
                time * 3
            );


        const wave2 =
            Math.sin(
                x * 0.085 -
                time * 4.2
            );


        const wave3 =
            Math.sin(
                x * 0.16 +
                time * 2.1
            );


        const wave4 =
            Math.sin(
                x * 0.3 -
                time * 5
            );


        const combined =
            (
                wave1 * 0.45 +
                wave2 * 0.27 +
                wave3 * 0.18 +
                wave4 * 0.10
            );


        return center +
            combined * 55;

    }


    /* =================================================
       DRAW WAVE
    ================================================= */

    function draw() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        const center =
            height / 2;


        /*
         * Pink glowing waveform
         */

        ctx.beginPath();


        for (
            let x = 0;
            x <= width;
            x += 3
        ) {

            const y =
                waveY(
                    x,
                    center
                );


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
            "rgba(255, 45, 181, 0.9)";


        ctx.lineWidth = 5;

        ctx.shadowBlur = 18;

        ctx.shadowColor =
            "#ff2db5";

        ctx.stroke();


        /*
         * White thin center
         */

        ctx.beginPath();


        for (
            let x = 0;
            x <= width;
            x += 3
        ) {

            const y =
                waveY(
                    x,
                    center
                );


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

        ctx.lineWidth = 1.5;

        ctx.shadowBlur = 8;

        ctx.shadowColor =
            "#ff72cf";

        ctx.stroke();


        /*
         * Second quieter waveform
         */

        ctx.beginPath();


        for (
            let x = 0;
            x <= width;
            x += 3
        ) {

            const y =
                center +
                Math.sin(
                    x * 0.045 -
                    time * 2.5
                ) *
                25;


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

        ctx.lineWidth = 1;

        ctx.shadowBlur = 0;

        ctx.stroke();

    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(now) {

        let delta =
            (now - lastTime) / 1000;


        lastTime =
            now;


        if (delta > 0.05) {

            delta = 0.05;
        }


        if (!document.hidden) {

            time += delta;

            draw();

        }


        requestAnimationFrame(
            animate
        );

    }


    document.addEventListener(
        "visibilitychange",
        () => {

            lastTime =
                performance.now();

        }
    );


    draw();


    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie waveform loaded."
    );

})();
