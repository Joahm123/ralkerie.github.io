
(function () {

    "use strict";


    /* =====================================================
       SETTINGS
    ===================================================== */

    var USER_ID =
        "1044800788817510460";


    var API_URL =
        "https://api.lanyard.rest/v1/users/" +
        USER_ID;


    var UPDATE_INTERVAL =
        10000;


    /* =====================================================
       FIND LIVE PAGE
    ===================================================== */

    var livePage =
        document.getElementById("live");


    if (!livePage) {

        console.error(
            "Ralkerie Discord: #live not found."
        );

        return;
    }


    console.log(
        "Ralkerie Discord system loaded."
    );


    /* =====================================================
       CLOCK
    ===================================================== */

    function getLocalTime() {

        var now =
            new Date();


        return now.toLocaleTimeString(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    }


    /* =====================================================
       CREATE DISCORD CARD
    ===================================================== */

    function createCard(data) {

        var user =
            data.discord_user;


        var activities =
            data.activities || [];


        var status =
            data.discord_status ||
            "offline";


        /* ================================================
           AVATAR
        ================================================ */

        var avatarURL;


        if (user.avatar) {

            avatarURL =
                "https://cdn.discordapp.com/avatars/" +
                user.id +
                "/" +
                user.avatar +
                ".png?size=256";

        } else {

            avatarURL =
                "https://cdn.discordapp.com/embed/avatars/0.png";

        }


        /* ================================================
           DISPLAY NAME
        ================================================ */

        var displayName =
            user.global_name ||
            user.display_name ||
            user.username ||
            "Unknown";


        /* ================================================
           STATUS
        ================================================ */

        var statusText =
            status.toUpperCase();


        var statusClass =
            "status-" +
            status;


        /* ================================================
           ACTIVITY
        ================================================ */

        var activityHTML = "";


        if (activities.length > 0) {

            var activity =
                activities.find(
                    function (item) {

                        return item.type === 0;

                    }
                );


            if (activity) {

                activityHTML = `

                    <div class="discord-activity">

                        <div class="discord-activity-title">
                            PLAYING
                        </div>

                        <div class="discord-activity-text">
                            ${escapeHTML(
                                activity.name ||
                                "Unknown"
                            )}
                        </div>

                    </div>

                `;

            }

        }


        /* ================================================
           SPOTIFY
        ================================================ */

        var spotifyHTML = "";


        if (
            data.listening_to_spotify &&
            data.spotify
        ) {

            var spotify =
                data.spotify;


            spotifyHTML = `

                <div class="discord-spotify">

                    <div class="discord-section-label">
                        SPOTIFY
                    </div>

                    <div class="spotify-row">

                        <img
                            class="spotify-art"
                            src="${escapeAttribute(
                                spotify.album_art_url
                            )}"
                            alt="Album artwork"
                        >

                        <div>

                            <div class="spotify-song">
                                ${escapeHTML(
                                    spotify.song ||
                                    "Unknown song"
                                )}
                            </div>

                            <div class="spotify-artist">
                                ${escapeHTML(
                                    spotify.artist ||
                                    "Unknown artist"
                                )}
                            </div>

                        </div>

                    </div>

                </div>

            `;

        }


        /* ================================================
           CLOCK
        ================================================ */

        var clockHTML = `

            <div class="local-clock">

                <div
                    id="clock-time"
                    class="clock-time"
                >
                    ${getLocalTime()}
                </div>

                <div class="clock-label">
                    LOCAL TIME
                </div>

            </div>

        `;


        /* ================================================
           CARD
        ================================================ */

        livePage.innerHTML = `

            <div class="discord-live-card">

                <div class="discord-profile">

                    <img
                        class="discord-avatar"
                        src="${escapeAttribute(
                            avatarURL
                        )}"
                        alt="Discord avatar"
                    >

                    <div>

                        <div class="discord-name">
                            ${escapeHTML(
                                displayName
                            )}
                        </div>

                        <div
                            class="
                                discord-status
                                ${statusClass}
                            "
                        >
                            ${escapeHTML(
                                statusText
                            )}
                        </div>

                    </div>

                </div>


                ${activityHTML}


                ${spotifyHTML}


                ${clockHTML}

            </div>

        `;


        startClock();

    }


    /* =====================================================
       CLOCK UPDATE
    ===================================================== */

    var clockInterval =
        null;


    function startClock() {

        if (clockInterval) {

            clearInterval(
                clockInterval
            );

        }


        function updateClock() {

            var clock =
                document.getElementById(
                    "clock-time"
                );


            if (!clock) {

                return;
            }


            clock.textContent =
                getLocalTime();

        }


        updateClock();


        clockInterval =
            setInterval(
                updateClock,
                1000
            );

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        var div =
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
       ESCAPE ATTRIBUTE
    ===================================================== */

    function escapeAttribute(value) {

        return escapeHTML(
            value
        ).replace(
            /"/g,
            "&quot;"
        );

    }


    /* =====================================================
       LOAD DISCORD
    ===================================================== */

    function loadDiscord() {

        fetch(API_URL)

            .then(
                function (response) {

                    if (!response.ok) {

                        throw new Error(
                            "Lanyard HTTP " +
                            response.status
                        );

                    }

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
                            "Invalid Lanyard response."
                        );

                    }


                    createCard(
                        result.data
                    );

                }
            )

            .catch(
                function (error) {

                    console.error(
                        "Ralkerie Discord error:",
                        error
                    );


                    livePage.innerHTML = `

                        <div class="pixel-panel">

                            <p class="pixel-label">
                                RALKERIE
                            </p>

                            <h1>
                                LIVE
                            </h1>

                            <p class="pixel-description">
                                Discord unavailable
                            </p>

                        </div>

                    `;

                }
            );

    }


    /* =====================================================
       START
    ===================================================== */

    loadDiscord();


    /* =====================================================
       REFRESH DISCORD DATA
    ===================================================== */

    setInterval(
        loadDiscord,
        UPDATE_INTERVAL
    );


})();

