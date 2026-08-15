/* =====================================================
   RALKERIE DISCORD
   STABLE REFRESH VERSION

   - Keeps the same Discord card element
   - Prevents 10-second rectangle/stretch glitch
   - Keeps waveform attached
   - Updates Discord information without rebuilding
   - Local clock updates every second
===================================================== */

(() => {

    "use strict";


    /* =====================================================
       SETTINGS
    ===================================================== */

    const USER_ID =
        "1044800788817510460";

    const API_URL =
        "https://api.lanyard.rest/v1/users/" +
        USER_ID;


    /* =====================================================
       CONTAINER
    ===================================================== */

    const cardContainer =
        document.getElementById(
            "discord-card-container"
        );


    if (!cardContainer) {

        console.error(
            "Ralkerie: Discord container not found."
        );

        return;
    }


    console.log(
        "Ralkerie Discord loaded."
    );


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

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


    /* =====================================================
       CLOCK
    ===================================================== */

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


    /* =====================================================
       FIND GAME
    ===================================================== */

    function getGame(activities) {

        if (!activities) {
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


    /* =====================================================
       CREATE CARD ONCE
    ===================================================== */

    function createCard() {

        let card =
            cardContainer.querySelector(
                ".discord-live-card"
            );


        /*
         * IMPORTANT:
         *
         * Only create the card if it
         * doesn't already exist.
         *
         * This prevents the waveform
         * from being destroyed every
         * 10 seconds.
         */

        if (card) {

            return card;
        }


        card =
            document.createElement(
                "div"
            );


        card.className =
            "discord-live-card";


        card.innerHTML = `

            <div class="discord-profile">

                <img
                    class="discord-avatar"
                    src=""
                    alt="Discord avatar"
                >

                <div>

                    <div class="discord-name">
                        Loading...
                    </div>

                    <div class="discord-status status-offline">
                        LOADING
                    </div>

                </div>

            </div>


            <div
                class="discord-activity"
                hidden
            >

                <div class="discord-activity-title">
                    PLAYING
                </div>

                <div class="discord-activity-text"></div>

            </div>


            <div
                class="discord-spotify"
                hidden
            >

                <div class="discord-section-label">
                    SPOTIFY
                </div>

                <div class="spotify-row">

                    <img
                        class="spotify-art"
                        src=""
                        alt="Album artwork"
                    >

                    <div>

                        <div class="spotify-song"></div>

                        <div class="spotify-artist"></div>

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
         * Add the card directly.
         *
         * The waveform script will
         * detect it and wrap it once.
         */

        cardContainer.appendChild(
            card
        );


        return card;
    }


    /* =====================================================
       UPDATE EXISTING CARD
    ===================================================== */

    function showDiscord(data) {

        const user =
            data.discord_user;


        const card =
            createCard();


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

            /*
             * Remove old status classes.
             */

            statusElement.classList.remove(
                "status-online",
                "status-idle",
                "status-dnd",
                "status-offline"
            );


            statusElement.classList.add(
                `status-${status}`
            );


            statusElement.textContent =
                status.toUpperCase();
        }


        /* =================================================
           AVATAR
        ================================================= */

        let avatar;


        if (user.avatar) {

            avatar =
                "https://cdn.discordapp.com/avatars/" +
                user.id +
                "/" +
                user.avatar +
                ".png?size=256";

        } else {

            avatar =
                "https://cdn.discordapp.com/embed/avatars/0.png";
        }


        const avatarElement =
            card.querySelector(
                ".discord-avatar"
            );


        if (
            avatarElement &&
            avatarElement.src !== avatar
        ) {

            avatarElement.src =
                avatar;
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
                game.name;

        } else if (activity) {

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


        if (
            spotify &&
            spotifyBox
        ) {

            spotifyBox.hidden =
                false;


            const art =
                spotifyBox.querySelector(
                    ".spotify-art"
                );


            const song =
                spotifyBox.querySelector(
                    ".spotify-song"
                );


            const artist =
                spotifyBox.querySelector(
                    ".spotify-artist"
                );


            if (art) {

                art.src =
                    spotify.album_art_url ||
                    "";
            }


            if (song) {

                song.textContent =
                    spotify.song ||
                    "";
            }


            if (artist) {

                artist.textContent =
                    spotify.artist ||
                    "";
            }

        } else if (spotifyBox) {

            spotifyBox.hidden =
                true;
        }


        /*
         * Update clock without
         * touching card structure.
         */

        updateClock();
    }


    /* =====================================================
       LOAD DISCORD
    ===================================================== */

    async function loadDiscord() {

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
                    `HTTP ${response.status}`
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


            showDiscord(
                result.data
            );

        } catch (error) {

            console.error(
                "Discord error:",
                error
            );


            /*
             * IMPORTANT:
             *
             * Do NOT destroy the card
             * when the API temporarily
             * fails.
             *
             * Just update its status.
             */

            const card =
                createCard();


            const status =
                card.querySelector(
                    ".discord-status"
                );


            if (status) {

                status.classList.remove(
                    "status-online",
                    "status-idle",
                    "status-dnd"
                );


                status.classList.add(
                    "status-offline"
                );


                status.textContent =
                    "UNAVAILABLE";
            }
        }
    }


    /* =====================================================
       START
    ===================================================== */

    createCard();

    loadDiscord();


    /* =====================================================
       DISCORD REFRESH
    ===================================================== */

    setInterval(
        loadDiscord,
        10000
    );


    /* =====================================================
       CLOCK
    ===================================================== */

    setInterval(
        updateClock,
        1000
    );


})();
