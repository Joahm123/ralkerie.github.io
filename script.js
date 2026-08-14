const starsContainer = document.getElementById("stars");
const meteorContainer = document.getElementById("meteors");


/* =====================================
   STARS
===================================== */

function createStar() {

    const star = document.createElement("div");

    star.className = "star";

    const size =
        Math.random() * 2 + 1;

    star.style.width =
        size + "px";

    star.style.height =
        size + "px";

    star.style.left =
        Math.random() * 100 + "vw";

    star.style.top =
        Math.random() * 100 + "vh";

    star.style.animationDuration =
        (8 + Math.random() * 8) +
        "s, " +
        (2 + Math.random() * 3) +
        "s";

    star.style.animationDelay =
        (Math.random() * -10) +
        "s, " +
        (Math.random() * -3) +
        "s";

    starsContainer.appendChild(star);
}


for (let i = 0; i < 250; i++) {
    createStar();
}


/* =====================================
   METEORS
===================================== */

function createMeteor() {

    const meteor =
        document.createElement("div");

    meteor.className =
        "meteor";


    /*
        LONG METEOR
    */

    const length =
        400 +
        Math.random() * 300;

    meteor.style.width =
        length + "px";


    /*
        ================================
        TOP SPAWN BOX

        The meteor starts between
        500 and 900 pixels ABOVE
        the actual screen.

        X covers the whole screen
        plus 500px on both sides.
        ================================
    */

    const x =
        -500 +
        Math.random() *
        (window.innerWidth + 1000);

    const y =
        -500 -
        Math.random() * 400;


    meteor.style.left =
        x + "px";

    meteor.style.top =
        y + "px";


    /*
        FAST
    */

    const duration =
        1.2 +
        Math.random() * 0.7;


    meteor.style.animation =
        "meteorMove " +
        duration +
        "s linear forwards";


    meteorContainer.appendChild(
        meteor
    );


    /*
        Wait until it is completely
        offscreen before removing it.
    */

    setTimeout(
        () => meteor.remove(),
        duration * 1000 + 500
    );
}


/* =====================================
   CONTINUOUS SPAWNING
===================================== */

function spawnMeteor() {

    createMeteor();

    setTimeout(
        spawnMeteor,
        150 + Math.random() * 200
    );
}


spawnMeteor();
