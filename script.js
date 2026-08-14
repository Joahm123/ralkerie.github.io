const stars = document.getElementById("stars");
const meteors = document.getElementById("meteors");


/* =========================================
   STARS
========================================= */

function createStar() {
    const star = document.createElement("div");

    star.className = "star";

    const size = Math.random() * 2 + 1;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;

    star.style.animationDuration =
        `${8 + Math.random() * 10}s, ${2 + Math.random() * 3}s`;

    star.style.animationDelay =
        `${Math.random() * -10}s, ${Math.random() * -3}s`;

    stars.appendChild(star);
}


/* Create stars */

for (let i = 0; i < 250; i++) {
    createStar();
}


/* =========================================
   METEORS
========================================= */

function createMeteor() {

    const meteor = document.createElement("div");

    meteor.className = "meteor";


    /* Long meteor */

    const length =
        400 + Math.random() * 300;

    meteor.style.width = `${length}px`;


    /*
        =====================================
        TOP SPAWN
        =====================================

        X covers the ENTIRE screen
        plus some extra space on both
        sides.

        Y is ALWAYS above the screen.

        So meteors ONLY enter from
        above.
    */

    const startX =
        -500 +
        Math.random() *
        (window.innerWidth + 1000);

    const startY =
        -700 -
        Math.random() * 500;


    meteor.style.left = `${startX}px`;
    meteor.style.top = `${startY}px`;


    /*
        Fast movement
    */

    const duration =
        1.3 +
        Math.random() * 0.6;

    meteor.style.animation =
        `meteorMove ${duration}s linear forwards`;


    meteors.appendChild(meteor);


    /*
        Remove after animation.
    */

    setTimeout(() => {
        meteor.remove();
    }, duration * 1000 + 1000);
}


/* =========================================
   INFINITE SPAWNING
========================================= */

function spawnMeteor() {

    createMeteor();

    const delay =
        120 +
        Math.random() * 220;

    setTimeout(spawnMeteor, delay);
}


/* START */

spawnMeteor();
