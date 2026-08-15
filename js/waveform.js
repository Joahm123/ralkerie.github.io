/* =====================================================
   RALKERIE WAVEFORM
   SPOTIFY POSITION SYNC + LOW CPU

   - ~20 visual updates/sec
   - Uses the Spotify position supplied by Lanyard
   - Pauses when Spotify is paused
   - Resets when the song changes
   - Keeps the four-sided wrap
   - Keeps dense left/right coverage
   - Uses transform only
   - Does NOT touch the Discord card contents
===================================================== */

(() => {

    "use strict";


    /* =================================================
       SETTINGS
    ================================================= */

    const UPDATE_INTERVAL = 50; // ~20 updates/sec

    const BAR_SIZE = 3;

    const GAP = 4;

    const MIN_SCALE = 0.35;

    const MAX_SCALE = 7.5;

    const GLOW_MIN = 3;

    const GLOW_MAX = 11;


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

    let lastUpdate = 0;

    let animationFrame = null;

    let lastTrackId = null;

    let spotifyState = {

        playing: false,

        position: 0,

        duration: 0,

        timestamp: performance.now(),

        trackId: null

    };


    /* =================================================
       SPOTIFY SYNC

       discord.js can dispatch this event whenever
       it receives fresh Lanyard data.

       We also inspect the Discord card as a fallback.
    ================================================= */

    window.addEventListener(
        "ralkerie:spotify",
        event => {

            const data =
                event.detail;


            if (!data) {

                return;
            }


            const spotify =
                data.spotify;


            if (
                !spotify
            ) {

                spotifyState.playing =
                    false;

                return;
            }


            spotifyState.playing =
                Boolean(
                    data.listening_to_spotify
                );


            spotifyState.position =
                Number(
                    spotify.timestamps?.start
                        ? Date.now() -
                          spotify.timestamps.start
                        : 0
                );


            spotifyState.duration =
                Number(
                    spotify.timestamps?.end &&
                    spotify.timestamps?.start
                        ? spotify.timestamps.end -
                          spotify.timestamps.start
                        : 0
                );


            spotifyState.timestamp =
                performance.now();


            spotifyState.trackId =
                spotify.song +
                "|" +
                spotify.artist;


            if (
                spotifyState.trackId !==
                lastTrackId
            ) {

                lastTrackId =
                    spotifyState.trackId;

            }

        }
    );


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
                0.55,

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

           Slight overlap prevents missing corners.
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

           Slight overlap prevents the missing
           left/right spots you were seeing.
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
       ATTACH
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

            return;
        }


        /*
         * Remove an old wrapper if one exists.
         */

        if (
            currentWrapper &&
            currentWrapper.parentNode
        ) {

            currentWrapper.remove();

        }


        const wrapper =
            document.createElement(
                "div"
            );


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
         * IMPORTANT:
         * Append the wrapper to the existing
         * Discord container, then put the card
         * inside it.
         */

        container.appendChild(
            wrapper
        );


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


        attachWaveform(
            card
        );
    }


    /* =================================================
       GET PLAYBACK POSITION
    ================================================= */

    function getPlaybackPosition() {

        let position =
            spotifyState.position;


        /*
         * If Spotify is playing, advance the
         * position between Lanyard updates.
         */

        if (
            spotifyState.playing
        ) {

            position +=
                performance.now() -
                spotifyState.timestamp;
        }


        if (
            spotifyState.duration > 0
        ) {

            position =
                position %
                spotifyState.duration;
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
         * 20 updates/sec.
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
            getPlaybackPosition();


        /*
         * Convert playback position to
         * seconds.
         */

        const seconds =
            position / 1000;


        /*
         * If Spotify isn't playing,
         * keep a tiny idle pulse instead
         * of completely killing the glow.
         */

        const playbackSpeed =
            spotifyState.playing
                ? 1
                : 0.15;


        for (
            const data of bars
        ) {

            /*
             * Main synchronized movement.
             *
             * Every bar uses the same playback
             * clock, but different phase offsets.
             */

            const primary =
                Math.sin(
                    (
                        seconds *
                        2.8 *
                        playbackSpeed
                    ) +
                    data.phase
                );


            const secondary =
                Math.sin(
                    (
                        seconds *
                        5.1 *
                        playbackSpeed
                    ) +
                    data.phase *
                    1.7
                );


            const tertiary =
                Math.sin(
                    (
                        seconds *
                        1.45 *
                        playbackSpeed
                    ) +
                    data.phase *
                    0.55
                );


            /*
             * Combine waves.
             */

            const wave =
                (
                    primary *
                    0.52
                ) +
                (
                    secondary *
                    0.28
                ) +
                (
                    tertiary *
                    0.20
                );


            /*
             * Normalize -1..1 to 0..1.
             */

            const normalized =
                (
                    wave + 1
                ) * 0.5;


            /*
             * Keep the bars from disappearing.
             */

            const value =
                0.18 +
                normalized *
                0.82;


            const scale =
                MIN_SCALE +
                value *
                MAX_SCALE *
                data.strength;


            const bar =
                data.element;


            /* =================================================
               TRANSFORM ONLY
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


            /*
             * Slight glow variation.
             */

            const glow =
                GLOW_MIN +
                value *
                GLOW_MAX;


            bar.style.filter =
                `drop-shadow(0 0 ${glow * 0.45}px rgba(255,255,255,.85))
                 drop-shadow(0 0 ${glow}px rgba(255,99,202,.9))`;
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

    let resizeTimer =
        null;


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
        "Ralkerie Spotify-position waveform ready."
    );

})();
