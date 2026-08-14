```javascript
(() => {
    "use strict";

    const container = document.getElementById("meteors");

    if (!container) {
        console.error("Ralkerie: #meteors not found.");
        return;
    }

    console.log("Ralkerie meteors loaded.");

    /* =====================================================
       AUDIO
    ===================================================== */

    const audio = new Audio(
        "./assets/audio/Rune%20of%20September.mp3"
    );

    audio.preload = "auto";

    /* =====================================================
       POPUP
    ===================================================== */

    const popup = document.createElement("div");

    popup.className = "meteor-popup";

    popup.innerHTML = `
        <div class="meteor-popup-box">
            <button class="meteor-popup-close">×</button>
            <img
                class="meteor-popup-gif"
                src="./assets/images/meteor.gif"
                alt="Meteor"
            >
        </div>
    `;

    document.body.appendChild(popup);

    const closeButton =
        popup.querySelector(".meteor-popup-close");


    /* =====================================================
       CLICK METEOR
    ===================================================== */

    function meteorClicked() {

        popup.classList.add("visible");

        audio.currentTime = 35;

        audio.play().catch((error) => {
            console.error(
                "Meteor audio error:",
                error
            );
        });
    }


    /* =====================================================
       CLOSE POPUP
    ===================================================== */

    function closePopup() {

        popup.classList.remove("visible");

        audio.pause();

        audio.currentTime = 0;
    }

    closeButton.addEventListener(
        "click",
        closePopup
    );

    popup.addEventListener(
        "click",
        (event) => {

            if (event.target === popup) {
                closePopup();
            }

        }
    );


    /* =====================================================
       CREATE METEOR
    ===================================================== */

    function createMeteor() {

        const hitbox =
            document.createElement("div");

        hitbox.className =
            "meteor-hitbox";


        const meteor =
            document.createElement("div");

        meteor.className =
            "meteor";


        /* Start farther to the right */

        hitbox.style.left = "180px";

        hitbox.style.top =
            `${10 + Math.random() * 70}vh`;


        hitbox.appendChild(meteor);


        hitbox.addEventListener(
            "click",
            meteorClicked
        );


        container.appendChild(
            hitbox
        );


        console.log(
            "Meteor spawned"
        );


        setTimeout(
            () => {
                hitbox.remove();
            },
            5500
        );
    }


    /* =====================================================
       FIRST METEOR
    ===================================================== */

    createMeteor();


    /* =====================================================
       SPAWN LOOP
    ===================================================== */

    setInterval(
        () => {

            if (!document.hidden) {
                createMeteor();
            }

        },
        3500
    );

})();
```
