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

        if (
            meteors.length >=
            MAX_METEORS
        ) {
            return;
        }


        const element =
            document.createElement("div");

        element.className =
            "meteor";


        /*
           White center of trail
        */

        const core =
            document.createElement("div");

        core.className =
            "meteor-core";

        element.appendChild(
            core
        );


        const meteor = {

            element: element,

            x: x,

            y: y,

            /*
               Fast movement
            */

            speedX:
                850 +
                Math.random() * 350,

            speedY:
                550 +
                Math.random() * 250
        };


        element.style.left =
            `${meteor.x}px`;

        element.style.top =
            `${meteor.y}px`;


        meteorContainer.appendChild(
            element
        );


        meteors.push(
            meteor
        );
    }


    /* =================================================
       SPAWN METEOR
    ================================================= */

    function spawnMeteor() {

        /*
           Never spawn while the
           browser tab is hidden.
        */

        if (
            document.hidden
        ) {
            return;
        }


        /*
           Don't exceed the limit.
        */

        if (
            meteors.length >=
            MAX_METEORS
        ) {
            scheduleMeteor();

            return;
        }


        const width =
            window.innerWidth;


        /*
           LEFT-BIASED SPAWN
           
           Meteors can start far
           outside the left side,
           but can still spawn
           across the screen.
        */

        const x =
            -600 +
            Math.pow(
                Math.random(),
                1.6
            ) *
            (width + 400);


        /*
           Only spawn from ABOVE
           the screen.
        */

        const y =
            -150 -
            Math.random() * 350;


        createMeteor(
            x,
            y
        );


        scheduleMeteor();
    }


    /* =================================================
       SPAWN TIMER
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
           Only four starting meteors.
        */

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            const x =
                -600 +
                Math.pow(
                    Math.random(),
                    1.6
                ) *
                (width + 400);


            const y =
                -150 -
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
           Don't accumulate time while
           the tab is hidden.
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
            (
                now -
                meteorLastTime
            ) / 1000;


        /*
           Prevent huge jumps after
           returning to the tab.
        */

        delta =
            Math.min(
                delta,
                0.05
            );


        meteorLastTime =
            now;


        /* ---------------------------------------------
           MOVE METEORS
        --------------------------------------------- */

        for (
            let i =
                meteors.length - 1;

            i >= 0;

            i--
        ) {

            const meteor =
                meteors[i];


            /*
               Move RIGHT
            */

            meteor.x +=
                meteor.speedX *
                delta;


            /*
               Move DOWN
            */

            meteor.y +=
                meteor.speedY *
                delta;


            meteor.element.style.left =
                `${meteor.x}px`;

            meteor.element.style.top =
                `${meteor.y}px`;


            /* -----------------------------------------
               DESPAWN OFFSCREEN
            ----------------------------------------- */

            if (
                meteor.y >
                window.innerHeight + 500
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
                   Stop the spawn timer.
                */

                clearTimeout(
                    meteorSpawnTimer
                );

                meteorSpawnTimer =
                    null;

                return;
            }


            /*
               Reset animation clock
               when returning.
            */

            meteorLastTime =
                performance.now();


            /*
               Resume with ONE normal
               spawn timer.
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
