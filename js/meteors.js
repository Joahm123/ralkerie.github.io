/* =====================================================
   RALKERIE METEORS
   OPTIMIZED + CLICKABLE + EXPLOSIONS
===================================================== */

(() => {
    "use strict";


    /* =================================================
       CONTAINER
    ================================================= */

    const container =
        document.getElementById("meteors");

    if (!container) {
        console.error(
            "Meteor container not found."
        );

        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    const MAX_METEORS = 8;

    const SPAWN_MIN = 1000;
    const SPAWN_MAX = 1800;

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
           Meteor itself receives
           pointer events.
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


        /* =================================================
           CLICK / POINTER DETECTION
        ================================================= */

        element.addEventListener(
            "pointerdown",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                if (
                    !meteor.active
                ) {
                    return;
                }


                /*
                   Get the actual screen
                   position of the meteor.
                */

                const rect =
                    element.getBoundingClientRect();


                const explosionX =
                    rect.left +
                    rect.width / 2;


                const explosionY =
                    rect.top +
                    rect.height / 2;


                /*
                   Remove meteor.
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

        /*
           Don't spawn while the
           browser tab is hidden.
        */

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
           LEFT-BIASED SPAWNING.

           This keeps meteors mostly
           toward the left/middle.
        */

        meteor.x =
            -600 +
            Math.pow(
                Math.random(),
                1.6
            ) *
            (width + 400);


        /*
           Start above the screen.
        */

        meteor.y =
            -150 -
            Math.random() * 350;


        /*
           Meteor speed.
        */

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


        /*
           Reset any previous animation
           state.
        */

        meteor.element.style.opacity =
            "1";


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


        /*
           Use screen coordinates.
        */

        explosion.style.position =
            "fixed";


        explosion.style.left =
            `${x}px`;


        explosion.style.top =
            `${y}px`;


        explosion.style.pointerEvents =
            "none";


        /* =================================================
           WHITE/PINK FLASH
        ================================================= */

        const flash =
            document.createElement(
                "div"
            );


        flash.className =
            "meteor-flash";


        explosion.appendChild(
            flash
        );


        /* =================================================
           PARTICLES
        ================================================= */

        const particleCount =
            18;


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


            /*
               Random explosion direction.
            */

            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                35 +
                Math.random() * 100;


            const particleX =
                Math.cos(angle) *
                distance;


            const particleY =
                Math.sin(angle) *
                distance;


            particle.style.setProperty(
                "--particle-x",
                `${particleX}px`
            );


            particle.style.setProperty(
                "--particle-y",
                `${particleY}px`
            );


            /*
               Slightly random particle sizes.
            */

            const size =
                3 +
                Math.random() * 5;


            particle.style.width =
                `${size}px`;


            particle.style.height =
                `${size}px`;


            /*
               Random delay.
            */

            particle.style.animationDelay =
                `${Math.random() * 70}ms`;


            explosion.appendChild(
                particle
            );
        }


        container.appendChild(
            explosion
        );


        /*
           Clean explosion from DOM.
        */

        setTimeout(
            () => {

                explosion.remove();

            },
            750
        );
    }


    /* =================================================
       ANIMATION
    ================================================= */

    function animate(
        time
    ) {

        /*
           Don't process meteors while
           the tab isn't visible.
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
           Prevent giant jumps after
           lag or tab switching.
        */

        if (
            delta > 0.05
        ) {

            delta =
                0.05;
        }


        lastTime =
            time;


        const bottom =
            window.innerHeight +
            500;


        const right =
            window.innerWidth +
            700;


        for (
            const meteor of meteors
        ) {

            if (
                !meteor.active
            ) {

                continue;
            }


            /*
               Move meteor.
            */

            meteor.x +=
                meteor.speedX *
                delta;


            meteor.y +=
                meteor.speedY *
                delta;


            /*
               GPU-friendly movement.
            */

            meteor.element.style.transform =
                `translate3d(
                    ${meteor.x}px,
                    ${meteor.y}px,
                    0
                ) rotate(34deg)`;


            /*
               DESPAWN OFFSCREEN.

               Meteor must be completely
               past the screen before removal.
            */

            if (
                meteor.y >
                bottom ||
                meteor.x >
                right
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
        function () {

            /*
               Stop spawning while hidden.
            */

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
               Reset animation clock
               when returning.
            */

            lastTime =
                performance.now();


            /*
               Resume spawning.
            */

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
        "Ralkerie meteors loaded — clickable explosions enabled."
    );

})();
