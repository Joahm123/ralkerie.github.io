/* =====================================================
   RALKERIE WAVEFORM
   FOUR-SIDED BOX EQUALIZER

   The waveform automatically attaches itself
   to .discord-live-card.

   Every side gets its OWN bar container.

   TOP:
       bars grow upward

   BOTTOM:
       bars grow downward

   LEFT:
       bars grow left

   RIGHT:
       bars grow right
===================================================== */

(() => {

    "use strict";


    console.log(
        "Ralkerie waveform starting..."
    );


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_WIDTH = 3;

    const BAR_HEIGHT = 3;

    const GAP = 4;

    const MIN_SIZE = 3;

    const MAX_SIZE = 28;


    /* =================================================
       FIND DISCORD CONTAINER
    ================================================= */

    const container =
        document.getElementById(
            "discord-card-container"
        );


    if (!container) {

        console.error(
            "Ralkerie waveform: Discord container not found."
        );

        return;
    }


    /* =================================================
       CURRENT WRAPPER
    ================================================= */

    let currentWrapper = null;


    /* =================================================
       CREATE WAVEFORM
    ================================================= */

    function attachWaveform(card) {

        if (!card) {
            return;
        }


        /*
         * Already wrapped.
         */

        if (
            card.parentElement &&
            card.parentElement.classList.contains(
                "waveform-wrapper"
            )
        ) {

            return;
        }


        /*
         * Remove old wrapper if Discord
         * replaced its contents.
         */

        if (
            currentWrapper &&
            currentWrapper.parentElement
        ) {

            currentWrapper.remove();

            currentWrapper = null;
        }


        /* =================================================
           WRAPPER
        ================================================= */

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "waveform-wrapper";


        /* =================================================
           BORDER
        ================================================= */

        const border =
            document.createElement(
                "div"
            );


        border.className =
            "wave-border";


        /* =================================================
           FOUR SIDES
        ================================================= */

        const top =
            createSide(
                "top"
            );


        const bottom =
            createSide(
                "bottom"
            );


        const left =
            createSide(
                "left"
            );


        const right =
            createSide(
                "right"
            );


        border.appendChild(
            top
        );

        border.appendChild(
            bottom
        );

        border.appendChild(
            left
        );

        border.appendChild(
            right
        );


        wrapper.appendChild(
            border
        );


        /*
         * Move Discord card into wrapper.
         */

        container.appendChild(
            wrapper
        );


        wrapper.appendChild(
            card
        );


        currentWrapper =
            wrapper;


        /*
         * Build bars after the browser
         * knows the card dimensions.
         */

        requestAnimationFrame(
            () => {

                buildBars(
                    top,
                    bottom,
                    left,
                    right,
                    wrapper
                );

            }
        );


        console.log(
            "Ralkerie waveform attached to Discord card."
        );
    }


    /* =================================================
       CREATE SIDE
    ================================================= */

    function createSide(
        side
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "wave-side wave-side-" +
            side;


        return element;
    }


    /* =================================================
       CREATE BAR
    ================================================= */

    function createBar(
        parent,
        side,
        position
    ) {

        const bar =
            document.createElement(
                "span"
            );


        bar.className =
            "wave-bar";


        /*
         * Horizontal sides.
         */

        if (
            side === "top" ||
            side === "bottom"
        ) {

            bar.style.left =
                `${position}px`;

            bar.style.width =
                `${BAR_WIDTH}px`;

            bar.style.height =
                `${MIN_SIZE}px`;
        }


        /*
         * Vertical sides.
         */

        else {

            bar.style.top =
                `${position}px`;

            bar.style.height =
                `${BAR_HEIGHT}px`;

            bar.style.width =
                `${MIN_SIZE}px`;
        }


        parent.appendChild(
            bar
        );


        return {

            element: bar,

            side: side,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                1.5 +
                Math.random() *
                3,

            strength:
                0.65 +
                Math.random() *
                0.35
        };
    }


    /* =================================================
       BUILD ALL BARS
    ================================================= */

    function buildBars(
        top,
        bottom,
        left,
        right,
        wrapper
    ) {

        /*
         * Clear old bars.
         */

        top.innerHTML = "";

        bottom.innerHTML = "";

        left.innerHTML = "";

        right.innerHTML = "";


        const width =
            wrapper.clientWidth;


        const height =
            wrapper.clientHeight;


        const bars = [];


        /* =================================================
           TOP
        ================================================= */

        for (
            let x = 0;
            x < width;
            x +=
                BAR_WIDTH +
                GAP
        ) {

            bars.push(
                createBar(
                    top,
                    "top",
                    x
                )
            );
        }


        /* =================================================
           BOTTOM
        ================================================= */

        for (
            let x = 0;
            x < width;
            x +=
                BAR_WIDTH +
                GAP
        ) {

            bars.push(
                createBar(
                    bottom,
                    "bottom",
                    x
                )
            );
        }


        /* =================================================
           LEFT
        ================================================= */

        for (
            let y = 0;
            y < height;
            y +=
                BAR_HEIGHT +
                GAP
        ) {

            bars.push(
                createBar(
                    left,
                    "left",
                    y
                )
            );
        }


        /* =================================================
           RIGHT
        ================================================= */

        for (
            let y = 0;
            y < height;
            y +=
                BAR_HEIGHT +
                GAP
        ) {

            bars.push(
                createBar(
                    right,
                    "right",
                    y
                )
            );
        }


        /*
         * Save bars on wrapper.
         */

        wrapper._waveBars =
            bars;


        console.log(
            "Waveform bars:",
            bars.length
        );
    }


    /* =================================================
       ANIMATION
    ================================================= */

    let startTime =
        performance.now();


    function animate(
        time
    ) {

        const elapsed =
            (
                time -
                startTime
            ) / 1000;


        if (
            currentWrapper &&
            currentWrapper._waveBars
        ) {

            for (
                const data
                of currentWrapper._waveBars
            ) {

                /*
                 * Main wave.
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
                 * Secondary wave.
                 */

                const secondary =
                    (
                        Math.sin(
                            elapsed *
                            4 +
                            data.phase *
                            1.7
                        ) +
                        1
                    ) / 2;


                /*
                 * Combine waves.
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
                 * Calculate size.
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


                /* =========================================
                   TOP
                ========================================= */

                if (
                    data.side === "top"
                ) {

                    bar.style.height =
                        `${size}px`;
                }


                /* =========================================
                   BOTTOM
                ========================================= */

                else if (
                    data.side === "bottom"
                ) {

                    bar.style.height =
                        `${size}px`;
                }


                /* =========================================
                   LEFT
                ========================================= */

                else if (
                    data.side === "left"
                ) {

                    bar.style.width =
                        `${size}px`;
                }


                /* =========================================
                   RIGHT
                ========================================= */

                else if (
                    data.side === "right"
                ) {

                    bar.style.width =
                        `${size}px`;
                }

            }
        }


        requestAnimationFrame(
            animate
        );
    }


    /* =================================================
       FIND CARD
    ================================================= */

    function findCard() {

        const card =
            container.querySelector(
                ".discord-live-card"
            );


        if (!card) {

            return false;
        }


        attachWaveform(
            card
        );


        return true;
    }


    /* =================================================
       OBSERVE DISCORD

       Discord.js can replace the card dynamically.
       This catches that and reconnects the waveform.
    ================================================= */

    const observer =
        new MutationObserver(
            () => {

                findCard();

            }
        );


    observer.observe(
        container,
        {
            childList: true,
            subtree: true
        }
    );


    /* =================================================
       INITIAL ATTEMPT
    ================================================= */

    findCard();


    /* =================================================
       KEEP TRYING FOR DISCORD LOAD
    ================================================= */

    let attempts = 0;


    const finder =
        setInterval(
            () => {

                attempts++;


                if (
                    findCard()
                ) {

                    clearInterval(
                        finder
                    );

                    return;
                }


                if (
                    attempts > 100
                ) {

                    clearInterval(
                        finder
                    );

                }

            },
            100
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

                        if (
                            currentWrapper &&
                            currentWrapper._waveBars
                        ) {

                            const top =
                                currentWrapper.querySelector(
                                    ".wave-side-top"
                                );


                            const bottom =
                                currentWrapper.querySelector(
                                    ".wave-side-bottom"
                                );


                            const left =
                                currentWrapper.querySelector(
                                    ".wave-side-left"
                                );


                            const right =
                                currentWrapper.querySelector(
                                    ".wave-side-right"
                                );


                            if (
                                top &&
                                bottom &&
                                left &&
                                right
                            ) {

                                buildBars(
                                    top,
                                    bottom,
                                    left,
                                    right,
                                    currentWrapper
                                );

                            }

                        }

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

    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie waveform ready."
    );

})();
