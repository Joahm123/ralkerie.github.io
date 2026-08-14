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


/* Create stars */

for (let i = 0; i < 220; i++) {
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
        LONG METEOR
    */

    const length =
        Math.random() * 220 + 320;

    meteor.style.width =
        `${length}px`;


    /*
        SPAWN ACROSS THE
        ENTIRE TOP.

        X can be anywhere from
        far left to far right.
    */

    const startX =
        Math.random() *
        (window.innerWidth + 600) -
        600;


    /*
        Keep the meteor at
        the TOP of the screen.

        Slight variation makes
        the spawning look natural.
    */

    const startY =
        -500 +
        Math.random() * 300;


    /*
        Random speed
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
   SPAWN METEORS
========================= */

function spawnMeteor() {

    createMeteor();


    /*
        Frequent meteors.
    */

    const nextMeteor =
        Math.random() * 250 + 100;

    setTimeout(
        spawnMeteor,
        nextMeteor
    );
}


/* Start */

spawnMeteor();
