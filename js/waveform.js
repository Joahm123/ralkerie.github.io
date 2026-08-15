/* =====================================================
   RALKERIE WAVEFORM
   STABLE VERSION

   IMPORTANT:
   - NEVER moves the Discord card
   - NEVER wraps the Discord card
   - Waveform lives INSIDE the card
   - Discord can refresh safely
   - Low CPU
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_SIZE = 3;
    const GAP = 5;

    const MIN_SCALE = 0.15;
    const MAX_SCALE = 8;

    const UPDATE_INTERVAL = 70;


    /* =================================================
       CONTAINER
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


    let currentCard = null;

    let bars = [];

    let lastUpdate = 0;

    let animationRunning = false;

    let startTime =
        performance.now();


    /* =================================================
       CREATE SIDE
    ================================================= */

    function createSide(side) {

        const sideElement =
            document.createElement("div");

        sideElement.className =
            "wave-side wave-side-" +
            side;

        return sideElement;
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
                position + "px";

        } else {

            bar.style.top =
                position + "px";
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
                1.5,

            strength:
                0.65 +
                Math.random() *
                0.35
        };
    }


    /* =================================================
       BUILD WAVEFORM
    ================================================= */

    function buildWaveform(card) {

        if (!card) {
            return;
        }


        /*
         * Remove ONLY the waveform.
         * NEVER remove or replace the card.
         */

        const oldWaveform =
            card.querySelector(
                ".ralkerie-waveform"
            );


        if (oldWaveform) {

            oldWaveform.remove();
        }


        const waveform =
            document.createElement("div");


        waveform.className =
            "ralkerie-waveform";


        const top =
            createSide("top");

        const bottom =
            createSide("bottom");

        const left =
            createSide("left");

        const right =
            createSide("right");


        waveform.appendChild(top);
        waveform.appendChild(bottom);
        waveform.appendChild(left);
        waveform.appendChild(right);


        /*
         * IMPORTANT:
         *
         * The waveform is now INSIDE
         * the Discord card.
         */

        card.appendChild(
            waveform
        );


        const width =
            card.clientWidth;

        const height =
            card.clientHeight;


        bars = [];


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


        currentCard =
            card;


        console.log(
            "Ralkerie waveform:",
            bars.length,
            "bars"
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

            currentCard = null;
            bars = [];

            return;
        }


        /*
         * If this exact card already has
         * our waveform, don't rebuild it.
         */

        if (
            card === currentCard &&
            card.querySelector(
                ".ralkerie-waveform"
            )
        ) {

            return;
        }


        buildWaveform(
            card
        );
    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(time) {

        if (
            document.hidden
        ) {

            animationRunning = false;

            return;
        }


        if (
            time - lastUpdate <
            UPDATE_INTERVAL
        ) {

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
                    ) +
                    1
                ) * 0.5;


            const second =
                (
                    Math.sin(
                        elapsed *
                        3.1 +
                        data.phase *
                        1.4
                    ) +
                    1
                ) * 0.5;


            const value =
                wave * 0.78 +
                second * 0.22;


            const scale =
                MIN_SCALE +
                value *
                MAX_SCALE *
                data.strength;


            /*
             * Only transform changes.
             * No width.
             * No height.
             * No layout.
             */

            if (
                data.side === "top" ||
                data.side === "bottom"
            ) {

                data.element.style.transform =
                    "scaleY(" +
                    scale +
                    ")";

            } else {

                data.element.style.transform =
                    "scaleX(" +
                    scale +
                    ")";
            }
        }


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

            lastUpdate =
                0;


            if (
                !document.hidden &&
                !animationRunning
            ) {

                animationRunning =
                    true;

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
                            currentCard
                        ) {

                            buildWaveform(
                                currentCard
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
       OBSERVE ONLY CARD CREATION
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
            childList: true
        }
    );


    /* =================================================
       START
    ================================================= */

    findCard();


    let attempts = 0;


    const finder =
        setInterval(
            () => {

                findCard();

                attempts++;


                if (
                    currentCard ||
                    attempts > 60
                ) {

                    clearInterval(
                        finder
                    );
                }

            },
            250
        );


    animationRunning =
        true;


    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie stable waveform ready."
    );

})();
