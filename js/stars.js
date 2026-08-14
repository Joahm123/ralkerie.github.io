/* =====================================================
   RALKERIE STARS
   LEFT-HEAVY + CONTINUOUS RESPAWN
===================================================== */

(() => {

    "use strict";


    /* =================================================
       STAR CONTAINER
    ================================================= */

    const starContainer =
        document.getElementById("stars");


    if (!starContainer) {

        console.error(
            "Ralkerie: #stars not found."
        );

        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    const STAR_COUNT = 320;

    const stars = [];


    /* =================================================
       CREATE STARS
    ================================================= */

    for (
        let i = 0;
        i < STAR_COUNT;
        i++
    ) {

        const star =
            document.createElement("div");


        star.className =
            "star";


        /*
           Pixel-sized stars.
        */

        const size =
            Math.random() < 0.8
                ? 1 + Math.random()
                : 2 + Math.random();


        star.style.width =
            `${size}px`;


        star.style.height =
            `${size}px`;


        /*
           LEFT-HEAVY DISTRIBUTION

           70% of stars:
           left 55% of screen

           30%:
           entire screen
        */

        let x;


        if (
            Math.random() < 0.70
        ) {

            x =
                Math.random() *
                (
                    window.innerWidth *
                    0.55
                );

        } else {

            x =
                Math.random() *
                window.innerWidth;
        }


        const y =
            Math.random() *
            window.innerHeight;


        const speed =
            18 +
            Math.random() * 55;


        const data = {

            element: star,

            x: x,

            y: y,

            speed: speed
        };


        /*
           IMPORTANT:

           We use transform for movement,
           so don't use left/top for the
           animation.
        */

        star.style.transform =
            `translate3d(
                ${x}px,
                ${y}px,
                0
            )`;


        starContainer.appendChild(
            star
        );


        stars.push(
            data
        );
    }


    /* =================================================
       ANIMATION
    ================================================= */

    let lastTime =
        performance.now();


    function updateStars(
        time
    ) {

        let delta =
            (
                time -
                lastTime
            ) / 1000;


        lastTime =
            time;


        /*
           Prevent giant jumps after
           lag or switching tabs.
        */

        if (
            delta > 0.05
        ) {

            delta = 0.05;
        }


        const width =
            window.innerWidth;


        const height =
            window.innerHeight;


        /*
           Only animate while visible.
        */

        if (
            !document.hidden
        ) {

            for (
                const star of stars
            ) {

                /*
                   Move right.
                */

                star.x +=
                    star.speed *
                    delta;


                /*
                   STAR LEFT THE SCREEN
                   -------------------

                   Immediately respawn
                   on the LEFT.
                */

                if (
                    star.x >
                    width + 10
                ) {

                    star.x =
                        -10;


                    /*
                       New random Y.
                    */

                    star.y =
                        Math.random() *
                        height;
                }


                /*
                   Apply position.
                */

                star.element.style.transform =
                    `translate3d(
                        ${star.x}px,
                        ${star.y}px,
                        0
                    )`;
            }
        }


        requestAnimationFrame(
            updateStars
        );
    }


    /* =================================================
       TAB SWITCH FIX
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            /*
               Reset the animation clock
               so stars don't teleport after
               returning to the tab.
            */

            lastTime =
                performance.now();

        }
    );


    /* =================================================
       RESIZE
    ================================================= */

    window.addEventListener(
        "resize",
        () => {

            const height =
                window.innerHeight;


            for (
                const star of stars
            ) {

                /*
                   Keep stars inside the
                   new screen height.
                */

                if (
                    star.y >
                    height
                ) {

                    star.y =
                        Math.random() *
                        height;
                }
            }

        },
        {
            passive: true
        }
    );


    /* =================================================
       START
    ================================================= */

    requestAnimationFrame(
        updateStars
    );


    console.log(
        "Ralkerie stars loaded."
    );

})();
