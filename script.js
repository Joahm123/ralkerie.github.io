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


/* Lots of moving stars */

for (let i = 0; i < 220; i++) {
    createStar();
}


/* =========================
   METEORS
========================= */

function createMeteor() {

    const meteor = document.createElement("div");

    meteor.className = "meteor";


    /*
        Random meteor length
    */

    const length = 320 + Math.random() * 200;

    meteor.style.width = `${length}px`;


    /*
        IMPORTANT:
        Spawn across BOTH halves.

        50% of meteors start
        on the LEFT half.

        50% start on the RIGHT half.
    */

    let startX;

    if (Math.random() < 0.5) {

        // LEFT HALF
        startX = Math.random() * 50;

    } else {

        // RIGHT HALF
        startX = 50 + Math.random() * 50;
    }


    /*
        Spawn anywhere vertically,
        but keep enough room for
        the meteor to be visible.
    */

    const startY =
        Math.random() * 85;


    meteor.style.left = `${startX}vw`;
    meteor.style.top = `${startY}vh`;


    /*
        Every meteor travels
        DOWN + RIGHT.
    */

    const duration =
        2.5 + Math.random() * 2;


    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(meteor);


    /*
        Remove after animation.
    */

    setTimeout(() => {
        meteor.remove();
    }, duration * 1000);
}


/* =========================
   INFINITE SPAWNING
========================= */

function spawnMeteorForever() {

    createMeteor();

    const delay =
        150 + Math.random() * 300;

    setTimeout(
        spawnMeteorForever,
        delay
    );
}


/* Start forever */

spawnMeteorForever();
