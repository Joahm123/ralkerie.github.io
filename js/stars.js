/* =====================================================
   RALKERIE STARS
===================================================== */

(() => {

    const starContainer =
        document.getElementById("stars");

    if (!starContainer) {
        console.error("Star container not found.");
        return;
    }


    /* =================================================
       SETTINGS
    ================================================= */

    const STAR_COUNT = 220;

    const stars = [];

    let starsLastTime =
        performance.now();


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


        const size =
            1 +
            Math.random() * 2.5;


        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;


        const data = {

            element: star,

            x:
                Math.random() *
                window.innerWidth,

            y:
                Math.random() *
                window.innerHeight,

            speed:
                25 +
                Math.random() * 65
        };


        star.style.left =
            `${data.x}px`;

        star.style.top =
            `${data.y}px`;


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

    function updateStars(time) {

        /*
           When the tab is hidden,
           don't accumulate elapsed time.
        */

        if (
            document.hidden
        ) {

            starsLastTime =
                time;

            requestAnimationFrame(
                updateStars
            );

            return;
        }


        let delta =
            (time - starsLastTime)
            / 1000;


        /*
           Prevent huge jumps after
           lag or returning to the tab.
        */

        delta =
            Math.min(
                delta,
                0.05
            );


        starsLastTime =
            time;


        const width =
            window.innerWidth;


        for (
            const star of stars
        ) {

            /*
               Move RIGHT.
            */

            star.x +=
                star.speed *
                delta;


            /*
               Wrap smoothly from
               right → left.

               IMPORTANT:
               Keep the same Y position.
               This prevents the stars
               from bunching up.
            */

            if (
                star.x >
                width + 20
            ) {

                star.x =
                    -20;
            }


            star.element.style.left =
                `${star.x}px`;

            star.element.style.top =
                `${star.y}px`;
        }


        requestAnimationFrame(
            updateStars
        );
    }


    /* =================================================
       TAB VISIBILITY
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            /*
               Reset the animation clock
               whenever the tab changes
               visibility.
            */

            starsLastTime =
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
        "Ralkerie stars loaded."
    );

})();
