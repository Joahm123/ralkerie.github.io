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


/* Lots of stars */

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
        LONG METEOR

        Every meteor gets a
        slightly different length.
    */

    const length =
        Math.random() * 220 + 320;

    meteor.style.width =
        `${length}px`;


    /*
        SPAWN ACROSS THE ENTIRE
        TOP OF THE SCREEN.

        Account for the meteor's
        length so it isn't pushed
        toward the right.
    */

    const startX =
        Math.random() *
        (window.innerWidth + length) -
        length;


    /*
        ALWAYS START ABOVE
        THE TOP OF THE SCREEN.
    */

    const startY =
        -450;


    /*
        Random falling speed.
    */

    const duration =
        Math.random() * 1.5 + 1.8;


    meteor.style.left =
        `${startX}px`;

    meteor.style.top =
        `${startY}px`;


    /*
        Meteor travels:
        TOP → DOWN + RIGHT
    */

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
   METEOR SPAWNING
========================= */

function spawnMeteor() {

    createMeteor();


    /*
        Frequent meteors.

        Smaller number =
        more frequent.
    */

    const nextMeteor =
        Math.random() * 300 + 120;


    setTimeout(
        spawnMeteor,
        nextMeteor
    );
}


/* =========================
   START
========================= */

spawnMeteor();
