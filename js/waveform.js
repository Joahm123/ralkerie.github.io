/* =====================================================
   RALKERIE WAVEFORM
   FOUR-SIDED BOX EQUALIZER
===================================================== */

(() => {

    "use strict";

    console.log(
        "Ralkerie waveform starting..."
    );


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_WIDTH = 3;

    const BAR_HEIGHT = 3;

    const GAP = 4;

    const MIN_SIZE = 3;

    const MAX_SIZE = 28;


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


    /* =================================================
       CREATE SIDE
    ================================================= */

    function createSide(side) {

        const element =
            document.createElement("div");

        element.className =
            "wave-side wave-side-" +
            side;

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

            bar.style.width =
                `${BAR_WIDTH}px`;

            bar.style.height =
                `${MIN_SIZE}px`;

        } else {

            bar.style.top =
                `${position}px`;

            bar.style.height =
                `${BAR_HEIGHT}px`;

            bar.style.width =
                `${MIN_SIZE}px`;
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
                1.5 +
                Math.random() * 3,

            strength:
                0.65 +
                Math.random() * 0.35

        };
    }


    /* =================================================
       BUILD BARS
    ================================================= */

    function buildBars(
        top,
        bottom,
        left,
        right,
        wrapper
    ) {

        top.innerHTML = "";
        bottom.innerHTML = "";
        left.innerHTML = "";
        right.innerHTML = "";


        const width =
            wrapper.clientWidth;


        const height =
            wrapper.clientHeight;


        const bars = [];


        /* TOP */

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

        }


        /* BOTTOM */

        for (
            let x = 0;
            x < width;
            x += BAR_WIDTH + GAP
        ) {

            bars.push(
                createBar(
                    bottom,
                    "bottom",
                    x
                )
            );

        }


        /* LEFT */

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

        }


        /* RIGHT */

        for (
            let y = 0;
            y < height;
            y += BAR_HEIGHT + GAP
        ) {

            bars.push(
                createBar(
                    right,
                    "right",
                    y
                )
            );

        }


        wrapper._waveBars = bars;

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
            currentWrapper.parentElement
        ) {

            currentWrapper.remove();

            currentWrapper = null;
        }


        const wrapper =
            document.createElement("div");

        wrapper.className =
            "waveform-wrapper";


        const border =
            document.createElement("div");

        border.className =
            "wave-border";


        const top =
            createSide("top");

        const bottom =
            createSide("bottom");

        const left =
            createSide("left");

        const right =
            createSide("right");


        border.appendChild(top);
        border.appendChild(bottom);
        border.appendChild(left);
        border.appendChild(right);


        wrapper.appendChild(border);


        container.appendChild(wrapper);

        wrapper.appendChild(card);


        currentWrapper =
            wrapper;


        requestAnimationFrame(() => {

            buildBars(
                top,
                bottom,
                left,
                right,
                wrapper
            );

        });


        console.log(
            "Ralkerie waveform attached."
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
            return false;
        }


        attachWaveform(card);

        return true;
    }


    /* =================================================
       OBSERVER
    ================================================= */

    const observer =
        new MutationObserver(() => {

            findCard();

        });


    observer.observe(
        container,
        {
            childList: true,
            subtree: true
        }
    );


    /* =================================================
       ANIMATION
    ================================================= */

    const startTime =
        performance.now();


    function animate(time) {

        const elapsed =
            (
                time -
                startTime
            ) / 1000;


        if (
            currentWrapper &&
            currentWrapper._waveBars
        ) {

            for (
                const data
                of currentWrapper._waveBars
            ) {

                const wave =
                    (
                        Math.sin(
                            elapsed *
                            data.speed +
                            data.phase
                        ) + 1
                    ) / 2;


                const secondary =
                    (
                        Math.sin(
                            elapsed * 4 +
                            data.phase * 1.7
                        ) + 1
                    ) / 2;


                const value =
                    wave * 0.75 +
                    secondary * 0.25;


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


                if (
                    data.side === "top" ||
                    data.side === "bottom"
                ) {

                    bar.style.height =
                        `${size}px`;

                } else {

                    bar.style.width =
                        `${size}px`;

                }

            }

        }


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
                setTimeout(() => {

                    if (
                        currentWrapper
                    ) {

                        const top =
                            currentWrapper.querySelector(
                                ".wave-side-top"
                            );

                        const bottom =
                            currentWrapper.querySelector(
                                ".wave-side-bottom"
                            );

                        const left =
                            currentWrapper.querySelector(
                                ".wave-side-left"
                            );

                        const right =
                            currentWrapper.querySelector(
                                ".wave-side-right"
                            );


                        if (
                            top &&
                            bottom &&
                            left &&
                            right
                        ) {

                            buildBars(
                                top,
                                bottom,
                                left,
                                right,
                                currentWrapper
                            );

                        }

                    }

                }, 150);

        },
        {
            passive: true
        }
    );


    /* =================================================
       START
    ================================================= */

    findCard();

    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie waveform ready."
    );

})();
