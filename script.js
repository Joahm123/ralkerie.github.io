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


for (let i = 0; i < 120; i++) {
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
       Start on the RIGHT.
       Meteor travels toward
       the LEFT.
    */

    const startX =
        window.innerWidth +
        350;

    const startY =
        Math.random() *
        window.innerHeight;

    /*
       Bigger random meteors
    */

    const size =
        Math.random() * 10 + 16;

    /*
       Random speed
    */

    const duration =
        Math.random() * 1.8 + 1.8;

    meteor.style.left =
        `${startX}px`;

    meteor.style.top =
        `${startY}px`;

    meteor.style.width =
        `${size}px`;

    meteor.style.height =
        `${size}px`;

    meteor.style.animationDuration =
        `${duration}s`;

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
       More frequent than before.
    */

    const nextMeteor =
        Math.random() * 1000 + 500;

    setTimeout(
        spawnMeteor,
        nextMeteor
    );
}


spawnMeteor();
