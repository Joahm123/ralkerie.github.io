/* =====================================================
   RALKERIE WAVEFORM
   SPOTIFY-SYNCED / LOW CPU

   - Syncs to current Spotify song
   - Syncs to Spotify playback position
   - ~20 visual updates/sec
   - No Web Audio processing
   - Low CPU usage
   - Four-sided waveform
   - Wraps around Discord card
   - Automatically detects Discord card
   - Rebuilds safely when card changes
   - Pauses when tab is hidden

   IMPORTANT:
   Spotify does not expose raw audio frequency data
   through Lanyard, so this creates a deterministic
   waveform based on:
       song ID + playback position
   rather than pretending to read the actual audio.
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const BAR_SIZE = 3;

    const GAP = 5;

    const UPDATE_INTERVAL = 50;

    const MIN_SCALE = 0.15;

    const MAX_SCALE = 8.5;

    const SPOTIFY_UPDATE_INTERVAL = 2000;

    const API_URL =
        "https://api.lanyard.rest/v1/users/1044800788817510460";


    /* =================================================
       ELEMENTS
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

    let wrapper = null;

    let bars = [];

    let lastFrame = 0;

    let animationFrame = null;

    let spotifyTimer = null;

    let resizeTimer = null;

    let currentSongId = "";

    let currentSongName = "";

    let currentArtist = "";

    let spotifyProgress = 0;

    let spotifyDuration = 0;

    let spotifyPlaying = false;

    let spotifyReceivedAt = 0;

    let seed = 1;


    /* =================================================
       HASH
       
       Creates the same seed for the same song.
    ================================================= */

    function hashString(value) {

        let hash = 2166136261;


        for (
            let i = 0;
            i < value.length;
            i++
        ) {

            hash ^= value.charCodeAt(i);

            hash +=
                (
                    hash << 1
                ) +
                (
                    hash << 4
                ) +
                (
                    hash << 7
                ) +
                (
                    hash << 8
                ) +
                (
                    hash << 24
                );

        }


        return hash >>> 0;
    }


    /* =================================================
       SEEDED RANDOM
    ================================================= */

    function seededRandom(index) {

        let x =
            (
                seed +
                index * 374761393
            ) >>> 0;


        x =
            (
                x ^
                (x >>> 13)
            ) >>> 0;


        x =
            (
                x *
                1274126177
            ) >>> 0;


        x =
            (
                x ^
                (x >>> 16)
            ) >>> 0;


        return (
            x /
            4294967296
        );

    }


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
        position,
        index
    ) {

        const bar =
            document.createElement(
                "span"
            );


        bar.className =
            "wave-bar";


        /*
         * Position each bar only once.
         */

        if (
            side === "top" ||
            side === "bottom"
        ) {

            bar.style.left =
                `${position}px`;

        }

        else {

            bar.style.top =
                `${position}px`;

        }


        /*
         * Different waveform characteristics
         * for every bar.
         */

        const random =
            seededRandom(index);


        const phase =
            random *
            Math.PI *
            2;


        const frequency =
            0.55 +
            random *
            1.7;


        const strength =
            0.65 +
            random *
            0.35;


        parent.appendChild(
            bar
        );


        return {

            element: bar,

            side: side,

            index: index,

            phase: phase,

            frequency: frequency,

            strength: strength,

            random: random

        };

    }


    /* =================================================
       BUILD WAVEFORM
    ================================================= */

    function buildBars() {

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


        let index = 0;


        /* =================================================
           TOP
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
                    x,
                    index++
                )
            );

        }


        /* =================================================
           BOTTOM
        ================================================= */

        for (
            let x = 0;
            x < width;
            x += BAR_SIZE + GAP
        ) {

            bars.push(
                createBar(
                    bottom,
                    "bottom",
                    x,
                    index++
                )
            );

        }


        /* =================================================
           LEFT
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
                    y,
                    index++
                )
            );

        }


        /* =================================================
           RIGHT
        ================================================= */

        for (
            let y = 0;
            y < height;
            y += BAR_SIZE + GAP
        ) {

            bars.push(
                createBar(
                    right,
                    "right",
                    y,
                    index++
                )
            );

        }


        console.log(
            "Ralkerie waveform bars:",
            bars.length
        );

    }


    /* =================================================
       FIND / ATTACH DISCORD CARD
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
         * Already wrapped.
         */

        if (
            card.parentElement &&
            card.parentElement.classList.contains(
                "waveform-wrapper"
            )
        ) {

            if (
                wrapper !== card.parentElement
            ) {

                wrapper =
                    card.parentElement;

                requestAnimationFrame(
                    buildBars
                );

            }

            return;
        }


        /*
         * Remove old wrapper.
         */

        if (
            wrapper &&
            wrapper.parentNode
        ) {

            wrapper.remove();

        }


        /*
         * Create wrapper.
         */

        wrapper =
            document.createElement(
                "div"
            );


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
         * Put wrapper into container.
         */

        container.appendChild(
            wrapper
        );


        /*
         * Put card inside wrapper.
         */

        wrapper.appendChild(
            card
        );


        /*
         * Build after layout.
         */

        requestAnimationFrame(
            () => {

                if (
                    wrapper
                ) {

                    buildBars();

                }

            }
        );

    }


    /* =================================================
       SPOTIFY DATA
    ================================================= */

    async function updateSpotify() {

        if (
            document.hidden
        ) {

            return;
        }


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

                return;
            }


            const result =
                await response.json();


            if (
                !result ||
                !result.success ||
                !result.data
            ) {

                return;
            }


            const data =
                result.data;


            const spotify =
                data.spotify;


            /*
             * No Spotify.
             */

            if (
                !data.listening_to_spotify ||
                !spotify
            ) {

                spotifyPlaying = false;

                currentSongId = "";

                return;
            }


            /*
             * Song ID.
             */

            const newSongId =
                spotify.track_id ||
                (
                    spotify.song +
                    "|" +
                    spotify.artist
                );


            /*
             * Detect new song.
             */

            if (
                newSongId !==
                currentSongId
            ) {

                currentSongId =
                    newSongId;


                currentSongName =
                    spotify.song ||
                    "";


                currentArtist =
                    spotify.artist ||
                    "";


                /*
                 * New deterministic waveform.
                 */

                seed =
                    hashString(
                        currentSongId
                    );


                /*
                 * Reset position.
                 */

                spotifyProgress =
                    spotify.timestamps &&
                    typeof spotify.timestamps.start ===
                    "number"
                        ? spotify.timestamps.start
                        : 0;

            }


            /*
             * Lanyard timestamps are UNIX
             * milliseconds.
             */

            if (
                spotify.timestamps
            ) {

                const start =
                    Number(
                        spotify.timestamps.start
                    );


                const end =
                    Number(
                        spotify.timestamps.end
                    );


                if (
                    Number.isFinite(start)
                ) {

                    spotifyProgress =
                        Date.now() -
                        start;

                }


                if (
                    Number.isFinite(end) &&
                    Number.isFinite(start)
                ) {

                    spotifyDuration =
                        end -
                        start;

                }

            }


            spotifyPlaying = true;

            spotifyReceivedAt =
                performance.now();

        }

        catch (error) {

            /*
             * Don't spam console.
             */

        }

    }


    /* =================================================
       GET CURRENT PROGRESS
    ================================================= */

    function getProgress() {

        if (
            !spotifyPlaying
        ) {

            return 0;
        }


        /*
         * Continue advancing between
         * Lanyard API updates.
         */

        const elapsed =
            performance.now() -
            spotifyReceivedAt;


        let progress =
            spotifyProgress +
            elapsed;


        if (
            spotifyDuration > 0
        ) {

            progress =
                Math.min(
                    progress,
                    spotifyDuration
                );

        }


        return progress;

    }


    /* =================================================
       WAVEFORM VALUE
       
       Generates a song-specific waveform
       based on playback position.
    ================================================= */

    function getWaveValue(
        bar,
        progress
    ) {

        /*
         * Convert milliseconds into
         * waveform time.
         */

        const seconds =
            progress / 1000;


        /*
         * Each bar gets a slightly
         * different frequency.
         */

        const t =
            seconds *
            bar.frequency;


        /*
         * Main waveform.
         */

        const wave1 =
            (
                Math.sin(
                    t * 5.7 +
                    bar.phase
                ) +
                1
            ) *
            0.5;


        /*
         * Secondary waveform.
         */

        const wave2 =
            (
                Math.sin(
                    t * 11.3 +
                    bar.phase * 1.7
                ) +
                1
            ) *
            0.5;


        /*
         * Bass-style pulse.
         */

        const bass =
            (
                Math.sin(
                    seconds *
                    2.2 +
                    bar.phase
                ) +
                1
            ) *
            0.5;


        /*
         * Song-specific variation.
         */

        const variation =
            seededRandom(
                bar.index +
                Math.floor(
                    progress /
                    180
                )
            );


        /*
         * Combine everything.
         */

        let value =
            wave1 * 0.42 +
            wave2 * 0.25 +
            bass * 0.18 +
            variation * 0.15;


        /*
         * Add stronger movement
         * when Spotify is active.
         */

        value *=
            bar.strength;


        return Math.max(
            0,
            Math.min(
                1,
                value
            )
        );

    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(time) {

        animationFrame = null;


        /*
         * Completely stop while hidden.
         */

        if (
            document.hidden
        ) {

            return;

        }


        /*
         * ~20 updates per second.
         */

        if (
            time -
            lastFrame <
            UPDATE_INTERVAL
        ) {

            animationFrame =
                requestAnimationFrame(
                    animate
                );

            return;

        }


        lastFrame =
            time;


        const progress =
            getProgress();


        /*
         * Update every bar.
         */

        for (
            let i = 0;
            i < bars.length;
            i++
        ) {

            const bar =
                bars[i];


            let value;


            if (
                spotifyPlaying
            ) {

                value =
                    getWaveValue(
                        bar,
                        progress
                    );

            }

            else {

                /*
                 * Very subtle idle animation
                 * when Spotify isn't playing.
                 */

                const idleTime =
                    time / 1000;


                value =
                    (
                        Math.sin(
                            idleTime *
                            bar.frequency +
                            bar.phase
                        ) +
                        1
                    ) *
                    0.5 *
                    0.22;

            }


            const scale =
                MIN_SCALE +
                value *
                MAX_SCALE;


            /*
             * Transform only.
             * No width/height changes.
             */

            if (
                bar.side === "top" ||
                bar.side === "bottom"
            ) {

                bar.element.style.transform =
                    `scaleY(${scale})`;

            }

            else {

                bar.element.style.transform =
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

            lastFrame = 0;


            if (
                document.hidden
            ) {

                if (
                    animationFrame
                ) {

                    cancelAnimationFrame(
                        animationFrame
                    );

                    animationFrame =
                        null;

                }

                return;

            }


            if (
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

                        buildBars();

                    },
                    250
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
       START
    ================================================= */

    findCard();


    updateSpotify();


    spotifyTimer =
        setInterval(
            updateSpotify,
            SPOTIFY_UPDATE_INTERVAL
        );


    animationFrame =
        requestAnimationFrame(
            animate
        );


    /*
     * Discord loads asynchronously.
     */

    let attempts = 0;


    const finder =
        setInterval(
            () => {

                attempts++;

                findCard();


                if (
                    wrapper ||
                    attempts >= 100
                ) {

                    clearInterval(
                        finder
                    );

                }

            },
            250
        );


    console.log(
        "Ralkerie Spotify-synced waveform ready."
    );

})();
