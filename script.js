const meteorContainer = document.getElementById("meteors");
const starContainer = document.getElementById("stars");


/* =========================
   MOVING STARS
========================= */

function createStar() {
    const star = document.createElement("div");

    star.className = "star";

    const size = Math.random() * 2 + 1;

    const duration = Math.random() * 8 + 5;
    const delay = Math.random() * -10;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;

    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;

    starContainer.appendChild(star);
}

for (let i = 0; i < 220; i++) {
    createStar();
}


/* =========================
   CREATE METEOR
========================= */

function createMeteor() {
    const meteor = document.createElement("div");

    meteor.className = "meteor";


    /*
        Random long meteor.
    */

    const length = 320 + Math.random() * 220;

    meteor.style.width = `${length}px`;


    /*
        X POSITION

        -30vw = far left
         0vw  = left edge
        50vw  = center
        100vw = right edge

        This gives us the ENTIRE
        top of the screen while
        shifting the overall spawn
        area toward the LEFT.
    */

    const startX =
        -30 + Math.random() * 130;


    /*
        IMPORTANT:

        EVERY SINGLE METEOR starts
        above the top of the screen.

        NEVER in the middle.
        NEVER near the bottom.
    */

    const startY =
        -350 - Math.random() * 250;


    meteor.style.left = `${startX}vw`;
    meteor.style.top = `${startY}px`;


    /*
        MUCH FASTER.

        Old:
        ~2.5 - 4.5 seconds

        New:
        ~1.1 - 1.8 seconds
    */

    const duration =
        1.1 + Math.random() * 0.7;


    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(meteor);


    /*
        Remove after animation.
    */

    setTimeout(() => {
        meteor.remove();
    }, duration * 1000 + 100);
}


/* =========================
   INFINITE SPAWNER
========================= */

function spawnMeteorForever() {

    createMeteor();


    /*
        Keep them fairly frequent.
    */

    const delay =
        120 + Math.random() * 250;


    setTimeout(
        spawnMeteorForever,
        delay
    );
}


/* =========================
   START
========================= */

spawnMeteorForever();
