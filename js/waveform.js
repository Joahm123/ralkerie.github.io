/* =====================================================
   RALKERIE WAVEFORM
   ULTRA LOW CPU SPOTIFY SYNC

   - Spotify position synced through Lanyard
   - 15 visual updates/sec
   - Local playback interpolation
   - No per-bar CSS filters
   - No per-frame layout work
   - Four-sided wrap
   - Dense corners
   - Pink + white glow
   - Pauses when hidden
   - Pauses animation when Spotify isn't playing
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const USER_ID =
        "1044800788817510460";

    const API_URL =
        "https://api.lanyard.rest/v1/users/" +
        USER_ID;

    /*
     * 15 updates/sec.
     *
     * Much cheaper than 20 while still
     * looking smooth.
     */
    const UPDATE_INTERVAL = 66;

    /*
     * Lanyard only needs to be checked
     * occasionally because we interpolate
     * the position locally.
     */
    const SPOTIFY_REFRESH = 15000;

    /*
     * Waveform density.
     */
    const BAR_SIZE = 3;

    const GAP = 4;

    /*
     * Animation size.
     */
    const MIN_SCALE = 0.35;

    const MAX_SCALE = 7.0;


    /* =================================================
       FIND CONTAINER
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

    let finder = null;

    let resizeTimer = null;

    let spotifyTimer = null;

    let spotifyLoading = false;


    const spotify = {

        playing: false,

        position: 0,

        duration: 0,

        receivedAt: 0,

        trackId: null

    };


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
         * Position is set ONCE.
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


        /*
         * Glow is handled by CSS instead
         * of an expensive filter on every bar.
         */

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
                0.75 +
                Math.random() *
                0.65,

            strength:
                0.82 +
                Math.random() *
                0.18
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
            let x = -2;
            x <= width + 2;
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
            let y = -2;
            y <= height + 2;
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
             * Make sure bars exist.
             */

            if (
                bars.length === 0
            ) {

                requestAnimationFrame(
                    () => {

                        if (
                            currentWrapper
                        ) {

                            buildBars(
                                currentWrapper
                            );
                        }

                    }
                );
            }

            return;
        }


        /*
         * Remove stale wrapper.
         */

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


        /*
         * Four sides.
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
         * Put wrapper in the existing
         * Discord container.
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

                    buildBars(
                        wrapper
                    );
                }

            }
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


        attachWaveform(
            card
        );


        return true;
    }


    /* =================================================
       SPOTIFY DATA
    ================================================= */

    async function updateSpotify() {

        if (
            spotifyLoading
        ) {

            return;
        }


        spotifyLoading =
            true;


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        cache: "no-store"
                    }
                );


            if (
                !response.ok
            ) {

                throw new Error(
                    "HTTP " +
                    response.status
                );
            }


            const result =
                await response.json();


            if (
                !result ||
                !result.success ||
                !result.data
            ) {

                throw new Error(
                    "Invalid Lanyard response."
                );
            }


            const data =
                result.data;


            const spotifyData =
                data.spotify;


            /*
             * Nothing playing.
             */

            if (
                !data.listening_to_spotify ||
                !spotifyData
            ) {

                spotify.playing =
                    false;

                spotify.position =
                    0;

                spotify.duration =
                    0;

                spotify.trackId =
                    null;

                return;
            }


            const timestamps =
                spotifyData.timestamps;


            if (
                !timestamps ||
                !timestamps.start ||
                !timestamps.end
            ) {

                spotify.playing =
                    false;

                return;
            }


            const start =
                Number(
                    timestamps.start
                );

            const end =
                Number(
                    timestamps.end
                );


            const duration =
                Math.max(
                    0,
                    end - start
                );


            const now =
                Date.now();


            let position =
                now - start;


            position =
                Math.max(
                    0,
                    position
                );


            if (
                duration > 0
            ) {

                position =
                    Math.min(
                        position,
                        duration
                    );
            }


            /*
             * Track identifier.
             */

            const trackId =
                (
                    spotifyData.song ||
                    ""
                ) +
                "|" +
                (
                    spotifyData.artist ||
                    ""
                ) +
                "|" +
                (
                    spotifyData.album ||
                    ""
                );


            /*
             * Save state.
             */

            spotify.playing =
                position < duration;

            spotify.position =
                position;

            spotify.duration =
                duration;

            spotify.receivedAt =
                performance.now();

            spotify.trackId =
                trackId;


        }

        catch (error) {

            console.warn(
                "Ralkerie waveform Spotify sync failed:",
                error
            );

        }

        finally {

            spotifyLoading =
                false;
        }
    }


    /* =================================================
       CURRENT POSITION
    ================================================= */

    function getCurrentPosition(time) {

        if (
            spotify.duration <= 0
        ) {

            return 0;
        }


        let position =
            spotify.position;


        /*
         * Locally advance playback.
         *
         * No API request needed.
         */

        if (
            spotify.playing
        ) {

            position +=
                time -
                spotify.receivedAt;
        }


        if (
            position >
            spotify.duration
        ) {

            position =
                spotify.duration;
        }


        return position;
    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(time) {

        animationFrame =
            null;


        /*
         * Completely stop while hidden.
         */

        if (
            document.hidden
        ) {

            return;
        }


        /*
         * 15 FPS throttle.
         */

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


        /*
         * No bars yet.
         */

        if (
            bars.length === 0
        ) {

            animationFrame =
                requestAnimationFrame(
                    animate
                );

            return;
        }


        const position =
            getCurrentPosition(
                time
            );


        const seconds =
            position / 1000;


        const hasSpotify =
            spotify.duration > 0;


        /*
         * Animate bars.
         */

        for (
            let i = 0;
            i < bars.length;
            i++
        ) {

            const data =
                bars[i];


            let wave;


            if (
                hasSpotify
            ) {

                /*
                 * Main wave.
                 *
                 * Spotify position controls
                 * the exact phase.
                 */

                const primary =
                    Math.sin(
                        seconds *
                        3.0 +
                        data.phase
                    );


                /*
                 * Secondary wave.
                 */

                const secondary =
                    Math.sin(
                        seconds *
                        5.4 +
                        data.phase *
                        1.35
                    );


                /*
                 * Slow wave.
                 */

                const slow =
                    Math.sin(
                        seconds *
                        1.25 +
                        data.phase *
                        0.55
                    );


                wave =
                    primary * 0.50 +
                    secondary * 0.30 +
                    slow * 0.20;

            } else {

                /*
                 * Very tiny idle movement.
                 */

                wave =
                    Math.sin(
                        time *
                        0.0008 +
                        data.phase
                    ) *
                    0.08;
            }


            /*
             * Normalize.
             */

            const normalized =
                (
                    wave + 1
                ) * 0.5;


            /*
             * Keep bars visible.
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


            /*
             * GPU-only property.
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
                    500
                );

        },
        {
            passive: true
        }
    );


    /* =================================================
       LIGHTWEIGHT CARD OBSERVER
    ================================================= */

    const observer =
        new MutationObserver(
            () => {

                /*
                 * Only check if the actual
                 * Discord card disappeared.
                 */

                if (
                    !container.querySelector(
                        ".discord-live-card"
                    )
                ) {

                    clearTimeout(
                        observer.timer
                    );


                    observer.timer =
                        setTimeout(
                            findCard,
                            250
                        );
                }

            }
        );


    /*
     * Only watch direct child changes.
     *
     * We do NOT watch the entire Discord
     * card subtree anymore.
     */

    observer.observe(
        container,
        {
            childList: true
        }
    );


    /* =================================================
       INITIAL CARD SEARCH
    ================================================= */

    findCard();


    /* =================================================
       SHORT CARD FINDER
    ================================================= */

    let attempts = 0;


    finder =
        setInterval(
            () => {

                attempts++;


                if (
                    findCard() ||
                    attempts >= 30
                ) {

                    clearInterval(
                        finder
                    );

                    finder = null;
                }

            },
            500
        );


    /* =================================================
       INITIAL SPOTIFY SYNC
    ================================================= */

    updateSpotify();


    /* =================================================
       SPOTIFY REFRESH
    ================================================= */

    spotifyTimer =
        setInterval(
            updateSpotify,
            SPOTIFY_REFRESH
        );


    /* =================================================
       START
    ================================================= */

    animationFrame =
        requestAnimationFrame(
            animate
        );


    console.log(
        "Ralkerie LOW CPU Spotify waveform ready."
    );

})();
