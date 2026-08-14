/* =====================================================
   RALKERIE METEORS — OPTIMIZED
===================================================== */

(() => {
    "use strict";

    const container =
        document.getElementById("meteors");

    if (!container) {
        console.error("Meteor container not found.");
        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    const MAX_METEORS = 8;

    const SPAWN_MIN = 900;
    const SPAWN_MAX = 1600;

    const meteors = [];

    let spawnTimer = null;

    let lastTime =
        performance.now();


    /* =================================================
       CREATE METEOR POOL
    ================================================= */

    for (
        let i = 0;
        i < MAX_METEORS;
        i++
    ) {

        const element =
            document.createElement("div");

        element.className =
            "meteor";

        const core =
            document.createElement("div");

        core.className =
            "meteor-core";

        element.appendChild(
            core
        );

        /*
           Hide until needed.
        */

        element.style.display =
            "none";

        container.appendChild(
            element
        );


        meteors.push({

            element,

            active: false,

            x: 0,

            y: 0,

            speedX: 0,

            speedY: 0
        });
    }


    /* =================================================
       GET AVAILABLE METEOR
    ================================================= */

    function getMeteor() {

        for (
            const meteor of meteors
        ) {

            if (
                !meteor.active
            ) {
                return meteor;
            }
        }

        return null;
    }


    /* =================================================
       SPAWN
    ================================================= */

    function spawnMeteor() {

        if (
            document.hidden
        ) {
            return;
        }


        const meteor =
            getMeteor();

        if (!meteor) {
            scheduleSpawn();
            return;
        }


        const width =
            window.innerWidth;


        /*
           LEFT-BIASED SPAWN.
        */

        meteor.x =
            -600 +
            Math.pow(
                Math.random(),
                1.6
            ) *
            (width + 400);


        /*
           Always above screen.
        */

        meteor.y =
            -150 -
            Math.random() * 350;


        meteor.speedX =
            850 +
            Math.random() * 350;


        meteor.speedY =
            550 +
            Math.random() * 250;


        meteor.active =
            true;


        meteor.element.style.display =
            "block";


        meteor.element.style.transform =
            `translate3d(
                ${meteor.x}px,
                ${meteor.y}px,
                0
            ) rotate(34deg)`;


        scheduleSpawn();
    }


    /* =================================================
       SPAWN TIMER
    ================================================= */

    function scheduleSpawn() {

        clearTimeout(
            spawnTimer
        );


        spawnTimer =
            setTimeout(
                spawnMeteor,

                SPAWN_MIN +
                Math.random() *
                (
                    SPAWN_MAX -
                    SPAWN_MIN
                )
            );
    }


    /* =================================================
       DESPAWN
    ================================================= */

    function despawn(
        meteor
    ) {

        meteor.active =
            false;

        meteor.element.style.display =
            "none";
    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(
        time
    ) {

        /*
           Don't accumulate time
           while tab is hidden.
        */

        if (
            document.hidden
        ) {

            lastTime =
                time;

            requestAnimationFrame(
                animate
            );

            return;
        }


        let delta =
            (
                time -
                lastTime
            ) / 1000;


        /*
           Protect against huge
           jumps after lag.
        */

        if (
            delta > 0.05
        ) {
            delta = 0.05;
        }


        lastTime =
            time;


        const bottom =
            window.innerHeight +
            500;


        for (
            const meteor of meteors
        ) {

            if (
                !meteor.active
            ) {
                continue;
            }


            meteor.x +=
                meteor.speedX *
                delta;


            meteor.y +=
                meteor.speedY *
                delta;


            meteor.element.style.transform =
                `translate3d(
                    ${meteor.x}px,
                    ${meteor.y}px,
                    0
                ) rotate(34deg)`;


            /*
               Remove completely offscreen
               meteors from active use.
            */

            if (
                meteor.y >
                bottom
            ) {

                despawn(
                    meteor
                );
            }
        }


        requestAnimationFrame(
            animate
        );
    }


    /* =================================================
       TAB VISIBILITY
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                clearTimeout(
                    spawnTimer
                );

                spawnTimer =
                    null;

                return;
            }


            /*
               Reset timing so meteors
               don't jump when returning.
            */

            lastTime =
                performance.now();


            if (
                !spawnTimer
            ) {

                scheduleSpawn();
            }
        }
    );


    /* =================================================
       START
    ================================================= */

    scheduleSpawn();

    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie optimized meteors loaded."
    );

})();
