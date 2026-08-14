const meteorContainer =
    document.getElementById("meteors");

function createMeteor() {
    const meteor =
        document.createElement("div");

    meteor.className = "meteor";

    /*
        Spawn from the upper-right
        so the meteor travels
        diagonally toward the bottom-left.
    */

    const startX =
        window.innerWidth +
        Math.random() * 400;

    const startY =
        Math.random() *
        (window.innerHeight * 0.55) -
        200;

    /*
        Bigger random meteor sizes.
    */

    const size =
        Math.random() * 8 + 8;

    /*
        Random speed.
        Smaller duration = faster.
    */

    const duration =
        Math.random() * 1.2 + 1.2;

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

    /*
        Remove after animation.
    */

    setTimeout(() => {
        meteor.remove();
    }, duration * 1000);
}


/*
    Spawn meteors randomly
    instead of at a perfectly
    regular interval.
*/

function spawnMeteor() {
    createMeteor();

    const nextMeteor =
        Math.random() * 900 + 500;

    setTimeout(
        spawnMeteor,
        nextMeteor
    );
}


/*
    Start meteor system.
*/

spawnMeteor();
