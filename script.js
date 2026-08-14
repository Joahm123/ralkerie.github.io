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


for (let i = 0; i < 180; i++) {
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
       Start INSIDE the visible screen
       instead of spawning off-screen.
    */

    const startX =
        Math.random() *
        window.innerWidth;

    const startY =
        window.innerHeight -
        Math.random() *
        (window.innerHeight * 0.35);


    /*
       Random length.
    */

    const length =
        Math.random() * 100 + 150;

    meteor.style.width =
        `${length}px`;


    /*
       Random speed.
    */

    const duration =
        Math.random() * 2 + 2;


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

    const nextMeteor =
        Math.random() * 700 + 400;

    setTimeout(
        spawnMeteor,
        nextMeteor
    );
}


spawnMeteor();
