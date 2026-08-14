/* =====================================================
   STARS
===================================================== */

const starContainer =
    document.getElementById("stars");

const stars = [];


for (let i = 0; i < 220; i++) {

    const element =
        document.createElement("div");

    element.className =
        "star";


    const size =
        1 + Math.random() * 2;


    element.style.width =
        size + "px";

    element.style.height =
        size + "px";


    const star = {

        element,

        x:
            Math.random() *
            window.innerWidth,

        y:
            Math.random() *
            window.innerHeight,

        speed:
            25 +
            Math.random() * 60
    };


    element.style.left =
        star.x + "px";

    element.style.top =
        star.y + "px";


    starContainer.appendChild(
        element
    );

    stars.push(star);
}


let lastTime =
    performance.now();


function updateStars(time) {

    const delta =
        (time - lastTime) / 1000;

    lastTime = time;


    for (const star of stars) {

        star.x +=
            star.speed * delta;


        if (
            star.x >
            window.innerWidth + 10
        ) {

            star.x = -10;

            star.y =
                Math.random() *
                window.innerHeight;
        }


        star.element.style.left =
            star.x + "px";

        star.element.style.top =
            star.y + "px";
    }


    requestAnimationFrame(
        updateStars
    );
}


requestAnimationFrame(
    updateStars
);
