/* =====================================================
   RALKERIE DISCORD
   STABLE VERSION

   - Lanyard Discord presence
   - Spotify
   - Game activity
   - Local clock
   - Refreshes every 15 seconds
   - Does NOT create/remove waveform wrappers
   - Does NOT show permanent "loading"
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

    const REFRESH_TIME =
        15000;


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
        "Ralkerie Discord system loaded."
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
       FIND GAME
    ================================================= */

    function getGame(activities) {

        if (
            !Array.isArray(activities)
        ) {

            return null;
        }


        for (
            let i = 0;
            i < activities.length;
            i++
        ) {

            const activity =
                activities[i];


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
       GET AVATAR
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
       RENDER CARD
    ================================================= */

    function renderDiscord(data) {

        if (
            !data ||
            !data.discord_user
        ) {

            return;
        }


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


        let gameHTML =
            "";


        if (game) {

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
           SPOTIFY
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
           CREATE CARD
           
           IMPORTANT:
           We replace ONLY the contents of the
           Discord card itself.

           We never touch its parent wrapper.
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


            /*
             * If waveform already wrapped the
             * card, append it to the wrapper.
             *
             * Otherwise append normally.
             */

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
           UPDATE CARD CONTENT
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


        /*
         * Do NOT replace the whole container.
         * This prevents the waveform from being
         * destroyed.
         */

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

        updateClock();
    }


    /* =================================================
       LOAD DISCORD
    ================================================= */

    let loading =
        false;


    async function loadDiscord() {

        /*
         * Prevent overlapping requests.
         */

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


            console.log(
                "Ralkerie Discord updated."
            );

        }

        catch (error) {

            console.error(
                "Ralkerie Discord error:",
                error
            );


            /*
             * Only show the error if we
             * don't already have a card.
             */

            const existingCard =
                container.querySelector(
                    ".discord-live-card"
                );


            if (!existingCard) {

                showError();
            }
        }

        finally {

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
        "Ralkerie Discord ready."
    );

})();
