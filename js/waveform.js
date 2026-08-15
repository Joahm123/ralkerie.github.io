/* =====================================================
   RALKERIE WAVEFORM
   FOUR-SIDED BAR FRAME
===================================================== */

(() => {

    "use strict";


    const wrapper =
        document.getElementById(
            "waveform-wrapper"
        );


    if (!wrapper) {

        console.error(
            "Ralkerie waveform: wrapper not found."
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


    wrapper.insertBefore(
        border,
        wrapper.firstChild
    );


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_WIDTH = 3;

    const BAR_GAP = 5;

    const MIN_SIZE = 3;

    const MAX_SIZE = 27;

    const OUTSIDE_GAP = 5;


    let bars = [];


    /* =================================================
       CREATE BAR
    ================================================= */

    function createBar(
        side,
        position
    ) {

        const bar =
            document.createElement("span");


        bar.className =
            "wave-bar";


        border.appendChild(
            bar
        );


        bars.push({

            element: bar,

            side: side,

            position: position,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                1.5 +
                Math.random() * 2.5,

            strength:
                0.65 +
                Math.random() * 0.35
        });
    }


    /* =================================================
       BUILD FRAME
    ================================================= */

    function build() {

        border.innerHTML = "";

        bars = [];


        const width =
            wrapper.clientWidth;


        const height =
            wrapper.clientHeight;


        /* =================================================
           TOP
        ================================================= */

        const topCount =
            Math.ceil(
                width /
                (
                    BAR_WIDTH +
                    BAR_GAP
                )
            );


        for (
            let i = 0;
            i < topCount;
            i++
        ) {

            createBar(
                "top",
                i *
                (
                    BAR_WIDTH +
                    BAR_GAP
                )
            );
        }


        /* =================================================
           BOTTOM
        ================================================= */

        const bottomCount =
            Math.ceil(
                width /
                (
                    BAR_WIDTH +
                    BAR_GAP
                )
            );


        for (
            let i = 0;
            i < bottomCount;
            i++
        ) {

            createBar(
                "bottom",
                i *
                (
                    BAR_WIDTH +
                    BAR_GAP
                )
            );
        }


        /* =================================================
           LEFT
        ================================================= */

        const leftCount =
            Math.ceil(
                height /
                (
                    BAR_WIDTH +
                    BAR_GAP
                )
            );


        for (
            let i = 0;
            i < leftCount;
            i++
        ) {

            createBar(
                "left",
                i *
                (
                    BAR_WIDTH +
                    BAR_GAP
                )
            );
        }


        /* =================================================
           RIGHT
        ================================================= */

        const rightCount =
            Math.ceil(
                height /
                (
                    BAR_WIDTH +
                    BAR_GAP
                )
            );


        for (
            let i = 0;
            i < rightCount;
            i++
        ) {

            createBar(
                "right",
                i *
                (
                    BAR_WIDTH +
                    BAR_GAP
                )
            );
        }


        /* =================================================
           POSITION
        ================================================= */

        for (
            const data of bars
        ) {

            const bar =
                data.element;


            if (
                data.side === "top"
            ) {

                bar.style.left =
                    `${data.position}px`;

                bar.style.bottom =
                    `${OUTSIDE_GAP}px`;

                bar.style.width =
                    `${BAR_WIDTH}px`;

                bar.style.height =
                    `${MIN_SIZE}px`;
            }


            else if (
                data.side === "bottom"
            ) {

                bar.style.left =
                    `${data.position}px`;

                bar.style.top =
                    `${OUTSIDE_GAP}px`;

                bar.style.width =
                    `${BAR_WIDTH}px`;

                bar.style.height =
                    `${MIN_SIZE}px`;
            }


            else if (
                data.side === "left"
            ) {

                bar.style.top =
                    `${data.position}px`;

                bar.style.right =
                    `${OUTSIDE_GAP}px`;

                bar.style.height =
                    `${BAR_WIDTH}px`;

                bar.style.width =
                    `${MIN_SIZE}px`;
            }


            else if (
                data.side === "right"
            ) {

                bar.style.top =
                    `${data.position}px`;

                bar.style.left =
                    `${OUTSIDE_GAP}px`;

                bar.style.height =
                    `${BAR_WIDTH}px`;

                bar.style.width =
                    `${MIN_SIZE}px`;
            }
        }
    }


    /* =================================================
       ANIMATION
    ================================================= */

    const start =
        performance.now();


    function animate(time) {

        const elapsed =
            (
                time -
                start
            ) / 1000;


        for (
            const data of bars
        ) {

            const primary =
                (
                    Math.sin(
                        elapsed *
                        data.speed +
                        data.phase
                    ) +
                    1
                ) / 2;


            const secondary =
                (
                    Math.sin(
                        elapsed *
                        3.1 +
                        data.phase *
                        1.7
                    ) +
                    1
                ) / 2;


            const value =
                (
                    primary *
                    0.75
                ) +
                (
                    secondary *
                    0.25
                );


            const size =
                MIN_SIZE +
                (
                    MAX_SIZE -
                    MIN_SIZE
                ) *
                value *
                data.strength;


            const bar =
                data.element;


            if (
                data.side === "top" ||
                data.side === "bottom"
            ) {

                bar.style.height =
                    `${size}px`;
            }


            else {

                bar.style.width =
                    `${size}px`;
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
                    build,
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

    build();

    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie waveform loaded."
    );

})();
