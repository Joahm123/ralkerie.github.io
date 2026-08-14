/* =====================================================
   METEORS
===================================================== */

const meteorContainer =
    document.getElementById("meteors");

const meteors = [];


/* =====================================================
   CREATE
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

        velocityX:
            1050 +
            Math.random() * 450,

        velocityY:
            700 +
            Math.random() * 300
    };


    element.style.left =
        x + "px";

    element.style.top =
        y + "px";


    meteorContainer.appendChild(
        element
    );

    meteors.push(
        meteor
    );
}


/* =====================================================
   INITIAL SPREAD
===================================================== */

function createInitialMeteorSpread() {

    const width =
        window.innerWidth;

    const sections = 16;


    for (
        let i = 0;
        i < sections;
        i++
    ) {

        const sectionWidth =
            width / sections;


        let x =
            i * sectionWidth +
            Math.random() *
            sectionWidth -
            width * 0.15;


        x =
            Math.max(
                0,
                x
            );


        const y =
            -50 -
            Math.random() * 500;


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


    const random =
        Math.random();


    const x =
        random *
        random *
        width;


    const y =
        -50 -
        Math.random() * 350;


    createMeteor(
        x,
        y
    );


    setTimeout(
        spawnMeteor,

        450 +
        Math.random() * 250
    );
}


/* =====================================================
   MOVEMENT
===================================================== */

let lastMeteorTime =
    performance.now();


function updateMeteors(time) {

    const delta =
        (time - lastMeteorTime) / 1000;

    lastMeteorTime =
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
            meteor.x + "px";

        meteor.element.style.top =
            meteor.y + "px";


        if (
            meteor.x >
                window.innerWidth + 900
            &&
            meteor.y >
                window.innerHeight + 900
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

createInitialMeteorSpread();


setTimeout(
    spawnMeteor,
    1200
);


requestAnimationFrame(
    updateMeteors
);
