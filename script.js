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


/* Lots of stars across the
   ENTIRE screen */

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
       Start WAY off the right side
       so the full trail can enter.
    */

    const startX =
        window.innerWidth + 450;

    /*
       Spawn anywhere vertically.
       This covers the ENTIRE screen.
    */

    const startY =
        Math.random() *
        window.innerHeight;

    /*
       Large meteor heads.
    */

    const size =
        Math.random() * 12 + 18;

    /*
       Different speeds.
    */

    const duration =
        Math.random() * 2 + 2;

    meteor.style.left =
        `${startX}px`;

    meteor.style.top =
        `${startY}px`;

    meteor.style.width =
        `${size}px`;

    meteor.style.height =
        `${size}px`;

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
       More frequent meteors.
    */

    const nextMeteor =
        Math.random() * 700 + 300;

    setTimeout(
        spawnMeteor,
        nextMeteor
    );
}


/* Start */

spawnMeteor();
