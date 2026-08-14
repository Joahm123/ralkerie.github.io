const stars = document.getElementById("stars");
const meteors = document.getElementById("meteors");


/* =====================================
   STARS
===================================== */

function createStar() {

    const star = document.createElement("div");

    star.className = "star";

    const size = Math.random() * 2 + 1;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    star.style.left =
        `${Math.random() * 100}vw`;

    star.style.top =
        `${Math.random() * 100}vh`;

    star.style.animationDuration =
        `${8 + Math.random() * 10}s, ${2 + Math.random() * 3}s`;

    star.style.animationDelay =
        `${Math.random() * -10}s, ${Math.random() * -3}s`;

    stars.appendChild(star);
}


for (let i = 0; i < 250; i++) {
    createStar();
}


/* =====================================
   METEORS
===================================== */

/*
    IMPORTANT:

    The meteor container itself is
    500px outside the screen on every
    side.

    We ONLY spawn from its TOP EDGE.

    So:

             SPAWN AREA
    ┌─────────────────────────────┐
    │  ☄     ☄       ☄      ☄    │
    ├─────────────────────────────┤
    │                             │
    │       YOUR SCREEN           │
    │                             │
    │                             │
    └─────────────────────────────┘
             DESPAWN AREA

    Nothing is spawned from the
    left, right, or bottom edges.
*/


function createMeteor() {

    const meteor =
        document.createElement("div");

    meteor.className = "meteor";


    /* Long meteor */

    const length =
        400 + Math.random() * 300;

    meteor.style.width =
        `${length}px`;


    /*
        TOP EDGE OF THE BOX

        The box starts at -500px.

        Therefore the meteor is
        initially ABOVE the viewport.
    */

    const spawnX =
        Math.random() *
        (window.innerWidth + 1000);

    const spawnY =
        -500 -
        Math.random() * 100;


    meteor.style.left =
        `${spawnX}px`;

    meteor.style.top =
        `${spawnY}px`;


    /*
        Fast movement
    */

    const duration =
        1.3 + Math.random() * 0.6;

    meteor.style.animation =
        `meteorMove ${duration}s linear forwards`;


    meteors.appendChild(meteor);


    /*
        Remove ONLY after it has
        completely traveled outside
        the surrounding box.
    */

    setTimeout(() => {

        meteor.remove();

    }, duration * 1000 + 500);
}


/* =====================================
   INFINITE SPAWNING
===================================== */

function spawnMeteor() {

    createMeteor();

    const delay =
        120 + Math.random() * 220;

    setTimeout(
        spawnMeteor,
        delay
    );
}


spawnMeteor();
