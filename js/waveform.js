/* =====================================================
   RALKERIE WAVEFORM
   DIRECT SPOTIFY POSITION SYNC

   - Syncs directly with Lanyard
   - ~20 visual updates/sec
   - Only fetches Spotify data every 15 seconds
   - Position advances locally between API updates
   - Keeps four-sided wrapping
   - Dense corners / no missing side sections
   - Pink + white glow
   - Uses transform only
   - Does not modify Discord card contents
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

    const UPDATE_INTERVAL = 50;

    const SPOTIFY_REFRESH = 15000;

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

    let spotify = {

        playing: false,

        position: 0,

        duration: 0,

        receivedAt: 0,

        trackId: null
    };


    let loadingSpotify = false;


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


        /*
         * Only set the expensive glow once.
         *
         * The animation itself only changes
         * transform.
         */

        bar.style.filter =
            "drop-shadow(0 0 2px rgba(255,255,255,.95)) " +
            "drop-shadow(0 0 5px rgba(255,99,202,.9))";


        parent.appendChild(bar);


        return {

            element: bar,

            side: side,

            phase:
                Math.random() *
                Math.PI *
                2,

            speed:
                0.8 +
                Math.random() *
                0.7,

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

           Extra 2px overlap prevents gaps
           at the corners.
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

            return;
        }


        attachWaveform(card);
    }


    /* =================================================
       READ SPOTIFY FROM LANYARD
    ================================================= */

    async function updateSpotify() {

        if (loadingSpotify) {

            return;
        }


        loadingSpotify = true;


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

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
                    "Invalid Lanyard response"
                );
            }


            const data =
                result.data;


            const spotifyData =
                data.spotify;


            /*
             * No Spotify.
             */

            if (
                !data.listening_to_spotify ||
                !spotifyData
            ) {

                spotify.playing = false;

                spotify.position = 0;

                spotify.duration = 0;

                spotify.trackId = null;

                return;
            }


            const timestamps =
                spotifyData.timestamps;


            if (
                !timestamps ||
                !timestamps.start ||
                !timestamps.end
            ) {

                spotify.playing = false;

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


            /*
             * Current Spotify position.
             */

            const now =
                Date.now();


            let position =
                now - start;


            /*
             * Don't allow negative
             * positions.
             */

            position =
                Math.max(
                    0,
                    position
                );


            /*
             * Don't exceed track duration.
             */

            if (
                duration > 0
            ) {

                position =
                    Math.min(
                        position,
                        duration
                    );
            }


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
             * Save synchronized state.
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


            console.log(
                "Ralkerie waveform Spotify sync:",
                spotifyData.song,
                Math.floor(position / 1000) +
                "s / " +
                Math.floor(duration / 1000) +
                "s"
            );

        }

        catch (error) {

            console.warn(
                "Ralkerie waveform Spotify sync failed:",
                error
            );

        }

        finally {

            loadingSpotify = false;
        }
    }


    /* =================================================
       GET CURRENT POSITION
    ================================================= */

    function getCurrentPosition(time) {

        if (
            !spotify.duration
        ) {

            return 0;
        }


        let position =
            spotify.position;


        /*
         * Advance locally between
         * Lanyard requests.
         */

        if (
            spotify.playing
        ) {

            position +=
                time -
                spotify.receivedAt;
        }


        /*
         * Keep it inside the song.
         */

        if (
            position >=
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


        if (
            document.hidden
        ) {

            return;
        }


        /*
         * Hard throttle to ~20 FPS.
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


        const position =
            getCurrentPosition(
                time
            );


        /*
         * Convert milliseconds
         * into seconds.
         */

        const seconds =
            position / 1000;


        /*
         * If Spotify exists, use the
         * playback clock.
         *
         * If not, use a very subtle
         * idle animation.
         */

        const hasSpotify =
            spotify.duration > 0;


        for (
            const data of bars
        ) {

            let wave;


            if (hasSpotify) {

                /*
                 * Main synchronized wave.
                 */

                const primary =
                    Math.sin(
                        seconds *
                        3.0 +
                        data.phase
                    );


                /*
                 * Secondary movement.
                 */

                const secondary =
                    Math.sin(
                        seconds *
                        5.7 +
                        data.phase *
                        1.43
                    );


                /*
                 * Slower movement keeps
                 * the waveform from looking
                 * mechanically repetitive.
                 */

                const slow =
                    Math.sin(
                        seconds *
                        1.35 +
                        data.phase *
                        0.6
                    );


                wave =
                    primary * 0.52 +
                    secondary * 0.28 +
                    slow * 0.20;

            } else {

                /*
                 * Tiny idle animation.
                 */

                wave =
                    Math.sin(
                        time *
                        0.001 +
                        data.phase
                    ) *
                    0.12;
            }


            /*
             * Normalize.
             */

            const normalized =
                (
                    wave + 1
                ) * 0.5;


            /*
             * Never completely disappear.
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
             * GPU-only animation.
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
       MUTATION OBSERVER
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
                        200
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
       INITIAL CARD SEARCH
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
       INITIAL SPOTIFY FETCH
    ================================================= */

    updateSpotify();


    /* =================================================
       SPOTIFY REFRESH
    ================================================= */

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
        "Ralkerie direct Spotify waveform ready."
    );

})();
