/* =====================================================
   RALKERIE
   FOUR-SIDED AUDIO VISUALIZER BORDER

   Bars wrap around the entire Discord box.

   TOP    → vertical bars
   RIGHT  → horizontal bars
   BOTTOM → vertical bars
   LEFT   → horizontal bars

   The bars continuously move up/down.
===================================================== */

(() => {

    "use strict";


    /* =================================================
       FIND WRAPPER
    ================================================= */

    const wrapper =
        document.getElementById(
            "waveform-wrapper"
        );


    if (!wrapper) {

        console.error(
            "Ralkerie: #waveform-wrapper not found."
        );

        return;
    }


    /* =================================================
       CREATE BORDER
    ================================================= */

    const border =
        document.createElement("div");


    border.className =
        "wave-border";


    wrapper.prepend(border);


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_WIDTH = 3;

    const BAR_GAP = 7;

    const MIN_HEIGHT = 4;

    const MAX_HEIGHT = 24;

    const SIDE_EXTRA = 18;


    const bars = [];


    /* =================================================
       RANDOM NUMBER
    ================================================= */

    function random(min, max) {

        return (
            Math.random() *
            (max - min)
        ) + min;
    }


    /* =================================================
       CREATE TOP BARS
    ================================================= */

    function createTopBars() {

        const width =
            wrapper.clientWidth;


        const count =
            Math.floor(
                width /
                (BAR_WIDTH + BAR_GAP)
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const bar =
                document.createElement("span");


            bar.className =
                "wave-bar top";


            const x =
                i *
                (BAR_WIDTH + BAR_GAP);


            bar.style.left =
                `${x}px`;


            bar.style.bottom =
                `${SIDE_EXTRA}px`;


            bar.style.height =
                `${MAX_HEIGHT}px`;


            border.appendChild(
                bar
            );


            bars.push({

                element: bar,

                side: "top",

                base: SIDE_EXTRA,

                phase:
                    Math.random() *
                    Math.PI *
                    2,

                speed:
                    random(
                        1.5,
                        4.5
                    ),

                amplitude:
                    random(
                        0.35,
                        1
                    )
            });
        }
    }


    /* =================================================
       CREATE BOTTOM BARS
    ================================================= */

    function createBottomBars() {

        const width =
            wrapper.clientWidth;


        const count =
            Math.floor(
                width /
                (BAR_WIDTH + BAR_GAP)
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const bar =
                document.createElement("span");


            bar.className =
                "wave-bar bottom";


            const x =
                i *
                (BAR_WIDTH + BAR_GAP);


            bar.style.left =
                `${x}px`;


            bar.style.top =
                `${SIDE_EXTRA}px`;


            bar.style.height =
                `${MAX_HEIGHT}px`;


            border.appendChild(
                bar
            );


            bars.push({

                element: bar,

                side: "bottom",

                base: SIDE_EXTRA,

                phase:
                    Math.random() *
                    Math.PI *
                    2,

                speed:
                    random(
                        1.5,
                        4.5
                    ),

                amplitude:
                    random(
                        0.35,
                        1
                    )
            });
        }
    }


    /* =================================================
       CREATE LEFT BARS
    ================================================= */

    function createLeftBars() {

        const height =
            wrapper.clientHeight;


        const count =
            Math.floor(
                height /
                (BAR_WIDTH + BAR_GAP)
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const bar =
                document.createElement("span");


            bar.className =
                "wave-bar left";


            const y =
                i *
                (BAR_WIDTH + BAR_GAP);


            bar.style.top =
                `${y}px`;


            bar.style.right =
                `${SIDE_EXTRA}px`;


            bar.style.width =
                `${MAX_HEIGHT}px`;


            border.appendChild(
                bar
            );


            bars.push({

                element: bar,

                side: "left",

                base: SIDE_EXTRA,

                phase:
                    Math.random() *
                    Math.PI *
                    2,

                speed:
                    random(
                        1.5,
                        4.5
                    ),

                amplitude:
                    random(
                        0.35,
                        1
                    )
            });
        }
    }


    /* =================================================
       CREATE RIGHT BARS
    ================================================= */

    function createRightBars() {

        const height =
            wrapper.clientHeight;


        const count =
            Math.floor(
                height /
                (BAR_WIDTH + BAR_GAP)
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const bar =
                document.createElement("span");


            bar.className =
                "wave-bar right";


            const y =
                i *
                (BAR_WIDTH + BAR_GAP);


            bar.style.top =
                `${y}px`;


            bar.style.left =
                `${SIDE_EXTRA}px`;


            bar.style.width =
                `${MAX_HEIGHT}px`;


            border.appendChild(
                bar
            );


            bars.push({

                element: bar,

                side: "right",

                base: SIDE_EXTRA,

                phase:
                    Math.random() *
                    Math.PI *
                    2,

                speed:
                    random(
                        1.5,
                        4.5
                    ),

                amplitude:
                    random(
                        0.35,
                        1
                    )
            });
        }
    }


    /* =================================================
       BUILD
    ================================================= */

    function buildVisualizer() {

        border.innerHTML = "";

        bars.length = 0;


        createTopBars();

        createRightBars();

        createBottomBars();

        createLeftBars();
    }


    /* =================================================
       ANIMATION
    ================================================= */

    let startTime =
        performance.now();


    function animate(time) {

        const elapsed =
            (
                time -
                startTime
            ) / 1000;


        for (
            const bar of bars
        ) {

            const wave =
                (
                    Math.sin(
                        elapsed *
                        bar.speed +
                        bar.phase
                    ) +
                    1
                ) / 2;


            const secondWave =
                (
                    Math.sin(
                        elapsed *
                        2.7 +
                        bar.phase *
                        1.7
                    ) +
                    1
                ) / 2;


            /*
               Combine two waves so
               the bars don't all move
               in exactly the same way.
            */

            const amount =
                (
                    wave *
                    0.7 +
                    secondWave *
                    0.3
                );


            const height =
                MIN_HEIGHT +
                (
                    MAX_HEIGHT -
                    MIN_HEIGHT
                ) *
                amount *
                bar.amplitude;


            /* =================================================
               TOP
            ================================================== */

            if (
                bar.side === "top"
            ) {

                bar.element.style.height =
                    `${height}px`;

                bar.element.style.transform =
                    `translateY(${-height}px)`;
            }


            /* =================================================
               BOTTOM
            ================================================== */

            else if (
                bar.side === "bottom"
            ) {

                bar.element.style.height =
                    `${height}px`;

                bar.element.style.transform =
                    `translateY(${height}px)`;
            }


            /* =================================================
               LEFT
            ================================================== */

            else if (
                bar.side === "left"
            ) {

                bar.element.style.width =
                    `${height}px`;

                bar.element.style.transform =
                    `translateX(${-height}px)`;
            }


            /* =================================================
               RIGHT
            ================================================== */

            else if (
                bar.side === "right"
            ) {

                bar.element.style.width =
                    `${height}px`;

                bar.element.style.transform =
                    `translateX(${height}px)`;
            }

        }


        requestAnimationFrame(
            animate
        );
    }


    /* =================================================
       RESIZE
    ================================================= */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        buildVisualizer();

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

    buildVisualizer();


    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie four-sided waveform loaded."
    );


})();
