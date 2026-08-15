/* =====================================================
   RALKERIE WAVEFORM
   DENSE + STABLE + LOW CPU

   - Wraps Discord card
   - Dense top/bottom waveform
   - Continuous left/right waveform
   - No flashing during Discord refresh
   - Transform-only animation
   - Pauses when tab is hidden
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_SIZE = 4;

    const GAP = 1;

    const MIN_SCALE = 0.15;

    const MAX_SCALE = 7;

    /*
     * Around 22 updates per second.
     */
    const UPDATE_INTERVAL = 45;


    /*
     * Vertical sides get their own spacing.
     *
     * This prevents holes down the left/right edges.
     */
    const VERTICAL_BAR_SIZE = 5;

    const VERTICAL_GAP = 0;


    /* =================================================
       CONTAINER
    ================================================= */

    const container =
        document.getElementById(
            "discord-card-container"
        );


    if (!container) {

        console.error(
            "Ralkerie waveform: container not found."
        );

        return;
    }


    let wrapper = null;

    let bars = [];

    let animationFrame = null;

    let lastUpdate = 0;

    let startTime =
        performance.now();


    /* =================================================
       CREATE SIDE
    ================================================= */

    function createSide(name) {

        const side =
            document.createElement(
                "div"
            );


        side.className =
            `wave-side wave-side-${name}`;


        return side;
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
         * Horizontal sides use left.
         */

        if (
            side === "top" ||
            side === "bottom"
        ) {

            bar.style.left =
                `${position}px`;

        }

        /*
         * Vertical sides use top.
         */

        else {

            bar.style.top =
                `${position}px`;
        }


        /*
         * Random values are generated
         * only once.
         *
         * They are NOT recreated every
         * Discord refresh.
         */

        const data = {

            element: bar,

            side: side,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                1.0 +
                Math.random() * 1.5,

            strength:
                0.65 +
                Math.random() * 0.35

        };


        parent.appendChild(
            bar
        );


        return data;
    }


    /* =================================================
       BUILD WAVEFORM
    ================================================= */

    function buildWaveform() {

        if (!wrapper) {
            return;
        }


        const top =
            wrapper.querySelector(
                ".wave-side-top"
            );


        const bottom =
            wrapper.querySelector(
                ".wave-side-bottom"
            );


        const left =
            wrapper.querySelector(
                ".wave-side-left"
            );


        const right =
            wrapper.querySelector(
                ".wave-side-right"
            );


        if (
            !top ||
            !bottom ||
            !left ||
            !right
        ) {

            return;
        }


        /*
         * VERY IMPORTANT:
         *
         * Do not rebuild the waveform when
         * Discord updates its card.
         */

        if (
            bars.length > 0
        ) {

            return;
        }


        const width =
            wrapper.clientWidth;


        const height =
            wrapper.clientHeight;


        if (
            width <= 0 ||
            height <= 0
        ) {

            return;
        }


        /* =================================================
           TOP + BOTTOM
        ================================================= */

        const horizontalStep =
            BAR_SIZE + GAP;


        for (
            let x = 0;
            x <= width;
            x += horizontalStep
        ) {

            bars.push(
                createBar(
                    top,
                    "top",
                    x
                )
            );


            bars.push(
                createBar(
                    bottom,
                    "bottom",
                    x
                )
            );
        }


        /* =================================================
           LEFT + RIGHT

           SPECIAL DENSE MODE

           These use a separate smaller step
           so there aren't gaps down the sides.
        ================================================= */

        const verticalStep =
            VERTICAL_BAR_SIZE +
            VERTICAL_GAP;


        for (
            let y = 0;
            y <= height;
            y += verticalStep
        ) {

            const leftBar =
                createBar(
                    left,
                    "left",
                    y
                );


            const rightBar =
                createBar(
                    right,
                    "right",
                    y
                );


            /*
             * Slight overlap between vertical bars.
             *
             * This removes visible holes.
             */

            leftBar.element.style.height =
                "5px";


            rightBar.element.style.height =
                "5px";


            bars.push(
                leftBar
            );


            bars.push(
                rightBar
            );
        }


        console.log(
            "Ralkerie waveform bars:",
            bars.length
        );
    }


    /* =================================================
       ATTACH WAVEFORM
    ================================================= */

    function attach() {

        const card =
            container.querySelector(
                ".discord-live-card"
            );


        if (!card) {
            return;
        }


        /*
         * If already wrapped,
         * leave EVERYTHING alone.
         */

        if (
            card.parentElement &&
            card.parentElement.classList.contains(
                "waveform-wrapper"
            )
        ) {

            wrapper =
                card.parentElement;


            /*
             * Only build if this is
             * a brand-new wrapper.
             */

            if (
                bars.length === 0
            ) {

                requestAnimationFrame(
                    buildWaveform
                );
            }


            return;
        }


        /*
         * If an old wrapper exists,
         * preserve the card.
         */

        const oldWrapper =
            container.querySelector(
                ".waveform-wrapper"
            );


        if (oldWrapper) {

            oldWrapper.replaceWith(
                card
            );
        }


        /* =================================================
           CREATE WRAPPER
        ================================================= */

        wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "waveform-wrapper";


        /* =================================================
           CREATE FOUR SIDES
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


        wrapper.appendChild(
            top
        );


        wrapper.appendChild(
            bottom
        );


        wrapper.appendChild(
            left
        );


        wrapper.appendChild(
            right
        );


        /*
         * Put wrapper into the container.
         */

        container.appendChild(
            wrapper
        );


        /*
         * Put Discord card inside wrapper.
         */

        wrapper.appendChild(
            card
        );


        bars = [];


        /*
         * Wait for browser layout.
         */

        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    buildWaveform
                );

            }
        );
    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(time) {

        animationFrame = null;


        /*
         * Don't animate hidden tabs.
         */

        if (
            document.hidden
        ) {

            return;
        }


        /*
         * Throttle actual waveform updates.
         */

        if (
            time -
            lastUpdate <
            UPDATE_INTERVAL
        ) {

            animationFrame =
                requestAnimationFrame(
                    animate
                );

            return;
        }


        lastUpdate =
            time;


        const elapsed =
            (
                time -
                startTime
            ) / 1000;


        /* =================================================
           ANIMATE BARS
        ================================================= */

        for (
            const data of bars
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
                ) * 0.5;


            /*
             * Secondary wave.
             */

            const secondary =
                (
                    Math.sin(
                        elapsed *
                        2.7 +
                        data.phase *
                        1.7
                    ) +
                    1
                ) * 0.5;


            /*
             * Combine waves.
             */

            const value =
                wave * 0.72 +
                secondary * 0.28;


            /*
             * Calculate size.
             */

            const scale =
                MIN_SCALE +
                value *
                MAX_SCALE *
                data.strength;


            /*
             * TOP + BOTTOM
             */

            if (
                data.side === "top" ||
                data.side === "bottom"
            ) {

                data.element.style.transform =
                    `scaleY(${scale})`;

            }


            /*
             * LEFT + RIGHT
             */

            else {

                data.element.style.transform =
                    `scaleX(${scale})`;

            }

        }


        animationFrame =
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

                        if (!wrapper) {
                            return;
                        }


                        /*
                         * Browser dimensions changed,
                         * so rebuild the positions.
                         */

                        bars = [];


                        const sides =
                            wrapper.querySelectorAll(
                                ".wave-side"
                            );


                        sides.forEach(
                            side => {

                                side.replaceChildren();

                            }
                        );


                        buildWaveform();

                    },
                    300
                );

        },
        {
            passive: true
        }
    );


    /* =================================================
       MUTATION OBSERVER
    ================================================= */

    let observerTimer = null;


    const observer =
        new MutationObserver(
            () => {

                clearTimeout(
                    observerTimer
                );


                observerTimer =
                    setTimeout(
                        () => {

                            const card =
                                container.querySelector(
                                    ".discord-live-card"
                                );


                            /*
                             * Only fix the wrapper if
                             * the actual card was moved.
                             *
                             * Normal Discord content
                             * changes do NOTHING here.
                             */

                            if (
                                card &&
                                (
                                    !wrapper ||
                                    card.parentElement !==
                                    wrapper
                                )
                            ) {

                                attach();

                            }

                        },
                        250
                    );

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
       VISIBILITY
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            startTime =
                performance.now();


            lastUpdate = 0;


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
       INITIAL ATTACH
    ================================================= */

    attach();


    /* =================================================
       DISCORD LOAD RETRY
    ================================================= */

    let attempts = 0;


    const finder =
        setInterval(
            () => {

                attempts++;


                attach();


                if (
                    wrapper ||
                    attempts >= 80
                ) {

                    clearInterval(
                        finder
                    );

                }

            },
            250
        );


    /* =================================================
       START ANIMATION
    ================================================= */

    animationFrame =
        requestAnimationFrame(
            animate
        );


    console.log(
        "Ralkerie dense continuous waveform ready."
    );

})();
