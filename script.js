const meteorContainer = document.getElementById("meteors");
const starContainer = document.getElementById("stars");


/* =========================
   STARS
========================= */

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


/* Create 250 stars */

for (let i = 0; i < 250; i++) {
    createStar();
}


/* =========================
   METEORS
========================= */

function createMeteor() {

    const meteor = document.createElement("div");

    meteor.className = "meteor";


    /*
        Long meteor
    */

    const length =
        350 + Math.random() * 250;

    meteor.style.width =
        `${length}px`;


    /*
        =========================
        SPAWN POSITION
        =========================

        Meteor starts ABOVE the
        screen.

        X is deliberately biased
        toward the LEFT.

        -20vw → 45vw
    */

    const startX =
        -20 + Math.random() * 65;

    const startY =
        -500 - Math.random() * 300;


    meteor.style.left =
        `${startX}vw`;

    meteor.style.top =
        `${startY}px`;


    /*
        Fast movement
    */

    const duration =
        1.3 + Math.random() * 0.6;

    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(meteor);


    /*
        Remove when finished
    */

    setTimeout(() => {
        meteor.remove();
    }, duration * 1000 + 300);
}


/* =========================
   INFINITE SPAWN
========================= */

function spawnMeteor() {

    createMeteor();

    const delay =
        150 + Math.random() * 250;

    setTimeout(
        spawnMeteor,
        delay
    );
}


/* Start meteors */

spawnMeteor();
