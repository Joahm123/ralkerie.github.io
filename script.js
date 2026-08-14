const meteorContainer =
    document.getElementById("meteors");

const starContainer =
    document.getElementById("stars");


/* =========================
   STARS
========================= */

function createStar() {

    const star =
        document.createElement("div");

    star.className = "star";

    const size =
        Math.random() * 2 + 1;

    const duration =
        Math.random() * 2 + 2;

    const delay =
        Math.random() * -5;

    star.style.width =
        `${size}px`;

    star.style.height =
        `${size}px`;

    star.style.left =
        `${Math.random() * 100}vw`;

    star.style.top =
        `${Math.random() * 100}vh`;

    star.style.animationDuration =
        `${duration}s`;

    star.style.animationDelay =
        `${delay}s`;

    starContainer.appendChild(star);
}


/* Create stars */

for (let i = 220; i > 0; i--) {
    createStar();
}


/* =========================
   METEORS
========================= */

function createMeteor() {

    const meteor =
        document.createElement("div");

    meteor.className = "meteor";


    /*
        Long meteor
    */

    const length =
        320 +
        Math.random() * 200;

    meteor.style.width =
        `${length}px`;


    /*
        Spawn across the entire
        top, but shifted LEFT.

        -25vw → 75vw

        This means the rightmost
        meteor starts around the
        middle/right area rather
        than way off the right.
    */

    const startX =
        -25 +
        Math.random() * 100;


    /*
        Start above the screen.
    */

    const startY =
        -300;


    /*
        Random speed.
    */

    const duration =
        2 +
        Math.random() * 1.5;


    meteor.style.left =
        `${startX}vw`;

    meteor.style.top =
        `${startY}px`;

    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(meteor);


    setTimeout(() => {
        meteor.remove();
    }, duration * 1000);
}


/* =========================
   SPAWN
========================= */

function spawnMeteor() {

    createMeteor();

    const delay =
        150 +
        Math.random() * 300;

    setTimeout(
        spawnMeteor,
        delay
    );
}


/* =========================
   START
========================= */

spawnMeteor();
