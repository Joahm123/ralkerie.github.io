```javascript
(function () {

    "use strict";

    /*
       Your Discord user ID
    */

    var DISCORD_ID =
        "1044800788817510460";


    /*
       Change this to your Cloudflare Worker URL.

       Example:

       https://ralkerie-discord.yourname.workers.dev
    */

    var API_URL =
        "https://YOUR-WORKER-URL.workers.dev";


    var liveSection =
        document.getElementById("live");


    if (!liveSection) {
        console.error(
            "Ralkerie Discord: #live not found."
        );
        return;
    }


    /*
       Build the LIVE card
    */

    liveSection.innerHTML = `
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


            <div
                id="discord-activity"
                class="discord-activity"
            >

                <div class="discord-activity-title">
                    NOTHING PLAYING
                </div>

                <div
                    id="discord-activity-text"
                    class="discord-activity-text"
                >
                    Waiting for Discord...
                </div>

            </div>


            <div
                id="discord-spotify"
                class="discord-spotify hidden"
            >

                <div class="discord-section-label">
                    LISTENING
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


    function element(id) {
        return document.getElementById(id);
    }


    /*
       Update the card
    */

    function updateDiscord(data) {

        if (!data) {
            return;
        }


        var user =
            data.discord_user || {};

        var status =
            data.discord_status || "offline";


        /*
           Username
        */

        element("discord-name").textContent =
            user.global_name ||
            user.username ||
            "Ralkerie";


        /*
           Status
        */

        element("discord-status").textContent =
            status.toUpperCase();


        element("discord-status").className =
            "discord-status status-" + status;


        /*
           Avatar
        */

        if (user.id && user.avatar) {

            var extension =
                user.avatar.startsWith("a_")
                    ? "gif"
                    : "png";


            element("discord-avatar").src =
                "https://cdn.discordapp.com/avatars/" +
                user.id +
                "/" +
                user.avatar +
                "." +
                extension +
                "?size=256";

        }


        /*
           Spotify
        */

        if (
            data.listening_to_spotify &&
            data.spotify
        ) {

            var spotify =
                data.spotify;


            element("discord-spotify")
                .classList.remove("hidden");


            element("spotify-art").src =
                spotify.album_art_url || "";


            element("spotify-song")
                .textContent =
                spotify.song || "Unknown song";


            element("spotify-artist")
                .textContent =
                spotify.artist || "Unknown artist";


        } else {

            element("discord-spotify")
                .classList.add("hidden");

        }


        /*
           Discord activities
        */

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

            element(
                "discord-activity"
            ).classList.remove("hidden");


            var activityType =
                activity.type === 0
                    ? "PLAYING"
                    : activity.type === 1
                    ? "STREAMING"
                    : activity.type === 2
                    ? "LISTENING"
                    : activity.type === 3
                    ? "WATCHING"
                    : activity.type === 5
                    ? "COMPETING"
                    : "ACTIVITY";


            element(
                "discord-activity-title"
            ).textContent =
                activityType;


            element(
                "discord-activity-text"
            ).textContent =
                activity.name || "Unknown";

        } else {

            element(
                "discord-activity-title"
            ).textContent =
                "NOTHING PLAYING";


            element(
                "discord-activity-text"
            ).textContent =
                "No current activity";

        }

    }


    /*
       Get presence
    */

    function loadDiscord() {

        fetch(
            API_URL +
            "/presence/" +
            DISCORD_ID,
            {
                cache: "no-store"
            }
        )

        .then(
            function (response) {

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
            function (data) {

                updateDiscord(data);

            }
        )

        .catch(
            function (error) {

                console.error(
                    "Ralkerie Discord error:",
                    error
                );

                element(
                    "discord-status"
                ).textContent =
                    "UNAVAILABLE";

            }
        );

    }


    /*
       Initial load
    */

    loadDiscord();


    /*
       Refresh every 15 seconds
    */

    setInterval(
        loadDiscord,
        15000
    );


})();
```
