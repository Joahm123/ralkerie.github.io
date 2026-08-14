/* =====================================================
   RALKERIE METEORS
===================================================== */

(() => {

    const meteorContainer =
        document.getElementById("meteors");

    if (!meteorContainer) {
        console.error("Meteor container not found.");
        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    const meteors = [];

    const MAX_METEORS = 10;

    const SPAWN_MIN = 700;
    const SPAWN_MAX = 1200;

    let meteorSpawnTimer = null;

    let meteorLastTime =
        performance.now();


    /* =================================================
       CREATE METEOR
    ================================================= */

    function createMeteor(x, y) {

        /*
           Don't create unlimited meteors.
        */

        if (meteors.length >= MAX_METEORS) {
            return;
        }


        const element =
            document.createElement("div");

        element.className =
            "meteor";


        /*
           White center.
        */

        const core =
            document.createElement("div");

        core.className =
            "meteor-core";

        element.appendChild(
            core
        );


        const meteor = {

            element,

            x,

            y,

            speedX:
                850 +
                Math.random() * 350,

            speedY:
                550 +
                Math.random() * 250
        };


        element.style.left =
            `${x}px`;

        element.style.top =
            `${y}px`;


        meteorContainer.appendChild(
            element
        );

        meteors.push(
            meteor
        );
    }


    /* =================================================
       SPAWN
    ================================================= */

    function spawnMeteor() {

        /*
           If the tab was hidden,
           don't dump a bunch of
           meteors onto the screen.
        */

        if (
            document.hidden
        ) {
            return;
        }


        if (
            meteors.length >=
            MAX_METEORS
        ) {
            return;
        }


        const width =
            window.innerWidth;


        /*
           Spawn across the entire
           top with a slight LEFT
           bias.
        */

        const x =
            -250 +
            Math.pow(
                Math.random(),
                1.2
            ) *
            (width + 250);


        const y =
            -120 -
            Math.random() * 250;


        createMeteor(
            x,
            y
        );


        scheduleMeteor();
    }


    /* =================================================
       SCHEDULE
    ================================================= */

    function scheduleMeteor() {

        clearTimeout(
            meteorSpawnTimer
        );


        const delay =
            SPAWN_MIN +
            Math.random() *
            (
                SPAWN_MAX -
                SPAWN_MIN
            );


        meteorSpawnTimer =
            setTimeout(
                spawnMeteor,
                delay
            );
    }


    /* =================================================
       INITIAL METEORS
    ================================================= */

    function createInitialMeteors() {

        const width =
            window.innerWidth;


        /*
           Only a few initially.
        */

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const x =
                -250 +
                Math.random() *
                (width + 250);


            const y =
                -100 -
                Math.random() * 500;


            createMeteor(
                x,
                y
            );
        }
    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(now) {

        /*
           Reset the clock when the
           tab comes back.

           This prevents a giant
           time jump.
        */

        if (
            document.hidden
        ) {

            meteorLastTime =
                now;

            requestAnimationFrame(
                animate
            );

            return;
        }


        let delta =
            (now - meteorLastTime)
            / 1000;


        /*
           Never allow a huge frame.
        */

        delta =
            Math.min(
                delta,
                0.05
            );


        meteorLastTime =
            now;


        for (
            let i = meteors.length - 1;
            i >= 0;
            i--
        ) {

            const meteor =
                meteors[i];


            meteor.x +=
                meteor.speedX *
                delta;


            meteor.y +=
                meteor.speedY *
                delta;


            meteor.element.style.left =
                `${meteor.x}px`;

            meteor.element.style.top =
                `${meteor.y}px`;


            /*
               Remove once below
               the screen.
            */

            if (
                meteor.y >
                window.innerHeight + 400
            ) {

                meteor.element.remove();

                meteors.splice(
                    i,
                    1
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

                /*
                   Stop spawning while
                   tab is hidden.
                */

                clearTimeout(
                    meteorSpawnTimer
                );

                meteorSpawnTimer =
                    null;

                return;
            }


            /*
               Reset animation clock.
            */

            meteorLastTime =
                performance.now();


            /*
               Resume normal spawning
               with ONE meteor.
            */

            if (
                !meteorSpawnTimer
            ) {

                scheduleMeteor();
            }
        }
    );


    /* =================================================
       START
    ================================================= */

    createInitialMeteors();

    scheduleMeteor();

    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie meteors loaded."
    );

})();
