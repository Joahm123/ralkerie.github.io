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
        `${Math.random() * 100}vh`;

    star.style.animationDuration =
        `${duration}s`;

    star.style.animationDelay =
        `${delay}s`;

    starContainer.appendChild(star);
}


/* Lots of stars */

for (let i = 0; i < 220; i++) {
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
        RANDOM X POSITION.

        0 = FAR LEFT
        50 = CENTER
        100 = FAR RIGHT

        This covers the ENTIRE
        top of the screen.
    */

    const startX =
        Math.random() * 100;


    /*
        Start just above the screen.
    */

    const startY =
        -300;


    /*
        Slightly different
        meteor lengths.
    */

    const length =
        320 +
        Math.random() * 200;

    meteor.style.width =
        `${length}px`;


    /*
        Put meteor at random
        percentage across screen.
    */

    meteor.style.left =
        `${startX}vw`;

    meteor.style.top =
        `${startY}px`;


    /*
        Different speeds.
    */

    const duration =
        2 +
        Math.random() * 1.5;


    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(meteor);


    /*
        Clean it up.
    */

    setTimeout(() => {

        meteor.remove();

    }, duration * 1000);
}


/* =========================
   SPAWN METEORS
========================= */

function spawnMeteor() {

    createMeteor();


    /*
        Lots of meteors.
    */

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
