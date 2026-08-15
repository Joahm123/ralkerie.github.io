(function () {

    "use strict";

    var USER_ID =
        "1044800788817510460";

    var API_URL =
        "https://api.lanyard.rest/v1/users/" +
        USER_ID;

    var cardContainer =
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

        var div =
            document.createElement("div");

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


    /* =====================================================
       UPDATE CLOCK
    ===================================================== */

    function updateClock() {

        var clock =
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
            var i = 0;
            i < activities.length;
            i++
        ) {

            var activity =
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
       DISPLAY DISCORD
    ===================================================== */

    function showDiscord(data) {

        var user =
            data.discord_user;


        var username =
            user.global_name ||
            user.display_name ||
            user.username ||
            "Unknown";


        var status =
            data.discord_status ||
            "offline";


        var avatar;


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


        /* =================================================
           GAME
        ================================================= */

        var game =
            getGame(
                data.activities
            );


        var gameHTML = "";


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

        var spotifyHTML = "";


        if (
            data.listening_to_spotify &&
            data.spotify
        ) {

            spotifyHTML = `

                <div class="discord-spotify">

                    <div class="discord-section-label">
                        SPOTIFY
                    </div>

                    <div class="spotify-row">

                        <img
                            class="spotify-art"
                            src="${escapeHTML(
                                data.spotify.album_art_url
                            )}"
                            alt="Album artwork"
                        >

                        <div>

                            <div class="spotify-song">
                                ${escapeHTML(
                                    data.spotify.song
                                )}
                            </div>

                            <div class="spotify-artist">
                                ${escapeHTML(
                                    data.spotify.artist
                                )}
                            </div>

                        </div>

                    </div>

                </div>

            `;

        }


        /* =================================================
           CARD
        ================================================= */

        cardContainer.innerHTML = `

            <div class="discord-live-card">

                <div class="discord-profile">

                    <img
                        class="discord-avatar"
                        src="${avatar}"
                        alt="Discord avatar"
                    >

                    <div>

                        <div class="discord-name">
                            ${escapeHTML(
                                username
                            )}
                        </div>

                        <div
                            class="
                                discord-status
                                status-${escapeHTML(
                                    status
                                )}
                            "
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

            </div>

        `;


        updateClock();

    }


    /* =====================================================
       LOAD DISCORD
    ===================================================== */

    function loadDiscord() {

        fetch(
            API_URL,
            {
                cache: "no-store"
            }
        )

        .then(
            function (response) {

                return response.json();

            }
        )

        .then(
            function (result) {

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

            }
        )

        .catch(
            function (error) {

                console.error(
                    "Discord error:",
                    error
                );


                cardContainer.innerHTML = `

                    <div class="discord-live-card">

                        <div class="discord-name">
                            DISCORD
                        </div>

                        <div class="
                            discord-status
                            status-offline
                        ">
                            UNAVAILABLE
                        </div>

                    </div>

                `;

            }
        );

    }


    /* =====================================================
       START
    ===================================================== */

    loadDiscord();


    /* Refresh Discord */

    setInterval(
        loadDiscord,
        10000
    );


    /* Clock */

    setInterval(
        updateClock,
        1000
    );


})();
