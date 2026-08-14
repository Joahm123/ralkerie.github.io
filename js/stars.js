/* =====================================================
   RALKERIE STARS
===================================================== */

(() => {
    "use strict";

    const container =
        document.getElementById("stars");

    if (!container) {
        console.error("Star container not found.");
        return;
    }

    const STAR_COUNT = 220;

    const fragment =
        document.createDocumentFragment();

    for (
        let i = 0;
        i < STAR_COUNT;
        i++
    ) {

        const star =
            document.createElement("div");

        star.className =
            "star";

        const size =
            1 +
            Math.random() * 2.4;

        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;

        star.style.left =
            `${Math.random() * 100}vw`;

        star.style.top =
            `${Math.random() * 100}vh`;

        star.style.setProperty(
            "--star-speed",
            `${18 + Math.random() * 45}s`
        );

        star.style.animationDelay =
            `${-Math.random() * 60}s`;

        star.style.setProperty(
            "--sparkle-speed",
            `${1.5 + Math.random() * 3}s`
        );

        fragment.appendChild(
            star
        );
    }

    container.appendChild(
        fragment
    );

    console.log(
        "Ralkerie stars loaded."
    );

})();
