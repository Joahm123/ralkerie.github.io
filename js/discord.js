
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


    /*
     * Refresh Discord information every 10 seconds.
     */

    var UPDATE_INTERVAL =
        10000;


    /* =====================================================
       FIND DISCORD CONTAINER
    ===================================================== */

    var cardContainer =
        document.getElementById(
            "discord-card-container"
        );


    if (!cardContainer) {

        console.error(
            "Ralkerie Discord: #discord-card-container not found."
        );

        return;
    }


    console.log(
        "Ralkerie Discord system loaded."
    );


    /* =====================================================
       LOCAL CLOCK
    ===================================================== */

    var clockInterval =
        null;


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


    function startClock() {

        if (clockInterval !== null) {

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
       HTML ESCAPING
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


    function escapeAttribute(value) {

        return escapeHTML(
            value
        ).replace(
            /"/g,
            "&quot;"
        );

    }


    /* =====================================================
       AVATAR
    ===================================================== */

    function getAvatarURL(user) {

        if (
            user &&
            user.avatar
        ) {

            return (
                "https://cdn.discordapp.com/avatars/" +
                user.id +
                "/" +
                user.avatar +
                ".png?size=256"
            );

        }


        return (
            "https://cdn.discordapp.com/embed/avatars/0.png"
        );

    }


    /* =====================================================
       STATUS
    ===================================================== */

    function getStatusText(status) {

        switch (status) {

            case "online":
                return "ONLINE";

            case "idle":
                return "IDLE";

            case "dnd":
                return "DO NOT DISTURB";

            default:
                return "OFFLINE";

        }

    }


    /* =====================================================
       ACTIVITY
    ===================================================== */

    function createActivityHTML(
        activities
    ) {

        if (
            !Array.isArray(
                activities
            )
        ) {

            return "";

        }


        /*
         * Discord activity type 0 =
         * Playing a game.
         */

        var activity =
            activities.find(
                function (item) {

                    return (
                        item &&
                        item.type === 0
                    );

                }
            );


        if (!activity) {

            return "";

        }


        var activityName =
            activity.name ||
            "Unknown";


        var details =
            activity.details ||
            "";


        var state =
            activity.state ||
            "";


        return `

            <div class="discord-activity">

                <div class="discord-activity-title">
                    PLAYING
                </div>

                <div class="discord-activity-text">
                    ${escapeHTML(
                        activityName
                    )}
                </div>

                ${
                    details
                        ? `
                            <div class="discord-activity-details">
                                ${escapeHTML(
                                    details
                                )}
                            </div>
                          `
                        : ""
                }

                ${
                    state
                        ? `
                            <div class="discord-activity-state">
                                ${escapeHTML(
                                    state
                                )}
                            </div>
                          `
                        : ""
                }

            </div>

        `;

    }


    /* =====================================================
       SPOTIFY
    ===================================================== */

    function createSpotifyHTML(
        data
    ) {

        if (
            !data.listening_to_spotify ||
            !data.spotify
        ) {

            return "";

        }


        var spotify =
            data.spotify;


        var albumArt =
            spotify.album_art_url ||
            "";


        var song =
            spotify.song ||
            "Unknown song";


        var artist =
            spotify.artist ||
            "Unknown artist";


        var album =
            spotify.album ||
            "";


        return `

            <div class="discord-spotify">

                <div class="discord-section-label">
                    SPOTIFY
                </div>


                <div class="spotify-row">

                    ${
                        albumArt
                            ? `
                                <img
                                    class="spotify-art"
                                    src="${escapeAttribute(
                                        albumArt
                                    )}"
                                    alt="Album artwork"
                                >
                              `
                            : ""
                    }


                    <div class="spotify-info">

                        <div class="spotify-song">
                            ${escapeHTML(
                                song
                            )}
                        </div>


                        <div class="spotify-artist">
                            ${escapeHTML(
                                artist
                            )}
                        </div>


                        ${
                            album
                                ? `
                                    <div class="spotify-album">
                                        ${escapeHTML(
                                            album
                                        )}
                                    </div>
                                  `
                                : ""
                        }

                    </div>

                </div>

            </div>

        `;

    }


    /* =====================================================
       CLOCK HTML
    ===================================================== */

    function createClockHTML() {

        return `

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

    }


    /* =====================================================
       CREATE DISCORD CARD
    ===================================================== */

    function createCard(
        data
    ) {

        var user =
            data.discord_user ||
            {};


        var status =
            data.discord_status ||
            "offline";


        var activities =
            data.activities ||
            [];


        var displayName =
            user.global_name ||
            user.display_name ||
            user.username ||
            "Unknown";


        var avatarURL =
            getAvatarURL(
                user
            );


        var statusText =
            getStatusText(
                status
            );


        var statusClass =
            "status-" +
            status;


        var activityHTML =
            createActivityHTML(
                activities
            );


        var spotifyHTML =
            createSpotifyHTML(
                data
            );


        var clockHTML =
            createClockHTML();


        /* =================================================
           ONLY REPLACE DISCORD CONTAINER
           
           This is important:
           The username PNG remains untouched.
        ================================================== */

        cardContainer.innerHTML = `

            <div class="discord-live-card">


                <!-- =====================================
                     PROFILE
                ====================================== -->

                <div class="discord-profile">

                    <img
                        class="discord-avatar"
                        src="${escapeAttribute(
                            avatarURL
                        )}"
                        alt="Discord avatar"
                    >


                    <div class="discord-profile-info">

                        <div class="discord-name">
                            ${escapeHTML(
                                displayName
                            )}
                        </div>


                        <div
                            class="
                                discord-status
                                ${escapeAttribute(
                                    statusClass
                                )}
                            "
                        >
                            ${escapeHTML(
                                statusText
                            )}
                        </div>

                    </div>

                </div>


                <!-- =====================================
                     ACTIVITY
                ====================================== -->

                ${activityHTML}


                <!-- =====================================
                     SPOTIFY
                ====================================== -->

                ${spotifyHTML}


                <!-- =====================================
                     LOCAL CLOCK
                ====================================== -->

                ${clockHTML}


            </div>

        `;


        /*
         * Start/restart clock after
         * the HTML has been inserted.
         */

        startClock();

    }


    /* =====================================================
       ERROR CARD
    ===================================================== */

    function showError(
        message
    ) {

        cardContainer.innerHTML = `

            <div class="discord-live-card">

                <div class="discord-name">
                    DISCORD
                </div>


                <div class="discord-status status-offline">
                    OFFLINE
                </div>


                <div class="discord-activity">

                    <div class="discord-activity-title">
                        STATUS
                    </div>

                    <div class="discord-activity-text">
                        ${escapeHTML(
                            message
                        )}
                    </div>

                </div>


                ${createClockHTML()}

            </div>

        `;


        startClock();

    }


    /* =====================================================
       LOAD LANYARD
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
                    !result ||
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


                showError(
                    "Discord unavailable"
                );

            }
        );

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    loadDiscord();


    /* =====================================================
       REFRESH
    ===================================================== */

    setInterval(
        loadDiscord,
        UPDATE_INTERVAL
    );


})();

