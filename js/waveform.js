/* =====================================================
   RALKERIE WAVEFORM
   PERFORMANCE OPTIMIZED

   - ~20 updates/sec instead of 60+
   - Uses transform instead of width/height
   - Fewer bars
   - No continuous layout recalculation
   - Pauses when tab is hidden
   - Automatically rebuilds when Discord changes
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_SIZE = 3;

    const GAP = 6;

    const MIN_SIZE = 0.25;

    const MAX_SIZE = 9;

    /*
     * 50ms = 20 updates/sec.
     *
     * Visually still looks animated,
     * but massively reduces CPU usage.
     */

    const UPDATE_INTERVAL = 50;


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


    let currentWrapper = null;

    let bars = [];

    let lastUpdate = 0;

    let animationFrame = null;

    let startTime =
        performance.now();


    /* =================================================
       CREATE SIDE
    ================================================= */

    function createSide(side) {

        const element =
            document.createElement(
                "div"
            );

        element.className =
            `wave-side wave-side-${side}`;

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
         * Position only once.
         *
         * We never change left/top
         * during animation.
         */

        if (
            side === "top" ||
            side === "bottom"
        ) {

            bar.style.left =
                `${position}px`;

        } else {

            bar.style.top =
                `${position}px`;

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
                1.2 +
                Math.random() *
                1.8,

            strength:
                0.65 +
                Math.random() *
                0.35

        };
    }


    /* =================================================
       BUILD BARS
    ================================================= */

    function buildBars(wrapper) {

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
         * Clear old bars.
         */

        top.replaceChildren();

        bottom.replaceChildren();

        left.replaceChildren();

        right.replaceChildren();


        bars = [];


        const width =
            wrapper.clientWidth;

        const height =
            wrapper.clientHeight;


        /* =================================================
           TOP + BOTTOM
        ================================================= */

        for (
            let x = 0;
            x < width;
            x += BAR_SIZE + GAP
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
        ================================================= */

        for (
            let y = 0;
            y < height;
            y += BAR_SIZE + GAP
        ) {

            bars.push(
                createBar(
                    left,
                    "left",
                    y
                )
            );

            bars.push(
                createBar(
                    right,
                    "right",
                    y
                )
            );
        }


        console.log(
            "Optimized waveform bars:",
            bars.length
        );
    }


    /* =================================================
       ATTACH WAVEFORM
    ================================================= */

    function attachWaveform(card) {

        if (!card) {
            return;
        }


        /*
         * Already attached.
         */

        if (
            card.parentElement &&
            card.parentElement.classList.contains(
                "waveform-wrapper"
            )
        ) {

            currentWrapper =
                card.parentElement;

            return;
        }


        /*
         * Remove old waveform.
         */

        if (
            currentWrapper &&
            currentWrapper.parentNode
        ) {

            currentWrapper.remove();

        }


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "waveform-wrapper";


        /* =================================================
           FOUR SIDES
        ================================================= */

        const top =
            createSide("top");

        const bottom =
            createSide("bottom");

        const left =
            createSide("left");

        const right =
            createSide("right");


        wrapper.appendChild(top);

        wrapper.appendChild(bottom);

        wrapper.appendChild(left);

        wrapper.appendChild(right);


        /*
         * Put wrapper in container.
         */

        container.appendChild(
            wrapper
        );


        /*
         * Put Discord card inside.
         */

        wrapper.appendChild(
            card
        );


        currentWrapper =
            wrapper;


        /*
         * Wait until dimensions exist.
         */

        requestAnimationFrame(
            () => {

                if (
                    currentWrapper === wrapper
                ) {

                    buildBars(
                        wrapper
                    );

                }

            }
        );
    }


    /* =================================================
       FIND DISCORD CARD
    ================================================= */

    function findCard() {

        const card =
            container.querySelector(
                ".discord-live-card"
            );


        if (!card) {

            return;

        }


        attachWaveform(
            card
        );
    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(time) {

        animationFrame = null;


        /*
         * Completely stop processing
         * while tab is hidden.
         */

        if (
            document.hidden
        ) {

            return;

        }


        /*
         * Throttle animation.

         * Browser may call rAF at 60fps,
         * but we only actually update
         * the bars every 50ms.
         */

        if (
            time - lastUpdate <
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


        /*
         * Animate bars.
         */

        for (
            const data
            of bars
        ) {

            const wave =
                (
                    Math.sin(
                        elapsed *
                        data.speed +
                        data.phase
                    ) +
                    1
                ) * 0.5;


            const secondary =
                (
                    Math.sin(
                        elapsed *
                        3 +
                        data.phase
                    ) +
                    1
                ) * 0.5;


            const value =
                wave * 0.75 +
                secondary * 0.25;


            /*
             * Scale rather than changing
             * width/height.

             * This avoids layout work.
             */

            const scale =
                MIN_SIZE +
                value *
                MAX_SIZE *
                data.strength;


            const bar =
                data.element;


            if (
                data.side === "top"
            ) {

                bar.style.transform =
                    `scaleY(${scale})`;

            }

            else if (
                data.side === "bottom"
            ) {

                bar.style.transform =
                    `scaleY(${scale})`;

            }

            else if (
                data.side === "left"
            ) {

                bar.style.transform =
                    `scaleX(${scale})`;

            }

            else {

                bar.style.transform =
                    `scaleX(${scale})`;

            }
        }


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
                            currentWrapper
                        ) {

                            buildBars(
                                currentWrapper
                            );

                        }

                    },
                    250
                );

        },
        {
            passive: true
        }
    );


    /* =================================================
       DISCORD OBSERVER
    ================================================= */

    const observer =
        new MutationObserver(
            () => {

                /*
                 * Don't rebuild constantly.
                 */

                clearTimeout(
                    observer.timer
                );


                observer.timer =
                    setTimeout(
                        findCard,
                        100
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
       INITIAL
    ================================================= */

    findCard();


    /*
     * Discord loads asynchronously,
     * so check briefly.
     */

    let attempts = 0;


    const finder =
        setInterval(
            () => {

                attempts++;

                findCard();


                if (
                    currentWrapper ||
                    attempts >= 100
                ) {

                    clearInterval(
                        finder
                    );

                }

            },
            250
        );


    /* =================================================
       START
    ================================================= */

    animationFrame =
        requestAnimationFrame(
            animate
        );


    console.log(
        "Ralkerie optimized waveform ready."
    );

})();
