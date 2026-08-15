/* =====================================================
   RALKERIE WAVEFORM
   OVERLAY VERSION

   IMPORTANT:
   - Does NOT wrap the Discord card
   - Does NOT change card dimensions
   - Waveform sits around the existing card
   - Low CPU usage
   - Smooth enough to look good
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_WIDTH = 3;

    const BAR_GAP = 5;

    const MIN_HEIGHT = 2;

    const MAX_HEIGHT = 16;

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
            "Ralkerie waveform: Discord container not found."
        );

        return;
    }


    let currentCard = null;

    let waveform = null;

    let bars = [];

    let lastUpdate = 0;

    let startTime =
        performance.now();

    let animationFrame = null;


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


        parent.appendChild(bar);


        return {

            element: bar,

            side: side,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                1.3 +
                Math.random() * 1.7,

            strength:
                0.7 +
                Math.random() * 0.3
        };
    }


    /* =================================================
       BUILD WAVEFORM
    ================================================= */

    function buildWaveform() {

        if (!currentCard) {
            return;
        }


        if (!waveform) {

            waveform =
                document.createElement("div");

            waveform.className =
                "discord-waveform-overlay";


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
             * Put waveform directly inside
             * the Discord card.
             */

            currentCard.appendChild(
                waveform
            );
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


        top.replaceChildren();
        bottom.replaceChildren();
        left.replaceChildren();
        right.replaceChildren();


        bars = [];


        /*
         * Use the CARD dimensions,
         * not the wrapper.
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
            return;
        }


        /*
         * Same card.
         */

        if (
            currentCard === card &&
            waveform &&
            waveform.parentElement === card
        ) {

            return;
        }


        /*
         * Discord replaced the card.
         */

        if (waveform) {

            waveform.remove();

            waveform = null;
        }


        bars = [];

        currentCard = card;


        /*
         * Make sure the card is a positioning
         * reference for the waveform.
         */

        const computed =
            getComputedStyle(card);


        if (
            computed.position === "static"
        ) {

            card.style.position =
                "relative";
        }


        requestAnimationFrame(
            () => {

                if (
                    currentCard === card
                ) {

                    buildWaveform();
                }

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


        lastUpdate = time;


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


            const second =
                (
                    Math.sin(
                        elapsed *
                        3.2 +
                        data.phase *
                        1.4
                    ) + 1
                ) * 0.5;


            const value =
                wave * 0.78 +
                second * 0.22;


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


            if (
                data.side === "top"
            ) {

                bar.style.transform =
                    `scaleY(${size})`;

            }

            else if (
                data.side === "bottom"
            ) {

                bar.style.transform =
                    `scaleY(${size})`;

            }

            else if (
                data.side === "left"
            ) {

                bar.style.transform =
                    `scaleX(${size})`;

            }

            else {

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

                        if (currentCard) {

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
       DISCORD CHANGES
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
       INITIAL
    ================================================= */

    findCard();


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
