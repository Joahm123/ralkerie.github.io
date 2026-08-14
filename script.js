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

for (let i = 0; i < 220; i++) {
    createStar();
}


/* =========================
   CREATE METEOR
========================= */

function createMeteor() {

    const meteor = document.createElement("div");

    meteor.className = "meteor";


    /* =========================
       METEOR SIZE
    ========================= */

    const length =
        320 + Math.random() * 220;

    meteor.style.width =
        `${length}px`;


    /* =========================
       HEAD POSITION
    =========================

       The HEAD is the important
       part because it is on the
       RIGHT side of the meteor.

       We choose where the HEAD
       should appear horizontally.

       -250 = slightly off left
       50vw = center
       100vw = right edge
       +250 = slightly off right
    */

    const headX =
        -250 +
        Math.random() *
        (window.innerWidth + 500);


    /*
        Because the head is on
        the RIGHT side of the
        meteor, move the actual
        element LEFT by its length.

        This fixes the right-side
        spawning problem.
    */

    const meteorX =
        headX - length;


    meteor.style.left =
        `${meteorX}px`;


    /* =========================
       VERTICAL SPAWN
    =========================

       ALWAYS above the screen.

       Never spawn in the middle.
    */

    const meteorY =
        -180 -
        Math.random() * 250;

    meteor.style.top =
        `${meteorY}px`;


    /* =========================
       SPEED
    ========================= */

    const duration =
        1.4 +
        Math.random() * 0.7;


    meteor.style.animation =
        `meteorFly ${duration}s linear forwards`;


    meteorContainer.appendChild(
        meteor
    );


    /* =========================
       CLEANUP
    ========================= */

    setTimeout(() => {

        meteor.remove();

    }, duration * 1000 + 200);
}


/* =========================
   INFINITE SPAWNER
========================= */

function spawnMeteorForever() {

    createMeteor();


    /*
        Keep meteors coming
        forever.
    */

    const delay =
        140 +
        Math.random() * 260;


    setTimeout(
        spawnMeteorForever,
        delay
    );
}


/* =========================
   START
========================= */

spawnMeteorForever();
