/* =====================================================
   RALKERIE STARS
   LEFT-SIDE HEAVY STARFIELD
===================================================== */

(() => {

    "use strict";


    /* =================================================
       CONTAINER
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
           Small pixel sizes.
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
           70% of stars start on
           the LEFT half.

           30% are spread normally.
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


        /*
           Slightly different speeds
           so they don't form a line.
        */

        const speed =
            18 +
            Math.random() * 55;


        const data = {

            element: star,

            x: x,

            y: y,

            speed: speed
        };


        star.style.left =
            `${x}px`;


        star.style.top =
            `${y}px`;


        starContainer.appendChild(
            star
        );


        stars.push(
            data
        );
    }


    /* =================================================
       ANIMATION CLOCK
    ================================================= */

    let lastTime =
        performance.now();


    /* =================================================
       ANIMATION
    ================================================= */

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
           Prevent huge jumps after
           lag/tab switching.
        */

        if (
            delta > 0.05
        ) {

            delta = 0.05;
        }


        /*
           Don't update while the tab
           isn't visible.
        */

        if (
            !document.hidden
        ) {

            const screenWidth =
                window.innerWidth;


            const screenHeight =
                window.innerHeight;


            for (
                const star of stars
            ) {

                star.x +=
                    star.speed *
                    delta;


                /*
                   Wrap to LEFT instead of
                   randomly changing position.

                   This prevents the stars
                   from bunching together.
                */

                if (
                    star.x >
                    screenWidth + 5
                ) {

                    star.x = -5;

                    /*
                       Keep returning stars
                       distributed vertically.
                    */

                    star.y =
                        Math.random() *
                        screenHeight;
                }


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
       RESIZE
    ================================================= */

    window.addEventListener(
        "resize",
        () => {

            /*
               Don't recreate stars.
               This keeps memory/CPU low.
            */

            for (
                const star of stars
            ) {

                if (
                    star.y >
                    window.innerHeight
                ) {

                    star.y =
                        Math.random() *
                        window.innerHeight;
                }
            }

        },
        {
            passive: true
        }
    );


    /* =================================================
       TAB VISIBILITY
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            lastTime =
                performance.now();

        }
    );


    /* =================================================
       START
    ================================================= */

    requestAnimationFrame(
        updateStars
    );


    console.log(
        "Ralkerie stars loaded — left-heavy field."
    );

})();
