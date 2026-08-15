/* =====================================================
   RALKERIE WAVEFORM
   STABLE + LOW CPU

   - Wraps the Discord card correctly
   - No flashing
   - No rebuilding every Discord refresh
   - Smooth waveform
   - White/pink glow
   - Only transforms are animated
   - Pauses when tab is hidden
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_SIZE = 3;
    const GAP = 5;

    const MIN_SCALE = 0.15;
    const MAX_SCALE = 7;

    const UPDATE_INTERVAL = 45;


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
            document.createElement("div");

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
            document.createElement("span");

        bar.className =
            "wave-bar";


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
         * Random animation values are generated
         * ONCE and never regenerated.
         *
         * This prevents flashing.
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


        parent.appendChild(bar);

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
         * Only build if there are no bars.
         *
         * This is important.
         *
         * Discord refreshing must NOT
         * destroy and recreate the bars.
         */

        if (bars.length > 0) {
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


        const step =
            BAR_SIZE + GAP;


        /* =================================================
           TOP
        ================================================= */

        for (
            let x = 0;
            x <= width;
            x += step
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
            x <= width;
            x += step
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
            y <= height;
            y += step
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
            y <= height;
            y += step
        ) {

            bars.push(
                createBar(
                    right,
                    "right",
                    y
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

    function attach() {

        const card =
            container.querySelector(
                ".discord-live-card"
            );


        if (!card) {
            return;
        }


        /*
         * Already correctly wrapped.
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
             * Give the browser a frame to finish
             * sizing before creating bars.
             */

            if (bars.length === 0) {

                requestAnimationFrame(
                    buildWaveform
                );
            }

            return;
        }


        /*
         * Remove an old wrapper ONLY if it is
         * actually ours.
         */

        const oldWrapper =
            container.querySelector(
                ".waveform-wrapper"
            );


        if (oldWrapper) {

            /*
             * Preserve the card.
             */

            oldWrapper.replaceWith(card);
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
         * Put wrapper exactly where the card was.
         */

        container.appendChild(wrapper);

        wrapper.appendChild(card);


        bars = [];


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


        if (document.hidden) {
            return;
        }


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


        for (
            const data of bars
        ) {

            const wave =
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
                wave * 0.72 +
                secondary * 0.28;


            const scale =
                MIN_SCALE +
                value *
                MAX_SCALE *
                data.strength;


            /*
             * Top/bottom bars grow vertically.
             */

            if (
                data.side === "top" ||
                data.side === "bottom"
            ) {

                data.element.style.transform =
                    `scaleY(${scale})`;

            }

            /*
             * Left/right bars grow horizontally.
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

                        /*
                         * Rebuild only on actual
                         * browser resize.
                         *
                         * Discord refreshes won't
                         * cause this.
                         */

                        if (wrapper) {

                            bars = [];


                            const sides =
                                wrapper.querySelectorAll(
                                    ".wave-side"
                                );


                            sides.forEach(
                                side =>
                                    side.replaceChildren()
                            );


                            buildWaveform();
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
       MUTATION OBSERVER
    ================================================= */

    let observerTimer = null;


    const observer =
        new MutationObserver(
            () => {

                /*
                 * Discord updates the INSIDE
                 * of the card every 15 seconds.
                 *
                 * Never rebuild the waveform
                 * because of that.
                 */

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


                            if (
                                card &&
                                (!wrapper ||
                                card.parentElement !== wrapper)
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
       START
    ================================================= */

    attach();


    /*
     * Discord can appear asynchronously.
     */

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
        "Ralkerie stable waveform ready."
    );

})();
