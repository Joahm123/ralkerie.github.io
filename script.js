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

for (let i = 220; i > 0; i--) {
    createStar();
}


/* =========================
   METEOR
========================= */

function createMeteor() {

    const meteor = document.createElement("div");

    meteor.className = "meteor";


    /*
        Long skinny meteors
    */

    const length =
        350 + Math.random() * 250;

    meteor.style.width =
        `${length}px`;


    /*
        =========================
        SPAWN AREA
        =========================

        ONLY THE LEFT SIDE.

        0%   = far left
        45%  = just left of center

        NOTHING CAN SPAWN
        ON THE RIGHT HALF.
    */

    const startX =
        Math.random() * 45;


    /*
        ALWAYS ABOVE THE SCREEN.

        They enter naturally from
        above instead of appearing
        in your view.
    */

    const startY =
        -600 -
        Math.random() * 300;


    meteor.style.left =
        `${startX}vw`;

    meteor.style.top =
        `${startY}px`;


    /*
        FAST
    */

    const duration =
        1.2 +
        Math.random() * 0.6;


    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(meteor);


    setTimeout(() => {
        meteor.remove();
    }, duration * 1000 + 200);
}


/* =========================
   INFINITE METEORS
========================= */

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


/* =========================
   START
========================= */

spawnMeteorForever();
