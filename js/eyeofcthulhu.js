/* =====================================================
   RALKERIE — EYE OF CTHULHU EASTER EGG

   Click the Eye of Cthulhu:
   - Eye dashes across the screen
   - Plays eye-noise.mp3
   - Leaves a glowing trail
   - Click again after it finishes
===================================================== */

(() => {

    "use strict";

    const eye =
        document.createElement("img");

    eye.src =
        "./assets/images/eyeofcthulhu.png";

    eye.alt =
        "Eye of Cthulhu";

    eye.id =
        "eye-of-cthulhu";

    eye.draggable = false;

    document.body.appendChild(eye);


    /* =================================================
       AUDIO
    ================================================= */

    const sound =
        new Audio(
            "./assets/audio/eye-noise.mp3"
        );

    sound.preload = "auto";


    /* =================================================
       SETTINGS
    ================================================= */

    let dashing = false;

    const DASH_TIME = 650;

    const COOLDOWN = 1000;


    /* =================================================
       CLICK
    ================================================= */

    eye.addEventListener(
        "click",
        () => {

            if (dashing) {
                return;
            }

            dashing = true;

            eye.classList.remove(
                "eye-dashing"
            );

            /*
             * Reset animation.
             */

            void eye.offsetWidth;

            eye.classList.add(
                "eye-dashing"
            );


            /* Play noise */

            sound.currentTime = 0;

            sound.play().catch(
                () => {}
            );


            /*
             * Random dash direction.
             */

            const startX =
                Math.random() *
                (window.innerWidth - 140);

            const startY =
                Math.random() *
                (window.innerHeight - 140);


            const endX =
                Math.random() <
                0.5
                    ? -180
                    : window.innerWidth + 180;


            const endY =
                startY +
                (
                    Math.random() *
                    240 -
                    120
                );


            eye.style.left =
                `${startX}px`;

            eye.style.top =
                `${startY}px`;


            /*
             * Force layout before animation.
             */

            void eye.offsetWidth;


            eye.animate(
                [
                    {
                        transform:
                            "translate(0, 0) scale(1)"
                    },

                    {
                        transform:
                            "translate(" +
                            `${endX - startX}px, ` +
                            `${endY - startY}px) ` +
                            "scale(1.15)"
                    }
                ],
                {
                    duration:
                        DASH_TIME,

                    easing:
                        "cubic-bezier(.15,.8,.2,1)",

                    fill:
                        "forwards"
                }
            );


            /*
             * Create temporary trail.
             */

            createTrail(
                startX,
                startY,
                endX,
                endY
            );


            setTimeout(
                () => {

                    eye.style.left =
                        "-300px";

                    eye.style.top =
                        "-300px";

                    eye.classList.remove(
                        "eye-dashing"
                    );

                },
                DASH_TIME
            );


            setTimeout(
                () => {

                    dashing = false;

                },
                COOLDOWN
            );

        }
    );


    /* =================================================
       TRAIL
    ================================================= */

    function createTrail(
        startX,
        startY,
        endX,
        endY
    ) {

        const trail =
            document.createElement(
                "div"
            );

        trail.className =
            "eye-dash-trail";


        const dx =
            endX - startX;

        const dy =
            endY - startY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const angle =
            Math.atan2(
                dy,
                dx
            ) *
            180 /
            Math.PI;


        trail.style.left =
            `${startX + 45}px`;

        trail.style.top =
            `${startY + 45}px`;

        trail.style.width =
            `${Math.min(distance, 900)}px`;

        trail.style.transform =
            `rotate(${angle}deg)`;


        document.body.appendChild(
            trail
        );


        requestAnimationFrame(
            () => {

                trail.classList.add(
                    "eye-trail-active"
                );

            }
        );


        setTimeout(
            () => {

                trail.remove();

            },
            DASH_TIME + 200
        );
    }


    console.log(
        "Ralkerie Eye of Cthulhu easter egg loaded."
    );

})();
