/* =====================================================
   RALKERIE STARS
===================================================== */

const starContainer =
    document.getElementById("stars");

const stars = [];


/* =====================================================
   CREATE STARS
===================================================== */

for (let i = 0; i < 220; i++) {

    const star =
        document.createElement("div");

    star.className = "star";


    const size =
        1 + Math.random() * 2.5;


    star.style.width =
        `${size}px`;

    star.style.height =
        `${size}px`;


    const data = {

        element: star,

        x:
            Math.random() *
            window.innerWidth,

        y:
            Math.random() *
            window.innerHeight,

        speed:
            25 +
            Math.random() * 65
    };


    star.style.left =
        `${data.x}px`;

    star.style.top =
        `${data.y}px`;


    starContainer.appendChild(
        star
    );


    stars.push(data);
}


/* =====================================================
   ANIMATION
===================================================== */

let lastTime =
    performance.now();


function updateStars(time) {

    const delta =
        (time - lastTime) / 1000;

    lastTime =
        time;


    for (const star of stars) {

        /*
           Stars move RIGHT.
        */

        star.x +=
            star.speed *
            delta;


        /*
           When a star leaves
           the right side, bring
           it back to the left.
        */

        if (
            star.x >
            window.innerWidth + 20
        ) {

            star.x = -20;

            star.y =
                Math.random() *
                window.innerHeight;
        }


        star.element.style.left =
            `${star.x}px`;

        star.element.style.top =
            `${star.y}px`;
    }


    requestAnimationFrame(
        updateStars
    );
}


requestAnimationFrame(
    updateStars
);
