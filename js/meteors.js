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

    const METEOR_COUNT = 8;

    const SPAWN_MIN = 500;
    const SPAWN_MAX = 900;


    /* =================================================
       CREATE METEOR
    ================================================= */

    function createMeteor(x, y) {

        const element =
            document.createElement("div");

        element.className = "meteor";


        const meteor = {

            element: element,

            x: x,

            y: y,

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
       INITIAL METEORS
    ================================================= */

    function createInitialMeteors() {

        const width =
            window.innerWidth;


        for (
            let i = 0;
            i < METEOR_COUNT;
            i++
        ) {

            /*
               Entire top of screen.

               Starts slightly offscreen
               so they glide into view.
            */

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
       CONTINUOUS SPAWN
    ================================================= */

    function spawnMeteor() {

        const width =
            window.innerWidth;


        /*
           Entire top.

           Slightly more likely
           toward the LEFT.
        */

        const x =
            -200 +
            Math.pow(
                Math.random(),
                1.2
            ) *
            (width + 200);


        const y =
            -100 -
            Math.random() * 250;


        createMeteor(
            x,
            y
        );


        const delay =
            SPAWN_MIN +
            Math.random() *
            (SPAWN_MAX - SPAWN_MIN);


        setTimeout(
            spawnMeteor,
            delay
        );
    }


    /* =================================================
       ANIMATION
    ================================================= */

    let previousTime =
        performance.now();


    function animate(currentTime) {

        const delta =
            Math.min(
                (currentTime - previousTime) / 1000,
                0.05
            );


        previousTime =
            currentTime;


        for (
            let i = meteors.length - 1;
            i >= 0;
            i--
        ) {

            const meteor =
                meteors[i];


            /*
               RIGHT
            */

            meteor.x +=
                meteor.speedX *
                delta;


            /*
               DOWN
            */

            meteor.y +=
                meteor.speedY *
                delta;


            meteor.element.style.left =
                `${meteor.x}px`;

            meteor.element.style.top =
                `${meteor.y}px`;


            /*
               Remove once well
               below the screen.
            */

            if (
                meteor.y >
                window.innerHeight + 300
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
       START
    ================================================= */

    createInitialMeteors();

    setTimeout(
        spawnMeteor,
        800
    );

    requestAnimationFrame(
        animate
    );


    console.log(
        "Ralkerie meteors loaded."
    );

})();
