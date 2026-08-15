```javascript
(function () {

    "use strict";

    console.log("Ralkerie Discord loaded.");


    /* =====================================================
       FIND LIVE SECTION
    ===================================================== */

    var liveSection =
        document.getElementById("live");


    if (!liveSection) {

        console.error(
            "Ralkerie Discord: #live not found."
        );

        return;
    }


    /* =====================================================
       FIND THE EXISTING PANEL
    ===================================================== */

    var panel =
        liveSection.querySelector(
            ".pixel-panel"
        );


    if (!panel) {

        console.error(
            "Ralkerie Discord: .pixel-panel not found."
        );

        return;
    }


    /* =====================================================
       CREATE DISCORD CONTENT
    ===================================================== */

    panel.innerHTML = `

        <div class="discord-live-card">

            <div class="discord-profile">

                <img
                    id="discord-avatar"
                    class="discord-avatar"
                    src=""
                    alt="Discord avatar"
                >

                <div class="discord-user">

                    <div
                        id="discord-name"
                        class="discord-name"
                    >
                        Loading...
                    </div>

                    <div
                        id="discord-status"
                        class="discord-status"
                    >
                        CONNECTING
                    </div>

                </div>

            </div>


            <div class="discord-activity">

                <div
                    id="discord-activity-title"
                    class="discord-activity-title"
                >
                    LOADING
                </div>

                <div
                    id="discord-activity-text"
                    class="discord-activity-text"
                >
                    Checking Discord...
                </div>

            </div>


            <div
                id="discord-spotify"
                class="discord-spotify hidden"
            >

                <div class="discord-section-label">
                    LISTENING ON SPOTIFY
                </div>

                <div class="spotify-row">

                    <img
                        id="spotify-art"
                        class="spotify-art"
                        src=""
                        alt="Album art"
                    >

                    <div>

                        <div
                            id="spotify-song"
                            class="spotify-song"
                        >
                            —
                        </div>

                        <div
                            id="spotify-artist"
                            class="spotify-artist"
                        >
                            —
                        </div>

                    </div>

                </div>

            </div>

        </div>

    `;


    /* =====================================================
       HELPER
    ===================================================== */

    function get(id) {

        return document.getElementById(id);

    }


    /* =====================================================
       LOAD DISCORD
    ===================================================== */

    function loadDiscord() {

        console.log(
            "Checking Discord..."
        );


        fetch(
            "/api/discord",
            {
                cache: "no-store"
            }
        )

        .then(
            function (response) {

                console.log(
                    "Discord API status:",
                    response.status
                );


                if (!response.ok) {

                    throw new Error(
                        "HTTP " +
                        response.status
                    );

                }


                return response.json();

            }
        )

        .then(
            function (response) {

                console.log(
                    "Discord API:",
                    response
                );


                if (
                    !response.success ||
                    !response.data
                ) {

                    throw new Error(
                        "Invalid Discord data"
                    );

                }


                updateDiscord(
                    response.data
                );

            }
        )

        .catch(
            function (error) {

                console.error(
                    "Ralkerie Discord:",
                    error
                );


                get(
                    "discord-name"
                ).textContent =
                    "Discord unavailable";


                get(
                    "discord-status"
                ).textContent =
                    "ERROR";

            }
        );

    }


    /* =====================================================
       UPDATE
    ===================================================== */

    function updateDiscord(data) {

        var user =
            data.discord_user || {};


        var status =
            data.discord_status ||
            "offline";


        /* USERNAME */

        get(
            "discord-name"
        ).textContent =
            user.global_name ||
            user.username ||
            "Ralk";


        /* STATUS */

        get(
            "discord-status"
        ).textContent =
            status.toUpperCase();


        get(
            "discord-status"
        ).className =
            "discord-status status-" +
            status;


        /* AVATAR */

        if (
            user.id &&
            user.avatar
        ) {

            var extension =
                user.avatar.indexOf("a_") === 0
                    ? "gif"
                    : "png";


            get(
                "discord-avatar"
            ).src =
                "https://cdn.discordapp.com/avatars/" +
                user.id +
                "/" +
                user.avatar +
                "." +
                extension +
                "?size=256";

        }


        /* =================================================
           SPOTIFY
        ================================================= */

        if (
            data.listening_to_spotify &&
            data.spotify
        ) {

            var spotify =
                data.spotify;


            get(
                "discord-spotify"
            ).classList.remove(
                "hidden"
            );


            get(
                "spotify-art"
            ).src =
                spotify.album_art_url ||
                "";


            get(
                "spotify-song"
            ).textContent =
                spotify.song ||
                "Unknown song";


            get(
                "spotify-artist"
            ).textContent =
                spotify.artist ||
                "Unknown artist";

        } else {

            get(
                "discord-spotify"
            ).classList.add(
                "hidden"
            );

        }


        /* =================================================
           ACTIVITIES
        ================================================= */

        var activities =
            data.activities || [];


        var activity = null;


        for (
            var i = 0;
            i < activities.length;
            i++
        ) {

            if (
                activities[i].type !== 4
            ) {

                activity =
                    activities[i];

                break;
            }

        }


        if (activity) {

            var type =
                "ACTIVITY";


            if (
                activity.type === 0
            ) {

                type =
                    "PLAYING";

            } else if (
                activity.type === 1
            ) {

                type =
                    "STREAMING";

            } else if (
                activity.type === 2
            ) {

                type =
                    "LISTENING";

            } else if (
                activity.type === 3
            ) {

                type =
                    "WATCHING";

            }


            get(
                "discord-activity-title"
            ).textContent =
                type;


            get(
                "discord-activity-text"
            ).textContent =
                activity.name ||
                "Unknown";

        } else {

            get(
                "discord-activity-title"
            ).textContent =
                "NOTHING PLAYING";


            get(
                "discord-activity-text"
            ).textContent =
                "No current activity";

        }

    }


    /* =====================================================
       START
    ===================================================== */

    loadDiscord();


    /*
       Update every 15 seconds
    */

    setInterval(
        loadDiscord,
        15000
    );


})();
```
