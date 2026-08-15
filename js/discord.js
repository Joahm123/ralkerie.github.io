/* =====================================================
   RALKERIE DISCORD
   STABLE + FAST VERSION

   - Loads Discord immediately
   - Keeps the same card alive
   - Refreshes data every 10 seconds
   - Never replaces the card
   - Won't get stuck on Loading
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


    console.log(
        "Ralkerie Discord starting..."
    );


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

        if (!Array.isArray(activities)) {

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
       CREATE CARD
    ===================================================== */

    function createCard() {

        /*
         * IMPORTANT:
         *
         * Search the ENTIRE container.
         *
         * The waveform may wrap the card.
         */

        let card =
            container.querySelector(
                ".discord-live-card"
            );


        if (card) {

            return card;
        }


        /* =================================================
           CREATE
        ================================================= */

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
         * Add directly to container.
         */

        container.appendChild(
            card
        );


        return card;
    }


    /* =====================================================
       UPDATE CARD
    ===================================================== */

    function updateCard(data) {

        const card =
            createCard();


        /* =================================================
           USER
        ================================================= */

        const user =
            data.discord_user || {};


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

            statusElement.className =
                "discord-status " +
                `status-${status}`;


            statusElement.textContent =
                status.toUpperCase();
        }


        /* =================================================
           AVATAR
        ================================================= */

        let avatar =
            "https://cdn.discordapp.com/embed/avatars/0.png";


        if (
            user.avatar &&
            user.id
        ) {

            avatar =
                "https://cdn.discordapp.com/avatars/" +
                user.id +
                "/" +
                user.avatar +
                ".png?size=256";
        }


        const avatarElement =
            card.querySelector(
                ".discord-avatar"
            );


        if (avatarElement) {

            if (
                avatarElement.src !== avatar
            ) {

                avatarElement.src =
                    avatar;
            }
        }


        /* =================================================
           GAME
        ================================================= */

        const game =
            getGame(
                data.activities
            );


        const activityBox =
            card.querySelector(
                ".discord-activity"
            );


        const activityText =
            card.querySelector(
                ".discord-activity-text"
            );


        if (
            game &&
            activityBox &&
            activityText
        ) {

            activityBox.hidden =
                false;


            activityText.textContent =
                game.name || "Unknown";

        } else if (
            activityBox
        ) {

            activityBox.hidden =
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

        } else if (
            spotifyBox
        ) {

            spotifyBox.hidden =
                true;
        }


        /* =================================================
           CLOCK
        ================================================= */

        updateClock();
    }


    /* =====================================================
       LOAD DISCORD
    ===================================================== */

    async function loadDiscord() {

        try {

            console.log(
                "Ralkerie: fetching Discord..."
            );


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


            updateCard(
                result.data
            );


            console.log(
                "Ralkerie: Discord updated."
            );


        } catch (error) {

            console.error(
                "Ralkerie Discord error:",
                error
            );


            /*
             * IMPORTANT:
             *
             * Don't destroy the card.
             *
             * Just show offline/unavailable.
             */

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

                status.className =
                    "discord-status status-offline";


                status.textContent =
                    "UNAVAILABLE";
            }


            updateClock();
        }
    }


    /* =====================================================
       INITIAL CARD

       Create it immediately so the page
       never waits forever.
    ===================================================== */

    createCard();


    updateClock();


    /* =====================================================
       FIRST DISCORD REQUEST
    ===================================================== */

    loadDiscord();


    /* =====================================================
       REFRESH EVERY 10 SECONDS
    ===================================================== */

    setInterval(
        loadDiscord,
        10000
    );


    /* =====================================================
       CLOCK EVERY SECOND
    ===================================================== */

    setInterval(
        updateClock,
        1000
    );


    console.log(
        "Ralkerie Discord ready."
    );

})();
