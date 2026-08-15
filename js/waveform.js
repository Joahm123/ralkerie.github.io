/* =====================================================
   RALKERIE WAVEFORM
   FOUR-SIDED EQUALIZER BORDER

   Bars are FLAT against the Discord box
   and pulse outward.
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
            "Ralkerie waveform: #waveform-wrapper not found."
        );

        return;
    }


    console.log(
        "Ralkerie waveform loaded."
    );


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_SIZE = 3;

    const BAR_GAP = 5;

    const MIN_SIZE = 3;

    const MAX_SIZE = 30;


    /* =================================================
       CREATE BORDER
    ================================================= */

    let border =
        wrapper.querySelector(
            ".wave-border"
        );


    if (!border) {

        border =
            document.createElement(
                "div"
            );

        border.className =
            "wave-border";


        wrapper.insertBefore(
            border,
            wrapper.firstChild
        );
    }


    /* =================================================
       BAR DATA
    ================================================= */

    let bars = [];


    /* =================================================
       CREATE BAR
    ================================================= */

    function createBar(
        side,
        position
    ) {

        const bar =
            document.createElement(
                "span"
            );


        /*
         * IMPORTANT:
         *
         * Gives each bar its direction class.
         *
         * wave-top
         * wave-bottom
         * wave-left
         * wave-right
         */

        bar.className =
            "wave-bar wave-" +
            side;


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
       BUILD WAVEFORM
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
                    BAR_SIZE +
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
                    BAR_SIZE +
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
                    BAR_SIZE +
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
                    BAR_SIZE +
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
                    BAR_SIZE +
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
                    BAR_SIZE +
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
                    BAR_SIZE +
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
                    BAR_SIZE +
                    BAR_GAP
                )
            );
        }


        /* =================================================
           POSITION BARS
        ================================================= */

        for (
            const data of bars
        ) {

            const bar =
                data.element;


            /* =============================================
               TOP

               Bottom edge of bar touches
               the top edge of the box.
            ============================================= */

            if (
                data.side === "top"
            ) {

                bar.style.left =
                    `${data.position}px`;

                bar.style.top =
                    "0px";

                bar.style.width =
                    `${BAR_SIZE}px`;

                bar.style.height =
                    `${MIN_SIZE}px`;
            }


            /* =============================================
               BOTTOM

               Top edge of bar touches
               bottom edge of box.
            ============================================= */

            else if (
                data.side === "bottom"
            ) {

                bar.style.left =
                    `${data.position}px`;

                bar.style.bottom =
                    "0px";

                bar.style.width =
                    `${BAR_SIZE}px`;

                bar.style.height =
                    `${MIN_SIZE}px`;
            }


            /* =============================================
               LEFT

               Right edge of bar touches
               left edge of box.
            ============================================= */

            else if (
                data.side === "left"
            ) {

                bar.style.top =
                    `${data.position}px`;

                bar.style.left =
                    "0px";

                bar.style.height =
                    `${BAR_SIZE}px`;

                bar.style.width =
                    `${MIN_SIZE}px`;
            }


            /* =============================================
               RIGHT

               Left edge of bar touches
               right edge of box.
            ============================================= */

            else if (
                data.side === "right"
            ) {

                bar.style.top =
                    `${data.position}px`;

                bar.style.right =
                    "0px";

                bar.style.height =
                    `${BAR_SIZE}px`;

                bar.style.width =
                    `${MIN_SIZE}px`;
            }

        }
    }


    /* =================================================
       ANIMATION
    ================================================= */

    const startTime =
        performance.now();


    function animate(
        currentTime
    ) {

        const elapsed =
            (
                currentTime -
                startTime
            ) / 1000;


        for (
            const data of bars
        ) {

            /*
             * Main waveform movement.
             */

            const wave =
                (
                    Math.sin(
                        elapsed *
                        data.speed +
                        data.phase
                    ) +
                    1
                ) / 2;


            /*
             * Smaller secondary movement.
             */

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


            /*
             * Combine both waves.
             */

            const value =
                (
                    wave *
                    0.75
                ) +
                (
                    secondary *
                    0.25
                );


            /*
             * Calculate bar size.
             */

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


            /* =============================================
               TOP / BOTTOM

               Height changes.

               Width stays flat.
            ============================================= */

            if (
                data.side === "top" ||
                data.side === "bottom"
            ) {

                bar.style.height =
                    `${size}px`;
            }


            /* =============================================
               LEFT / RIGHT

               Width changes.

               Height stays flat.
            ============================================= */

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

                        build();

                    },
                    150
                );

        },
        {
            passive: true
        }
    );


    /* =================================================
       INITIAL BUILD
    ================================================= */

    build();


    /* =================================================
       START ANIMATION
    ================================================= */

    requestAnimationFrame(
        animate
    );


})();
