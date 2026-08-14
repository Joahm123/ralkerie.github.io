/* =====================================================
   RALKERIE METEORS — OPTIMIZED + CLICK EXPLOSIONS
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
           IMPORTANT:
           Meteors can now receive clicks.
        */

        element.style.pointerEvents =
            "auto";

        element.style.display =
            "none";


        container.appendChild(
            element
        );


        const meteor = {

            element,

            active: false,

            x: 0,

            y: 0,

            speedX: 0,

            speedY: 0
        };


        meteors.push(
            meteor
        );


        /* =============================================
           CLICK METEOR
        ============================================= */

        element.addEventListener(
            "pointerdown",
            (event) => {

                event.stopPropagation();

                if (
                    !meteor.active
                ) {
                    return;
                }


                /*
                   Remember explosion position.
                */

                const explosionX =
                    meteor.x;

                const explosionY =
                    meteor.y;


                /*
                   Remove meteor immediately.
                */

                despawn(
                    meteor
                );


                /*
                   Create explosion.
                */

                createExplosion(
                    explosionX,
                    explosionY
                );
            }
        );
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
       SPAWN METEOR
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
           Spawn above screen.
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
       EXPLOSION
    ================================================= */

    function createExplosion(
        x,
        y
    ) {

        const explosion =
            document.createElement(
                "div"
            );

        explosion.className =
            "meteor-explosion";


        explosion.style.left =
            `${x}px`;

        explosion.style.top =
            `${y}px`;


        /*
           White flash.
        */

        const flash =
            document.createElement(
                "div"
            );

        flash.className =
            "meteor-flash";


        explosion.appendChild(
            flash
        );


        /*
           Create a small number
           of particles for performance.
        */

        const particleCount =
            16;


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const particle =
                document.createElement(
                    "div"
                );

            particle.className =
                "meteor-particle";


            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                30 +
                Math.random() * 90;


            particle.style.setProperty(
                "--particle-x",
                `${Math.cos(angle) * distance}px`
            );


            particle.style.setProperty(
                "--particle-y",
                `${Math.sin(angle) * distance}px`
            );


            particle.style.animationDelay =
                `${Math.random() * 80}ms`;


            explosion.appendChild(
                particle
            );
        }


        container.appendChild(
            explosion
        );


        /*
           Automatically remove the
           explosion after its animation.
        */

        setTimeout(
            () => {

                explosion.remove();

            },
            700
        );
    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(
        time
    ) {

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
               Despawn below screen.
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
        "Ralkerie meteors loaded — click explosions enabled."
    );

})();
