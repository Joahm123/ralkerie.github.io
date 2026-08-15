/* =====================================================
   RALKERIE
   FOUR-SIDED BAR VISUALIZER

   The bars form a frame around the Discord card.

             ↑ ↑ ↑ ↑ ↑ ↑ ↑
          ┌─────────────────┐
       ←  │                 │  →
       ←  │   DISCORD CARD  │  →
       ←  │                 │  →
          └─────────────────┘
             ↓ ↓ ↓ ↓ ↓ ↓ ↓

   Every bar pulses independently.
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

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


    const border =
        document.createElement("div");


    border.className =
        "wave-border";


    wrapper.insertBefore(
        border,
        wrapper.firstChild
    );


    /* =================================================
       CONFIG
    ================================================= */

    const BAR_SIZE = 3;

    const BAR_GAP = 6;

    const MIN_LENGTH = 3;

    const MAX_LENGTH = 24;

    const GAP_FROM_CARD = 5;


    let bars = [];


    /* =================================================
       CREATE BAR
    ================================================= */

    function makeBar(
        side,
        position
    ) {

        const bar =
            document.createElement("span");


        bar.className =
            `wave-bar ${side}`;


        if (
            side === "top" ||
            side === "bottom"
        ) {

            bar.style.width =
                `${BAR_SIZE}px`;

            bar.style.height =
                `${MAX_LENGTH}px`;

            bar.style.left =
                `${position}px`;

        } else {

            bar.style.height =
                `${BAR_SIZE}px`;

            bar.style.width =
                `${MAX_LENGTH}px`;

            bar.style.top =
                `${position}px`;
        }


        border.appendChild(
            bar
        );


        bars.push({

            element: bar,

            side: side,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                1.5 +
                Math.random() * 3,

            amount:
                0.5 +
                Math.random() * 0.5
        });
    }


    /* =================================================
       BUILD
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
            Math.floor(
                width /
                (BAR_SIZE + BAR_GAP)
            );


        for (
            let i = 0;
            i < topCount;
            i++
        ) {

            makeBar(
                "top",
                i *
                (BAR_SIZE + BAR_GAP)
            );
        }


        /* =================================================
           BOTTOM
        ================================================= */

        const bottomCount =
            Math.floor(
                width /
                (BAR_SIZE + BAR_GAP)
            );


        for (
            let i = 0;
            i < bottomCount;
            i++
        ) {

            makeBar(
                "bottom",
                i *
                (BAR_SIZE + BAR_GAP)
            );
        }


        /* =================================================
           LEFT
        ================================================= */

        const leftCount =
            Math.floor(
                height /
                (BAR_SIZE + BAR_GAP)
            );


        for (
            let i = 0;
            i < leftCount;
            i++
        ) {

            makeBar(
                "left",
                i *
                (BAR_SIZE + BAR_GAP)
            );
        }


        /* =================================================
           RIGHT
        ================================================= */

        const rightCount =
            Math.floor(
                height /
                (BAR_SIZE + BAR_GAP)
            );


        for (
            let i = 0;
            i < rightCount;
            i++
        ) {

            makeBar(
                "right",
                i *
                (BAR_SIZE + BAR_GAP)
            );
        }


        /* =================================================
           POSITION THE FRAME

           This is what makes it actually wrap
           around the Discord card.
        ================================================= */

        border.style.left =
            `${-GAP_FROM_CARD}px`;

        border.style.right =
            `${-GAP_FROM_CARD}px`;

        border.style.top =
            `${-GAP_FROM_CARD}px`;

        border.style.bottom =
            `${-GAP_FROM_CARD}px`;
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

            /*
               Main wave.
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
               Secondary wave makes
               the movement less uniform.
            */

            const wave2 =
                (
                    Math.sin(
                        elapsed *
                        2.3 +
                        data.phase *
                        1.4
                    ) +
                    1
                ) / 2;


            const combined =
                (
                    wave *
                    0.7
                ) +
                (
                    wave2 *
                    0.3
                );


            const length =
                MIN_LENGTH +
                (
                    MAX_LENGTH -
                    MIN_LENGTH
                ) *
                combined *
                data.amount;


            /* =================================================
               TOP

               Bars grow UP from the card.
            ================================================== */

            if (
                data.side === "top"
            ) {

                data.element.style.height =
                    `${length}px`;

                data.element.style.bottom =
                    `${GAP_FROM_CARD}px`;

                data.element.style.transform =
                    "translateY(0)";
            }


            /* =================================================
               BOTTOM

               Bars grow DOWN from the card.
            ================================================== */

            else if (
                data.side === "bottom"
            ) {

                data.element.style.height =
                    `${length}px`;

                data.element.style.top =
                    `${GAP_FROM_CARD}px`;

                data.element.style.transform =
                    "translateY(0)";
            }


            /* =================================================
               LEFT

               Bars grow LEFT.
            ================================================== */

            else if (
                data.side === "left"
            ) {

                data.element.style.width =
                    `${length}px`;

                data.element.style.right =
                    `${GAP_FROM_CARD}px`;

                data.element.style.transform =
                    "translateX(0)";
            }


            /* =================================================
               RIGHT

               Bars grow RIGHT.
            ================================================== */

            else if (
                data.side === "right"
            ) {

                data.element.style.width =
                    `${length}px`;

                data.element.style.left =
                    `${GAP_FROM_CARD}px`;

                data.element.style.transform =
                    "translateX(0)";
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
