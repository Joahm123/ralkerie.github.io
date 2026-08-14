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

    const y =
        Math.random() * 100;

    const duration =
        Math.random() * 8 + 5;

    const delay =
        Math.random() * -10;

    star.style.width =
        `${size}px`;

    star.style.height =
        `${size}px`;

    star.style.left =
        `${Math.random() * 100}vw`;

    star.style.top =
        `${y}vh`;

    star.style.animationDuration =
        `${duration}s`;

    star.style.animationDelay =
        `${delay}s`;

    starContainer.appendChild(star);
}


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
        START AT THE TOP.

        Spread across the
        entire width.
    */

    const startX =
        Math.random() *
        (window.innerWidth + 300) -
        150;

    const startY =
        -350;


    /*
        LONG METEOR
    */

    const length =
        Math.random() * 180 + 260;

    meteor.style.width =
        `${length}px`;


    /*
        RANDOM FALL SPEED
    */

    const duration =
        Math.random() * 1.5 + 1.8;


    meteor.style.left =
        `${startX}px`;

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
   METEOR SPAWNING
========================= */

function spawnMeteor() {

    createMeteor();

    /*
        MORE FREQUENT
    */

    const nextMeteor =
        Math.random() * 350 + 180;

    setTimeout(
        spawnMeteor,
        nextMeteor
    );
}


spawnMeteor();
