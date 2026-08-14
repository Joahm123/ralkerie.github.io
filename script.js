const meteorContainer = document.getElementById("meteors");
const starContainer = document.getElementById("stars");


/* =========================================
   MOVING STARS
========================================= */

function createStar() {
    const star = document.createElement("div");

    star.className = "star";

    const size = 1 + Math.random() * 2;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;

    star.style.animationDuration =
        `${8 + Math.random() * 8}s, ${2 + Math.random() * 3}s`;

    star.style.animationDelay =
        `${Math.random() * -10}s, ${Math.random() * -3}s`;

    starContainer.appendChild(star);
}


for (let i = 0; i < 250; i++) {
    createStar();
}


/* =========================================
   METEOR SETTINGS
========================================= */

const BOX_PADDING = 500;


/* =========================================
   CREATE METEOR
========================================= */

function createMeteor() {

    const meteor = document.createElement("div");

    meteor.className = "meteor";


    /* Long skinny meteor */

    const length =
        400 + Math.random() * 300;

    meteor.style.width =
        `${length}px`;


    /*
        =====================================
        SPAWN FROM TOP EDGE ONLY
        =====================================

        The box is:

        left   = -500px
        right  = screen + 500px
        top    = -500px
        bottom = screen + 500px

        BUT METEORS ONLY ENTER FROM
        THE TOP EDGE.

        Their X can be anywhere across
        the entire box.
    */

    const boxLeft =
        -BOX_PADDING;

    const boxRight =
        window.innerWidth + BOX_PADDING;


    /*
        Random X across the entire
        surrounding box.
    */

    const startX =
        boxLeft +
        Math.random() *
        (boxRight - boxLeft);


    /*
        Start ABOVE the actual screen,
        but inside the surrounding box.

        This means you don't see them
        suddenly appear.
    */

    const startY =
        -BOX_PADDING +
        Math.random() * 200;


    meteor.style.left =
        `${startX}px`;

    meteor.style.top =
        `${startY}px`;


    /* =====================================
       FAST MOVEMENT
    ===================================== */

    const duration =
        1.4 +
        Math.random() * 0.7;


    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(
        meteor
    );


    /* =====================================
       DESPAWN

       Wait until the meteor has had
       enough time to travel completely
       outside the surrounding box.

       It does NOT disappear while
       still visible.
    ===================================== */

    setTimeout(() => {

        meteor.remove();

    }, duration * 1000 + 500);
}


/* =========================================
   INFINITE SPAWNING
========================================= */

function spawnMeteorForever() {

    createMeteor();

    const delay =
        120 +
        Math.random() * 220;

    setTimeout(
        spawnMeteorForever,
        delay
    );
}


/* =========================================
   START
========================================= */

spawnMeteorForever();
