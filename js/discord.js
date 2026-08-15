/* =====================================================
   RALKERIE DISCORD
   LANYARD + SPOTIFY SYNC
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

    const REFRESH_TIME = 15000;


    /* =================================================
       CONTAINER
    ================================================= */

    const container =
        document.getElementById(
            "discord-card-container"
        );


    if (!container) {

        console.error(
            "Ralkerie: #discord-card-container not found."
        );

        return;
    }


    console.log(
        "Ralkerie Discord + Spotify sync ready."
    );


    /* =================================================
       ESCAPE HTML
    ================================================= */

    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );

        div.textContent =
            value == null
                ? ""
                : String(value);

        return div.innerHTML;
    }


    /* =================================================
       CLOCK
    ================================================= */

    function getTime() {

        return new Date().toLocaleTimeString(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            }
        );
    }


    function updateClock() {

        const clock =
            document.getElementById(
                "clock-time"
            );


        if (clock) {

            clock.textContent =
                getTime();

        }
    }


    /* =================================================
       GAME
    ================================================= */

    function getGame(activities) {

        if (
            !Array.isArray(
                activities
            )
        ) {

            return null;
        }


        for (
            const activity
            of activities
        ) {

            if (
                activity &&
                activity.type === 0
            ) {

                return activity;
            }
        }


        return null;
    }


    /* =================================================
       AVATAR
    ================================================= */

    function getAvatar(user) {

        if (
            user &&
            user.avatar
        ) {

            return (
                "https://cdn.discordapp.com/avatars/" +
                user.id +
                "/" +
                user.avatar +
                ".png?size=128"
            );
        }


        return (
            "https://cdn.discordapp.com/" +
            "embed/avatars/0.png"
        );
    }


    /* =================================================
       SPOTIFY SYNC
    ================================================= */

    function sendSpotifyData(data) {

        /*
         * Check whether Lanyard actually gave
         * us Spotify information.
         */

        if (
            !data
        ) {

            console.log(
                "Ralkerie Spotify: no Lanyard data."
            );

            return;
        }


        const spotify =
            data.spotify;


        /*
         * No Spotify currently.
         */

        if (
            !spotify ||
            !data.listening_to_spotify
        ) {

            console.log(
                "Ralkerie Spotify: not currently listening."
            );


            window.dispatchEvent(
                new CustomEvent(
                    "ralkerie:spotify",
                    {
                        detail: {

                            playing: false,

                            position: 0,

                            duration: 0,

                            trackId: null,

                            spotify: null

                        }
                    }
                )
            );


            return;
        }


        /* =================================================
           TIMESTAMPS
        ================================================= */

        const start =
            Number(
                spotify.timestamps &&
                spotify.timestamps.start
                    ? spotify.timestamps.start
                    : 0
            );


        const end =
            Number(
                spotify.timestamps &&
                spotify.timestamps.end
                    ? spotify.timestamps.end
                    : 0
            );


        const now =
            Date.now();


        /*
         * Current playback position.
         */

        let position =
            start > 0
                ? now - start
                : 0;


        /*
         * Total duration.
         */

        let duration =
            end > start
                ? end - start
                : 0;


        /*
         * Sanity checks.
         */

        if (
            position < 0
        ) {

            position = 0;
        }


        if (
            duration > 0 &&
            position > duration
        ) {

            position = duration;
        }


        /* =================================================
           TRACK ID
        ================================================= */

        const trackId =
            (
                spotify.song ||
                ""
            ) +
            "|" +
            (
                spotify.artist ||
                ""
            );


        /* =================================================
           LOG
        ================================================= */

        console.log(
            "Ralkerie Spotify:",
            spotify.song ||
                "Unknown song"
        );


        console.log(
            "Artist:",
            spotify.artist ||
                "Unknown artist"
        );


        console.log(
            "Position:",
            Math.floor(
                position / 1000
            ) +
            "s / " +
            Math.floor(
                duration / 1000
            ) +
            "s"
        );


        console.log(
            "Spotify timestamps:",
            spotify.timestamps
        );


        /* =================================================
           SEND TO WAVEFORM
        ================================================= */

        window.dispatchEvent(
            new CustomEvent(
                "ralkerie:spotify",
                {
                    detail: {

                        playing: true,

                        position:
                            position,

                        duration:
                            duration,

                        trackId:
                            trackId,

                        spotify:
                            spotify

                    }
                }
            )
        );
    }


    /* =================================================
       RENDER DISCORD
    ================================================= */

    function renderDiscord(data) {

        if (
            !data ||
            !data.discord_user
        ) {

            console.error(
                "Ralkerie: invalid Discord data."
            );

            return;
        }


        /*
         * SEND SPOTIFY DATA FIRST
         */

        sendSpotifyData(
            data
        );


        const user =
            data.discord_user;


        const username =
            user.global_name ||
            user.display_name ||
            user.username ||
            "Unknown";


        const status =
            data.discord_status ||
            "offline";


        const avatar =
            getAvatar(
                user
            );


        /* =================================================
           GAME
        ================================================= */

        const game =
            getGame(
                data.activities
            );


        let gameHTML =
            "";


        if (
            game
        ) {

            gameHTML = `

                <div class="discord-activity">

                    <div class="discord-activity-title">
                        PLAYING
                    </div>

                    <div class="discord-activity-text">
                        ${escapeHTML(
                            game.name
                        )}
                    </div>

                </div>

            `;
        }


        /* =================================================
           SPOTIFY CARD
        ================================================= */

        let spotifyHTML =
            "";


        if (
            data.listening_to_spotify &&
            data.spotify
        ) {

            const spotify =
                data.spotify;


            spotifyHTML = `

                <div class="discord-spotify">

                    <div class="discord-section-label">
                        SPOTIFY
                    </div>

                    <div class="spotify-row">

                        ${
                            spotify.album_art_url
                                ? `
                                    <img
                                        class="spotify-art"
                                        src="${escapeHTML(
                                            spotify.album_art_url
                                        )}"
                                        alt="Album artwork"
                                        loading="eager"
                                        width="48"
                                        height="48"
                                    >
                                  `
                                : ""
                        }

                        <div>

                            <div class="spotify-song">
                                ${escapeHTML(
                                    spotify.song
                                )}
                            </div>

                            <div class="spotify-artist">
                                ${escapeHTML(
                                    spotify.artist
                                )}
                            </div>

                        </div>

                    </div>

                </div>

            `;
        }


        /* =================================================
           FIND CARD
        ================================================= */

        let card =
            container.querySelector(
                ".discord-live-card"
            );


        /*
         * Create card only if necessary.
         */

        if (
            !card
        ) {

            card =
                document.createElement(
                    "div"
                );


            card.className =
                "discord-live-card";


            /*
             * If waveform wrapper already
             * exists, keep card inside it.
             */

            const wrapper =
                container.querySelector(
                    ".waveform-wrapper"
                );


            if (
                wrapper
            ) {

                wrapper.appendChild(
                    card
                );

            } else {

                container.appendChild(
                    card
                );

            }
        }


        /* =================================================
           UPDATE CARD CONTENT
           
           IMPORTANT:
           We ONLY change card.innerHTML.
           We NEVER remove the waveform wrapper.
        ================================================= */

        card.innerHTML = `

            <div class="discord-profile">

                <img
                    class="discord-avatar"
                    src="${escapeHTML(
                        avatar
                    )}"
                    alt="Discord avatar"
                    loading="eager"
                    width="64"
                    height="64"
                >

                <div>

                    <div class="discord-name">
                        ${escapeHTML(
                            username
                        )}
                    </div>

                    <div
                        class="discord-status status-${escapeHTML(
                            status
                        )}"
                    >
                        ${escapeHTML(
                            status.toUpperCase()
                        )}
                    </div>

                </div>

            </div>


            ${gameHTML}


            ${spotifyHTML}


            <div class="local-clock">

                <div
                    id="clock-time"
                    class="clock-time"
                >
                    ${getTime()}
                </div>

                <div class="clock-label">
                    LOCAL TIME
                </div>

            </div>

        `;


        updateClock();
    }


    /* =================================================
       ERROR CARD
    ================================================= */

    function showError() {

        let card =
            container.querySelector(
                ".discord-live-card"
            );


        if (
            !card
        ) {

            card =
                document.createElement(
                    "div"
                );


            card.className =
                "discord-live-card";


            const wrapper =
                container.querySelector(
                    ".waveform-wrapper"
                );


            if (
                wrapper
            ) {

                wrapper.appendChild(
                    card
                );

            } else {

                container.appendChild(
                    card
                );

            }
        }


        card.innerHTML = `

            <div class="discord-profile">

                <div>

                    <div class="discord-name">
                        DISCORD
                    </div>

                    <div class="
                        discord-status
                        status-offline
                    ">
                        OFFLINE
                    </div>

                </div>

            </div>


            <div class="local-clock">

                <div
                    id="clock-time"
                    class="clock-time"
                >
                    ${getTime()}
                </div>

                <div class="clock-label">
                    LOCAL TIME
                </div>

            </div>

        `;


        /*
         * Tell waveform Spotify isn't
         * available.
         */

        window.dispatchEvent(
            new CustomEvent(
                "ralkerie:spotify",
                {
                    detail: {

                        playing: false,

                        position: 0,

                        duration: 0,

                        trackId: null,

                        spotify: null

                    }
                }
            )
        );


        updateClock();
    }


    /* =================================================
       LOAD DISCORD
    ================================================= */

    let loading =
        false;


    async function loadDiscord() {

        /*
         * Don't allow two requests
         * at the same time.
         */

        if (
            loading
        ) {

            return;
        }


        loading =
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


            /* =================================================
               DEBUG LANYARD DATA

               This lets us see exactly what
               Lanyard is sending.
            ================================================= */

            console.log(
                "RALKERIE LANYARD DATA:",
                result.data
            );


            if (
                !result ||
                !result.success ||
                !result.data
            ) {

                throw new Error(
                    "Invalid Lanyard response."
                );
            }


            renderDiscord(
                result.data
            );


        } catch (
            error
        ) {

            console.error(
                "Ralkerie Discord error:",
                error
            );


            const existingCard =
                container.querySelector(
                    ".discord-live-card"
                );


            /*
             * Don't destroy a working card
             * just because one refresh failed.
             */

            if (
                !existingCard
            ) {

                showError();
            }
        }


        finally {

            loading =
                false;
        }
    }


    /* =================================================
       INITIAL LOAD
    ================================================= */

    loadDiscord();


    /* =================================================
       REFRESH
    ================================================= */

    setInterval(
        loadDiscord,
        REFRESH_TIME
    );


    /* =================================================
       CLOCK
    ================================================= */

    setInterval(
        updateClock,
        1000
    );


})();
