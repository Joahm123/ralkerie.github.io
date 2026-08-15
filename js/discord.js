/* =====================================================
   RALKERIE DISCORD
   STABLE / LOW CPU VERSION

   - Loads Lanyard Discord data
   - Does NOT constantly replace the card
   - Keeps card dimensions stable
   - Updates only changed content
   - Local clock
   - Spotify
   - Game activity
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

    const REFRESH_INTERVAL =
        10000;


    /* =================================================
       CONTAINER
    ================================================= */

    const container =
        document.getElementById(
            "discord-card-container"
        );


    if (!container) {

        console.error(
            "Ralkerie Discord: container not found."
        );

        return;
    }


    console.log(
        "Ralkerie Discord loaded."
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

    function getGame(
        activities
    ) {

        if (
            !Array.isArray(
                activities
            )
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

    function getAvatar(
        user
    ) {

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
            "https://cdn.discordapp.com/embed/avatars/0.png"
        );
    }


    /* =================================================
       CREATE CARD ONCE
    ================================================= */

    function createCard() {

        /*
         * If a card already exists,
         * DO NOT create another one.
         */

        let card =
            container.querySelector(
                ".discord-live-card"
            );


        if (card) {

            return card;
        }


        card =
            document.createElement(
                "div"
            );


        card.className =
            "discord-live-card";


        /*
         * Fixed internal structure.
         * The structure never gets replaced
         * during Discord refreshes.
         */

        card.innerHTML = `

            <div class="discord-profile">

                <img
                    class="discord-avatar"
                    src=""
                    alt="Discord avatar"
                >

                <div class="discord-user-info">

                    <div
                        class="discord-name"
                    >
                        Loading...
                    </div>

                    <div
                        class="discord-status"
                    >
                        LOADING
                    </div>

                </div>

            </div>


            <div
                class="discord-activity"
                hidden
            >

                <div
                    class="discord-activity-title"
                >
                    PLAYING
                </div>

                <div
                    class="discord-activity-text"
                ></div>

            </div>


            <div
                class="discord-spotify"
                hidden
            >

                <div
                    class="discord-section-label"
                >
                    SPOTIFY
                </div>

                <div
                    class="spotify-row"
                >

                    <img
                        class="spotify-art"
                        src=""
                        alt="Album artwork"
                    >

                    <div>

                        <div
                            class="spotify-song"
                        ></div>

                        <div
                            class="spotify-artist"
                        ></div>

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

                <div
                    class="clock-label"
                >
                    LOCAL TIME
                </div>

            </div>

        `;


        /*
         * IMPORTANT:
         * Append the card directly.
         *
         * The waveform script is responsible
         * for its own wrapper.
         */

        container.appendChild(
            card
        );


        return card;
    }


    /* =================================================
       UPDATE CARD
    ================================================= */

    function updateDiscord(
        data
    ) {

        if (
            !data ||
            !data.discord_user
        ) {

            return;
        }


        const card =
            createCard();


        const user =
            data.discord_user;


        /* =================================================
           USERNAME
        ================================================= */

        const username =
            user.global_name ||
            user.display_name ||
            user.username ||
            "Unknown";


        const nameElement =
            card.querySelector(
                ".discord-name"
            );


        if (nameElement) {

            nameElement.textContent =
                username;
        }


        /* =================================================
           AVATAR
        ================================================= */

        const avatarElement =
            card.querySelector(
                ".discord-avatar"
            );


        if (avatarElement) {

            const avatar =
                getAvatar(
                    user
                );


            /*
             * Only change src if necessary.
             */

            if (
                avatarElement.src !==
                avatar
            ) {

                avatarElement.src =
                    avatar;
            }
        }


        /* =================================================
           STATUS
        ================================================= */

        const status =
            data.discord_status ||
            "offline";


        const statusElement =
            card.querySelector(
                ".discord-status"
            );


        if (statusElement) {

            statusElement.textContent =
                status.toUpperCase();


            statusElement.className =
                "discord-status status-" +
                escapeHTML(
                    status
                );
        }


        /* =================================================
           GAME
        ================================================= */

        const game =
            getGame(
                data.activities
            );


        const activity =
            card.querySelector(
                ".discord-activity"
            );


        const activityText =
            card.querySelector(
                ".discord-activity-text"
            );


        if (
            game &&
            activity &&
            activityText
        ) {

            activity.hidden =
                false;


            activityText.textContent =
                game.name ||
                "Unknown";
        }

        else if (
            activity
        ) {

            activity.hidden =
                true;
        }


        /* =================================================
           SPOTIFY
        ================================================= */

        const spotify =
            data.listening_to_spotify &&
            data.spotify
                ? data.spotify
                : null;


        const spotifyBox =
            card.querySelector(
                ".discord-spotify"
            );


        const spotifyArt =
            card.querySelector(
                ".spotify-art"
            );


        const spotifySong =
            card.querySelector(
                ".spotify-song"
            );


        const spotifyArtist =
            card.querySelector(
                ".spotify-artist"
            );


        if (
            spotify &&
            spotifyBox &&
            spotifyArt &&
            spotifySong &&
            spotifyArtist
        ) {

            spotifyBox.hidden =
                false;


            spotifySong.textContent =
                spotify.song ||
                "Unknown song";


            spotifyArtist.textContent =
                spotify.artist ||
                "Unknown artist";


            if (
                spotify.album_art_url &&
                spotifyArt.src !==
                spotify.album_art_url
            ) {

                spotifyArt.src =
                    spotify.album_art_url;
            }
        }

        else if (
            spotifyBox
        ) {

            spotifyBox.hidden =
                true;
        }


        updateClock();
    }


    /* =================================================
       LOADING STATE
    ================================================= */

    function showLoading() {

        const card =
            createCard();


        const name =
            card.querySelector(
                ".discord-name"
            );


        const status =
            card.querySelector(
                ".discord-status"
            );


        if (name) {

            name.textContent =
                "Loading...";
        }


        if (status) {

            status.textContent =
                "LOADING";


            status.className =
                "discord-status";
        }
    }


    /* =================================================
       ERROR STATE
    ================================================= */

    function showError() {

        const card =
            createCard();


        const name =
            card.querySelector(
                ".discord-name"
            );


        const status =
            card.querySelector(
                ".discord-status"
            );


        if (name) {

            name.textContent =
                "DISCORD";
        }


        if (status) {

            status.textContent =
                "UNAVAILABLE";


            status.className =
                "discord-status status-offline";
        }


        const activity =
            card.querySelector(
                ".discord-activity"
            );


        const spotify =
            card.querySelector(
                ".discord-spotify"
            );


        if (activity) {

            activity.hidden =
                true;
        }


        if (spotify) {

            spotify.hidden =
                true;
        }
    }


    /* =================================================
       FETCH DISCORD
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


            if (
                !result.success ||
                !result.data
            ) {

                throw new Error(
                    "Invalid Lanyard response"
                );
            }


            updateDiscord(
                result.data
            );


        }

        catch (
            error
        ) {

            console.error(
                "Ralkerie Discord error:",
                error
            );


            showError();

        }

        finally {

            loading =
                false;
        }
    }


    /* =================================================
       INITIAL CARD
    ================================================= */

    createCard();


    /* =================================================
       LOAD
    ================================================= */

    loadDiscord();


    /* =================================================
       REFRESH
    ================================================= */

    setInterval(
        loadDiscord,
        REFRESH_INTERVAL
    );


    /* =================================================
       CLOCK
    ================================================= */

    setInterval(
        updateClock,
        1000
    );


    /* =================================================
       INITIAL CLOCK
    ================================================= */

    updateClock();


    console.log(
        "Ralkerie Discord stable system ready."
    );

})();
