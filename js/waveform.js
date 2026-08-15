/* =====================================================
   RALKERIE WAVEFORM
   FOUR-SIDED GLOWING EQUALIZER

   - Wraps around the Discord card
   - White + pink glow
   - Smooth animation
   - CPU-conscious
   - Does NOT resize the Discord card
===================================================== */

(() => {

    "use strict";

    console.log("Ralkerie waveform starting...");


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_WIDTH = 3;
    const BAR_HEIGHT = 3;

    const GAP = 5;

    const MIN_SIZE = 1;
    const MAX_SIZE = 14;

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
            "Ralkerie waveform: Discord container not found."
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

        const sideElement =
            document.createElement("div");

        sideElement.className =
            `wave-side wave-side-${side}`;

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


        /*
         * Horizontal sides
         */

        if (
            side === "top" ||
            side === "bottom"
        ) {

            bar.style.left =
                `${position}px`;

        }


        /*
         * Vertical sides
         */

        else {

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
                Math.random() * 1.8,

            strength:
                0.75 +
                Math.random() * 0.25

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


        top.replaceChildren();
        bottom.replaceChildren();
        left.replaceChildren();
        right.replaceChildren();


        bars = [];


        const width =
            wrapper.clientWidth;

        const height =
            wrapper.clientHeight;


        /*
         * TOP + BOTTOM
         */

        for (
            let x = 0;
            x < width;
            x += BAR_WIDTH + GAP
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
         * LEFT + RIGHT
         */

        for (
            let y = 0;
            y < height;
            y += BAR_HEIGHT + GAP
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
       ATTACH
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
         * Remove previous wrapper.
         */

        if (
            currentWrapper &&
            currentWrapper.parentNode
        ) {

            currentWrapper.remove();

        }


        /*
         * Wrapper
         */

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "waveform-wrapper";


        /*
         * Four sides
         */

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
         * Put wrapper into Discord container.
         */

        container.appendChild(wrapper);


        /*
         * Move card inside wrapper.
         */

        wrapper.appendChild(card);


        currentWrapper =
            wrapper;


        /*
         * Wait for layout.
         */

        requestAnimationFrame(() => {

            if (
                currentWrapper === wrapper
            ) {

                buildBars(wrapper);

            }

        });
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


        attachWaveform(card);
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


        /*
         * Animate bars.
         */

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


            const secondWave =
                (
                    Math.sin(
                        elapsed *
                        2.7 +
                        data.phase *
                        1.4
                    ) + 1
                ) * 0.5;


            const value =
                wave * 0.78 +
                secondWave * 0.22;


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


            /*
             * TOP
             */

            if (
                data.side === "top"
            ) {

                bar.style.transform =
                    `scaleY(${size})`;

            }


            /*
             * BOTTOM
             */

            else if (
                data.side === "bottom"
            ) {

                bar.style.transform =
                    `scaleY(${size})`;

            }


            /*
             * LEFT
             */

            else if (
                data.side === "left"
            ) {

                bar.style.transform =
                    `scaleX(${size})`;

            }


            /*
             * RIGHT
             */

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
                setTimeout(() => {

                    if (
                        currentWrapper
                    ) {

                        buildBars(
                            currentWrapper
                        );

                    }

                }, 300);

        },
        {
            passive: true
        }
    );


    /* =================================================
       DISCORD OBSERVER
    ================================================= */

    const observer =
        new MutationObserver(() => {

            clearTimeout(
                observer.timer
            );


            observer.timer =
                setTimeout(
                    findCard,
                    150
                );

        });


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
     * Discord can load asynchronously.
     */

    let attempts = 0;


    const finder =
        setInterval(() => {

            attempts++;

            findCard();


            if (
                currentWrapper ||
                attempts >= 80
            ) {

                clearInterval(
                    finder
                );

            }

        }, 250);


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
