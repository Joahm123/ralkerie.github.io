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


/* Make stars */

for (let i = 0; i < 250; i++) {
    createStar();
}


/* =========================================
   METEOR
========================================= */

function createMeteor() {

    const meteor = document.createElement("div");

    meteor.className = "meteor";


    /* =====================================
       METEOR LENGTH
    ===================================== */

    const length =
        400 + Math.random() * 300;

    meteor.style.width =
        `${length}px`;


    /* =====================================
       TOP SPAWN BOX

       Imagine this box sitting ABOVE
       the website:

       ┌───────────────────────────────┐
       │   ☄      ☄       ☄      ☄    │
       │                               │
       │                               │
       └───────────────────────────────┘
       █████████████████████████████████
              TOP OF SCREEN

       Meteors ONLY come from this box.

       They NEVER spawn on the sides.
       They NEVER spawn in the middle.
       They NEVER spawn at the bottom.
    ===================================== */

    const spawnBoxWidth =
        window.innerWidth + 1200;

    const spawnBoxLeft =
        -600;


    /*
        Random X anywhere inside
        the giant box.
    */

    const startX =
        spawnBoxLeft +
        Math.random() * spawnBoxWidth;


    /*
        FAR above the screen.

        This is intentionally huge.
    */

    const startY =
        -900 -
        Math.random() * 900;


    meteor.style.left =
        `${startX}px`;

    meteor.style.top =
        `${startY}px`;


    /* =====================================
       SPEED
    ===================================== */

    const duration =
        1.2 +
        Math.random() * 0.7;


    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(
        meteor
    );


    /* =====================================
       CLEANUP
    ===================================== */

    setTimeout(() => {

        meteor.remove();

    }, duration * 1000 + 500);
}


/* =========================================
   INFINITE METEOR SPAWNING
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
