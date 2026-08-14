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
   METEOR
========================= */

function createMeteor() {

    const meteor =
        document.createElement("div");

    meteor.className = "meteor";


    /*
        Random meteor length.
    */

    const length =
        320 +
        Math.random() * 200;

    meteor.style.width =
        `${length}px`;


    /*
        SPAWN ANYWHERE.

        X = anywhere from
        left → right.

        Y = anywhere from
        top → bottom.

        This makes the entire
        screen a spawn zone.
    */

    const startX =
        Math.random() * 100;

    const startY =
        Math.random() * 100;


    meteor.style.left =
        `${startX}vw`;

    meteor.style.top =
        `${startY}vh`;


    /*
        Random speed.
    */

    const duration =
        2 +
        Math.random() * 2;


    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(meteor);


    /*
        Delete it after it
        leaves the screen.
    */

    setTimeout(() => {

        meteor.remove();

    }, duration * 1000);
}


/* =========================
   INFINITE METEOR SPAWNER
========================= */

function spawnMeteorForever() {

    createMeteor();


    /*
        Random delay between
        meteors.

        This runs FOREVER.
    */

    const delay =
        150 +
        Math.random() * 350;


    setTimeout(
        spawnMeteorForever,
        delay
    );
}


/* =========================
   START FOREVER
========================= */

spawnMeteorForever();
