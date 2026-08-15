/* =====================================================
   RALKERIE WAVEFORM
   ORIGINAL MODE — OPTIMIZED

   - NO Spotify sync
   - Smooth independent waveform animation
   - Four-sided wrap
   - Dense corner coverage
   - White + pink glow
   - ~20 visual updates/sec
   - Low CPU usage
   - Does NOT modify Discord card contents
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const UPDATE_INTERVAL = 50;

    const BAR_SIZE = 3;

    const GAP = 4;

    const MIN_SCALE = 0.35;

    const MAX_SCALE = 7.5;


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


    /* =================================================
       STATE
    ================================================= */

    let currentWrapper = null;

    let bars = [];

    let animationFrame = null;

    let lastUpdate = 0;

    let startTime = performance.now();


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
                0.7 +
                Math.random() *
                0.5,

            strength:
                0.75 +
                Math.random() *
                0.25

        };
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

           Extra overlap prevents corner gaps.
        ================================================= */

        for (
            let x = -4;
            x <= width + 4;
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

           Extra overlap prevents missing sides.
        ================================================= */

        for (
            let y = -4;
            y <= height + 4;
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
            "Ralkerie waveform bars:",
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


        /* Already wrapped */

        if (
            card.parentElement &&
            card.parentElement.classList.contains(
                "waveform-wrapper"
            )
        ) {

            currentWrapper =
                card.parentElement;

            if (
                bars.length === 0
            ) {

                requestAnimationFrame(
                    () => {

                        buildBars(
                            currentWrapper
                        );

                    }
                );
            }

            return;
        }


        /* Remove old wrapper */

        if (
            currentWrapper &&
            currentWrapper.parentNode
        ) {

            currentWrapper.remove();

        }


        /* Create wrapper */

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "waveform-wrapper";


        /* Create four sides */

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


        /* Put wrapper in container */

        container.appendChild(
            wrapper
        );


        /* Put Discord card inside */

        wrapper.appendChild(
            card
        );


        currentWrapper =
            wrapper;


        /* Build after layout */

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


        if (
            document.hidden
        ) {

            return;
        }


        /* ~20 FPS */

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


        const seconds =
            (
                time -
                startTime
            ) / 1000;


        /* =================================================
           UPDATE BARS
        ================================================= */

        for (
            let i = 0;
            i < bars.length;
            i++
        ) {

            const data =
                bars[i];


            /*
             * Three cheap sine waves.
             *
             * This gives the waveform movement
             * without constantly calculating
             * Spotify position.
             */

            const wave1 =
                Math.sin(
                    seconds *
                    2.4 *
                    data.speed +
                    data.phase
                );


            const wave2 =
                Math.sin(
                    seconds *
                    4.1 *
                    data.speed +
                    data.phase *
                    1.7
                );


            const wave3 =
                Math.sin(
                    seconds *
                    1.3 *
                    data.speed +
                    data.phase *
                    0.6
                );


            const wave =
                (
                    wave1 * 0.50
                ) +
                (
                    wave2 * 0.30
                ) +
                (
                    wave3 * 0.20
                );


            const normalized =
                (
                    wave + 1
                ) * 0.5;


            /*
             * Never let bars completely disappear.
             */

            const value =
                0.20 +
                normalized *
                0.80;


            const scale =
                MIN_SCALE +
                value *
                MAX_SCALE *
                data.strength;


            const bar =
                data.element;


            /* =================================================
               GPU-FRIENDLY TRANSFORM
            ================================================= */

            if (
                data.side === "top" ||
                data.side === "bottom"
            ) {

                bar.style.transform =
                    `scaleY(${scale})`;

            } else {

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
       INITIAL FIND
    ================================================= */

    findCard();


    let attempts = 0;


    const finder =
        setInterval(
            () => {

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
        "Ralkerie original waveform ready."
    );

})();
