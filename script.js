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
        Long meteor
    */

    const length =
        Math.random() * 220 + 320;

    meteor.style.width =
        `${length}px`;


    /*
        SPAWN ACROSS THE
        ENTIRE TOP.

        Start from LEFT side
        and spread toward RIGHT.
    */

    const startX =
        Math.random() *
        window.innerWidth;


    /*
        Start slightly above
        the top of the screen.
    */

    const startY =
        -100;


    /*
        Speed
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
   SPAWN MORE METEORS
========================= */

function spawnMeteor() {

    createMeteor();

    const nextMeteor =
        Math.random() * 250 + 100;

    setTimeout(
        spawnMeteor,
        nextMeteor
    );
}


spawnMeteor();
