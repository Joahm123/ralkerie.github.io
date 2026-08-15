/* =====================================================
   RALKERIE WAVEFORM
   GOOD LOOK + LOW CPU

   - Four-sided wrap
   - Bars touch the Discord card
   - White -> pink gradient
   - Strong glow
   - Smooth enough at 20 updates/sec
   - Transform-only animation
   - No layout changes during animation
===================================================== */

(() => {

    "use strict";

    const container =
        document.getElementById("discord-card-container");

    if (!container) {
        console.error("Ralkerie waveform: container not found.");
        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_SIZE = 3;
    const GAP = 4;

    const MIN_SCALE = 0.35;
    const MAX_SCALE = 10;

    const UPDATE_INTERVAL = 50;


    let currentWrapper = null;
    let bars = [];

    let lastUpdate = 0;
    let startTime = performance.now();
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

        bar.className = "wave-bar";


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

            side,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                1.4 +
                Math.random() *
                1.8,

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


        if (
            currentWrapper &&
            currentWrapper.parentNode
        ) {

            currentWrapper.remove();

        }


        const wrapper =
            document.createElement("div");

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


        container.appendChild(wrapper);

        wrapper.appendChild(card);


        currentWrapper =
            wrapper;


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


        if (
            document.hidden
        ) {

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
                        4.2 +
                        data.phase *
                        1.4
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
                setTimeout(() => {

                    if (
                        currentWrapper
                    ) {

                        buildBars(
                            currentWrapper
                        );

                    }

                }, 250);

        },
        {
            passive: true
        }
    );


    /* =================================================
       OBSERVER
    ================================================= */

    const observer =
        new MutationObserver(() => {

            clearTimeout(
                observer.timer
            );


            observer.timer =
                setTimeout(
                    findCard,
                    100
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


    let attempts = 0;


    const finder =
        setInterval(() => {

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
