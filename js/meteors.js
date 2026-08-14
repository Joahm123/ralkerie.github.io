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

    element.className = "meteor";


    const meteor = {

        element,

        x,
        y,

        /* FAST + DIAGONALLY DOWN RIGHT */

        velocityX:
            900 +
            Math.random() * 400,

        velocityY:
            600 +
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


/* =====================================================
   INITIAL METEORS
===================================================== */

function createInitialMeteors() {

    const width =
        window.innerWidth;

    const amount = 10;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        /*
           Spread across the
           entire top.

           Slightly biased LEFT.
        */

        const x =
            -300 +
            Math.pow(
                Math.random(),
                1.25
            ) *
            (width + 300);


        /*
           Start above screen.
        */

        const y =
            -100 -
            Math.random() * 600;


        createMeteor(
            x,
            y
        );
    }
}


/* =====================================================
   CONTINUOUS SPAWN
===================================================== */

function spawnMeteor() {

    const width =
        window.innerWidth;


    /*
       Spawn across the whole
       top with a slight
       left-side bias.
    */

    const x =
        -250 +
        Math.pow(
            Math.random(),
            1.25
        ) *
        (width + 250);


    const y =
        -80 -
        Math.random() * 300;


    createMeteor(
        x,
        y
    );


    setTimeout(
        spawnMeteor,

        700 +
        Math.random() * 500
    );
}


/* =====================================================
   ANIMATION
===================================================== */

/*
   IMPORTANT:
   This is called meteorLastTime
   instead of lastTime because
   stars.js already uses lastTime.
*/

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


        /*
           Move RIGHT
        */

        meteor.x +=
            meteor.velocityX *
            delta;


        /*
           Move DOWN
        */

        meteor.y +=
            meteor.velocityY *
            delta;


        meteor.element.style.left =
            `${meteor.x}px`;

        meteor.element.style.top =
            `${meteor.y}px`;


        /*
           Despawn once below
           the screen.
        */

        if (
            meteor.y >
            window.innerHeight + 200
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
