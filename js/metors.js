/* =====================================================
   RALKERIE METEORS
===================================================== */

const meteorContainer =
    document.getElementById("meteors");

const meteors = [];


/* =====================================================
   CREATE METEOR
===================================================== */

function createMeteor(x, y) {

    const element =
        document.createElement("div");

    element.className =
        "meteor";


    const meteor = {

        element,

        x,

        y,

        /*
           FAST RIGHT
        */

        velocityX:
            1000 +
            Math.random() * 400,

        /*
           DOWN
        */

        velocityY:
            650 +
            Math.random() * 300
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


/* =====================================================
   INITIAL METEORS
===================================================== */

function createInitialMeteors() {

    const width =
        window.innerWidth;


    /*
       Spread them across
       the ENTIRE top.

       12 separate zones.
    */

    const zones = 12;


    for (
        let i = 0;
        i < zones;
        i++
    ) {

        const zoneWidth =
            width / zones;


        /*
           Random position
           inside each zone.

           This guarantees
           the entire width
           gets covered.
        */

        const x =
            i * zoneWidth +
            Math.random() *
            zoneWidth;


        /*
           Above the screen.
        */

        const y =
            -100 -
            Math.random() * 500;


        createMeteor(
            x,
            y
        );
    }
}


/* =====================================================
   CONTINUOUS SPAWNING
===================================================== */

function spawnMeteor() {

    /*
       Anywhere across
       the ENTIRE top.
    */

    const x =
        Math.random() *
        window.innerWidth;


    const y =
        -100 -
        Math.random() * 400;


    createMeteor(
        x,
        y
    );


    /*
       Less frequent spawning.
    */

    setTimeout(
        spawnMeteor,

        550 +
        Math.random() * 300
    );
}


/* =====================================================
   MOVEMENT
===================================================== */

let meteorLastTime =
    performance.now();


function updateMeteors(time) {

    const delta =
        (time - meteorLastTime) / 1000;

    meteorLastTime =
        time;


    for (
        let i = meteors.length - 1;
        i >= 0;
        i--
    ) {

        const meteor =
            meteors[i];


        meteor.x +=
            meteor.velocityX *
            delta;


        meteor.y +=
            meteor.velocityY *
            delta;


        meteor.element.style.left =
            `${meteor.x}px`;

        meteor.element.style.top =
            `${meteor.y}px`;


        /*
           Delete once it is
           completely offscreen.
        */

        if (
            meteor.x >
                window.innerWidth + 1000
            &&
            meteor.y >
                window.innerHeight + 1000
        ) {

            meteor.element.remove();

            meteors.splice(
                i,
                1
            );
        }
    }


    requestAnimationFrame(
        updateMeteors
    );
}


/* =====================================================
   START
===================================================== */

createInitialMeteors();


setTimeout(
    spawnMeteor,
    1000
);


requestAnimationFrame(
    updateMeteors
);
