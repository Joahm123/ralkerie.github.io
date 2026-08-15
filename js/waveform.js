/* =====================================================
   RALKERIE WAVEFORM
   LOW CPU + FULL EDGE COVERAGE

   - Keeps the existing wrapper
   - Covers the entire perimeter
   - No gaps around corners
   - ~20 updates/sec
   - Transform-only animation
   - Pauses when tab is hidden
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_SIZE = 3;

    /*
     * Smaller gap = fewer missing spots.
     */
    const GAP = 3;

    const STEP = BAR_SIZE + GAP;

    const MIN_SCALE = 0.35;

    const MAX_SCALE = 6;

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


    /* =================================================
       STATE
    ================================================= */

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
            document.createElement("div");

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
            document.createElement("span");


        bar.className =
            "wave-bar";


        /*
         * Position the bar once.
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


        /*
         * Random animation properties.
         */

        const data = {

            element: bar,

            side: side,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                1.4 +
                Math.random() *
                1.6,

            strength:
                0.75 +
                Math.random() *
                0.25

        };


        parent.appendChild(bar);

        return data;
    }


    /* =================================================
       BUILD BARS
    ================================================= */

    function buildBars(wrapper) {

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
         * Remove old bars.
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


        if (
            width <= 0 ||
            height <= 0
        ) {

            return;
        }


        /* =================================================
           TOP + BOTTOM
        ================================================= */

        for (
            let x = 0;
            x <= width;
            x += STEP
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


        /*
         * Force a final bar at the far right.
         *
         * This fixes the missing-end problem.
         */

        if (
            width % STEP !== 0
        ) {

            bars.push(
                createBar(
                    top,
                    "top",
                    Math.max(
                        0,
                        width - BAR_SIZE
                    )
                )
            );


            bars.push(
                createBar(
                    bottom,
                    "bottom",
                    Math.max(
                        0,
                        width - BAR_SIZE
                    )
                )
            );
        }


        /* =================================================
           LEFT + RIGHT
        ================================================= */

        for (
            let y = 0;
            y <= height;
            y += STEP
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


        /*
         * Force a final bar at the bottom.
         */

        if (
            height % STEP !== 0
        ) {

            bars.push(
                createBar(
                    left,
                    "left",
                    Math.max(
                        0,
                        height - BAR_SIZE
                    )
                )
            );


            bars.push(
                createBar(
                    right,
                    "right",
                    Math.max(
                        0,
                        height - BAR_SIZE
                    )
                )
            );
        }


        console.log(
            "Ralkerie waveform bars:",
            bars.length
        );
    }


    /* =================================================
       ATTACH
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

            currentWrapper =
                card.parentElement;

            /*
             * Rebuild in case the Discord
             * card changed size.
             */

            requestAnimationFrame(
                () => {

                    if (
                        currentWrapper
                        === card.parentElement
                    ) {

                        buildBars(
                            currentWrapper
                        );

                    }

                }
            );

            return;
        }


        /*
         * Remove an old wrapper if one exists.
         */

        if (
            currentWrapper &&
            currentWrapper.parentNode
        ) {

            currentWrapper.remove();
        }


        /* =================================================
           CREATE WRAPPER
        ================================================= */

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "waveform-wrapper";


        /* =================================================
           CREATE SIDES
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
         * Put wrapper into container.
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
         * Build after layout exists.
         */

        requestAnimationFrame(
            () => {

                if (
                    currentWrapper === wrapper
                ) {

                    buildBars(wrapper);

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


        attachWaveform(card);
    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(time) {

        animationFrame = null;


        /*
         * Stop completely when hidden.
         */

        if (
            document.hidden
        ) {

            return;
        }


        /*
         * 20 FPS update rate.
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


        /* =================================================
           ANIMATE BARS
        ================================================= */

        for (
            const data of bars
        ) {

            const primary =
                (
                    Math.sin(
                        elapsed *
                        data.speed +
                        data.phase
                    ) + 1
                ) * 0.5;


            const secondary =
                (
                    Math.sin(
                        elapsed *
                        2.7 +
                        data.phase *
                        1.7
                    ) + 1
                ) * 0.5;


            const value =
                primary * 0.78 +
                secondary * 0.22;


            const scale =
                MIN_SCALE +
                value *
                MAX_SCALE *
                data.strength;


            /*
             * Only transform changes.
             */

            if (
                data.side === "top" ||
                data.side === "bottom"
            ) {

                data.element.style.transform =
                    `scaleY(${scale})`;

            } else {

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
                    300
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

                clearTimeout(
                    observer.timer
                );


                observer.timer =
                    setTimeout(
                        findCard,
                        150
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
     * Discord loads asynchronously.
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
        "Ralkerie waveform ready."
    );

})();
