/* =====================================================
   RALKERIE WAVEFORM
   CLEAN + LOW CPU VERSION

   - Does NOT resize the Discord card
   - Four-sided waveform
   - Individual visible bars
   - Smooth animation
   - ~20 visual updates/sec
   - Pauses when tab is hidden
   - Automatically handles Discord refreshing
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_WIDTH = 3;

    const BAR_GAP = 4;

    const MIN_HEIGHT = 2;

    const MAX_HEIGHT = 13;

    const UPDATE_INTERVAL = 50;


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
       STATE
    ================================================= */

    let currentCard = null;

    let waveform = null;

    let bars = [];

    let lastUpdate = 0;

    let startTime =
        performance.now();

    let animationFrame = null;

    let rebuildTimer = null;


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


        /* =============================================
           HORIZONTAL SIDES
        ============================================= */

        if (
            side === "top" ||
            side === "bottom"
        ) {

            bar.style.left =
                `${position}px`;

        }


        /* =============================================
           VERTICAL SIDES
        ============================================= */

        else {

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
                1.3 +
                Math.random() *
                1.7,

            strength:
                0.65 +
                Math.random() *
                0.35
        };
    }


    /* =================================================
       CREATE WAVEFORM
    ================================================= */

    function createWaveform() {

        if (!currentCard) {

            return;
        }


        /*
         * Remove previous waveform.
         */

        if (waveform) {

            waveform.remove();

            waveform = null;

        }


        /*
         * Make card the positioning reference.
         */

        if (
            getComputedStyle(
                currentCard
            ).position === "static"
        ) {

            currentCard.style.position =
                "relative";

        }


        /* =================================================
           WAVEFORM OVERLAY
        ================================================= */

        waveform =
            document.createElement(
                "div"
            );


        waveform.className =
            "discord-waveform-overlay";


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


        waveform.appendChild(
            top
        );


        waveform.appendChild(
            bottom
        );


        waveform.appendChild(
            left
        );


        waveform.appendChild(
            right
        );


        /*
         * IMPORTANT:
         *
         * The waveform is INSIDE the card,
         * but position:absolute means it
         * takes up ZERO layout space.
         */

        currentCard.appendChild(
            waveform
        );


        /*
         * Wait for dimensions.
         */

        requestAnimationFrame(
            () => {

                if (
                    currentCard
                ) {

                    buildBars();

                }

            }
        );
    }


    /* =================================================
       BUILD BARS
    ================================================= */

    function buildBars() {

        if (
            !currentCard ||
            !waveform
        ) {

            return;
        }


        const top =
            waveform.querySelector(
                ".wave-side-top"
            );


        const bottom =
            waveform.querySelector(
                ".wave-side-bottom"
            );


        const left =
            waveform.querySelector(
                ".wave-side-left"
            );


        const right =
            waveform.querySelector(
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
         * Remove existing bars.
         */

        top.replaceChildren();

        bottom.replaceChildren();

        left.replaceChildren();

        right.replaceChildren();


        bars = [];


        /*
         * Read card size once.
         */

        const width =
            currentCard.clientWidth;


        const height =
            currentCard.clientHeight;


        /* =================================================
           TOP + BOTTOM
        ================================================= */

        for (
            let x = 0;
            x < width;
            x += BAR_WIDTH + BAR_GAP
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
            y += BAR_WIDTH + BAR_GAP
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
            "Ralkerie waveform bars:",
            bars.length
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


        /*
         * Same card already connected.
         */

        if (
            currentCard === card &&
            waveform &&
            waveform.parentElement === card
        ) {

            return;

        }


        /*
         * Discord created a new card.
         */

        if (waveform) {

            waveform.remove();

            waveform = null;

        }


        bars = [];


        currentCard =
            card;


        createWaveform();

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
         * Throttle updates.

         * requestAnimationFrame still runs,
         * but DOM transforms only update
         * about 20 times per second.
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
            let i = 0;
            i < bars.length;
            i++
        ) {

            const data =
                bars[i];


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
             * Secondary movement.
             */

            const secondary =
                (
                    Math.sin(
                        elapsed *
                        3.2 +
                        data.phase *
                        1.4
                    ) +
                    1
                ) * 0.5;


            /*
             * Mix waves.
             */

            const value =
                wave * 0.78 +
                secondary * 0.22;


            /*
             * Calculate bar size.
             */

            const size =
                MIN_HEIGHT +
                (
                    MAX_HEIGHT -
                    MIN_HEIGHT
                ) *
                value *
                data.strength;


            const bar =
                data.element;


            /* =================================================
               TOP
            ================================================= */

            if (
                data.side === "top"
            ) {

                bar.style.transform =
                    `scaleY(${size})`;

            }


            /* =================================================
               BOTTOM
            ================================================= */

            else if (
                data.side === "bottom"
            ) {

                bar.style.transform =
                    `scaleY(${size})`;

            }


            /* =================================================
               LEFT
            ================================================= */

            else if (
                data.side === "left"
            ) {

                bar.style.transform =
                    `scaleX(${size})`;

            }


            /* =================================================
               RIGHT
            ================================================= */

            else if (
                data.side === "right"
            ) {

                bar.style.transform =
                    `scaleX(${size})`;

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

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                rebuildTimer
            );


            rebuildTimer =
                setTimeout(
                    () => {

                        if (
                            currentCard
                        ) {

                            buildBars();

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
       DISCORD MUTATION OBSERVER
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
       INITIAL LOAD
    ================================================= */

    findCard();


    /* =================================================
       DISCORD LOAD RETRY
    ================================================= */

    let attempts = 0;


    const finder =
        setInterval(
            () => {

                attempts++;


                findCard();


                if (
                    currentCard ||
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
