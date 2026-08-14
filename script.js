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
   METEORS
========================= */

function createMeteor() {
    const meteor = document.createElement("div");

    meteor.className = "meteor";

    /*
        Random meteor length.
    */

    const length = 320 + Math.random() * 220;

    meteor.style.width = `${length}px`;


    /*
        =================================
        SPAWN COMPLETELY OFF-SCREEN
        =================================

        The meteor is placed above the
        viewport.

        It CANNOT appear in the middle.
    */

    const startY =
        -(window.innerHeight + 500);

    meteor.style.top = `${startY}px`;


    /*
        Spread meteors across the
        entire horizontal range.

        Extra left space allows the
        long trail to enter naturally.
    */

    const startX =
        -length -
        Math.random() * 300 +
        Math.random() * (window.innerWidth + length + 300);

    meteor.style.left = `${startX}px`;


    /*
        Fast but smooth glide.
    */

    const duration =
        1.8 + Math.random() * 0.8;

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
   INFINITE SPAWNING
========================= */

function spawnMeteorForever() {

    createMeteor();

    const delay =
        180 + Math.random() * 300;

    setTimeout(
        spawnMeteorForever,
        delay
    );
}


/* =========================
   START
========================= */

spawnMeteorForever();
