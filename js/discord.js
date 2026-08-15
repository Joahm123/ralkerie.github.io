/* =====================================================
   RALKERIE DISCORD
   LANYARD + SPOTIFY SYNC
===================================================== */

(() => {

    "use strict";

    const USER_ID =
        "1044800788817510460";

    const API_URL =
        "https://api.lanyard.rest/v1/users/" +
        USER_ID;

    const REFRESH_TIME = 15000;

    const container =
        document.getElementById(
            "discord-card-container"
        );

    if (!container) {
        console.error(
            "Ralkerie: Discord container not found."
        );
        return;
    }


    /* =================================================
       ESCAPE
    ================================================= */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

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

        if (!Array.isArray(activities)) {
            return null;
        }

        for (
            const activity of activities
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
       SEND SPOTIFY DATA TO WAVEFORM
    ================================================= */

    function sendSpotifyData(data) {

        const spotify =
            data &&
            data.spotify
                ? data.spotify
                : null;


        /*
         * Not listening to Spotify.
         */

        if (
            !spotify ||
            !data.listening_to_spotify
        ) {

            window.dispatchEvent(
                new CustomEvent(
                    "ralkerie:spotify",
                    {
                        detail: {

                            playing: false,

                            spotify: null

                        }
                    }
                )
            );

            return;
        }


        /*
         * Lanyard gives us:
         *
         * timestamps.start
         * timestamps.end
         *
         * This lets us calculate where the
         * song currently is.
         */

        const start =
            Number(
                spotify.timestamps?.start || 0
            );

        const end =
            Number(
                spotify.timestamps?.end || 0
            );


        const now =
            Date.now();


        let position =
            start
                ? now - start
                : 0;


        let duration =
            end && start
                ? end - start
                : 0;


        /*
         * Don't allow weird values.
         */

        if (position < 0) {
            position = 0;
        }


        if (
            duration > 0 &&
            position > duration
        ) {

            position = duration;
        }


        /*
         * Send everything to waveform.js.
         */

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
                            (
                                spotify.song ||
                                ""
                            ) +
                            "|" +
                            (
                                spotify.artist ||
                                ""
                            ),

                        spotify:
                            spotify

                    }
                }
            )
        );


        console.log(
            "Ralkerie Spotify sync:",
            spotify.song,
            Math.floor(position / 1000) +
                "s / " +
                Math.floor(duration / 1000) +
                "s"
        );
    }


    /* =================================================
       RENDER
    ================================================= */

    function renderDiscord(data) {

        if (
            !data ||
            !data.discord_user
        ) {
            return;
        }


        /*
         * FIRST:
         *
         * Tell waveform about Spotify.
         */

        sendSpotifyData(data);


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
            getAvatar(user);


        /* =================================================
           GAME
        ================================================= */

        const game =
            getGame(
                data.activities
            );


        let gameHTML = "";


        if (game) {

            gameHTML = `

                <div class="discord-activity">

                    <div class="discord-activity-title">
                        PLAYING
                    </div>

                    <div class="discord-activity-text">
                        ${escapeHTML(game.name)}
                    </div>

                </div>

            `;
        }


        /* =================================================
           SPOTIFY
        ================================================= */

        let spotifyHTML = "";


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
           FIND EXISTING CARD
        ================================================= */

        let card =
            container.querySelector(
                ".discord-live-card"
            );


        if (!card) {

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


            if (wrapper) {

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
           UPDATE ONLY CARD
        ================================================= */

        card.innerHTML = `

            <div class="discord-profile">

                <img
                    class="discord-avatar"
                    src="${avatar}"
                    alt="Discord avatar"
                    loading="eager"
                    width="64"
                    height="64"
                >

                <div>

                    <div class="discord-name">
                        ${escapeHTML(username)}
                    </div>

                    <div
                        class="discord-status status-${escapeHTML(status)}"
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
       ERROR
    ================================================= */

    function showError() {

        let card =
            container.querySelector(
                ".discord-live-card"
            );


        if (!card) {

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


            if (wrapper) {

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
         * Tell waveform that Spotify
         * isn't available.
         */

        window.dispatchEvent(
            new CustomEvent(
                "ralkerie:spotify",
                {
                    detail: {
                        playing: false,
                        spotify: null
                    }
                }
            )
        );


        updateClock();
    }


    /* =================================================
       LOAD
    ================================================= */

    let loading = false;


    async function loadDiscord() {

        if (loading) {
            return;
        }


        loading = true;


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
                    "Invalid Lanyard response."
                );
            }


            renderDiscord(
                result.data
            );


        } catch (error) {

            console.error(
                "Ralkerie Discord error:",
                error
            );


            const existingCard =
                container.querySelector(
                    ".discord-live-card"
                );


            if (!existingCard) {

                showError();
            }


        } finally {

            loading = false;
        }
    }


    /* =================================================
       START
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


    console.log(
        "Ralkerie Discord + Spotify sync ready."
    );

})();
