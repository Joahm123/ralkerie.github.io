```javascript
(function () {

    "use strict";

    var container = document.getElementById("meteors");

    if (!container) {
        console.error("Ralkerie: #meteors not found.");
        return;
    }

    console.log("Ralkerie meteors loaded.");


    /* =====================================================
       AUDIO
    ===================================================== */

    var audio = new Audio(
        "./assets/audio/Rune%20of%20September.mp3"
    );

    audio.preload = "auto";


    /* =====================================================
       POPUP
    ===================================================== */

    var popup = document.createElement("div");

    popup.className = "meteor-popup";

    var popupBox = document.createElement("div");

    popupBox.className = "meteor-popup-box";


    var closeButton = document.createElement("button");

    closeButton.className =
        "meteor-popup-close";

    closeButton.type = "button";

    closeButton.textContent = "×";


    var gif = document.createElement("img");

    gif.className =
        "meteor-popup-gif";

    gif.src =
        "./assets/images/meteor.gif";

    gif.alt = "Meteor";


    popupBox.appendChild(closeButton);

    popupBox.appendChild(gif);

    popup.appendChild(popupBox);

    document.body.appendChild(popup);


    /* =====================================================
       OPEN METEOR
    ===================================================== */

    function openMeteor() {

        popup.classList.add("visible");

        audio.currentTime = 35;

        var playResult = audio.play();

        if (playResult) {

            playResult.catch(function (error) {

                console.error(
                    "Meteor audio error:",
                    error
                );

            });

        }
    }


    /* =====================================================
       CLOSE METEOR
    ===================================================== */

    function closeMeteor() {

        popup.classList.remove("visible");

        audio.pause();

        audio.currentTime = 0;
    }


    closeButton.addEventListener(
        "click",
        closeMeteor
    );


    popup.addEventListener(
        "click",
        function (event) {

            if (event.target === popup) {
                closeMeteor();
            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeMeteor();
            }

        }
    );


    /* =====================================================
       CREATE METEOR
    ===================================================== */

    function createMeteor() {

        var hitbox =
            document.createElement("div");

        hitbox.className =
            "meteor-hitbox";


        var meteor =
            document.createElement("div");

        meteor.className =
            "meteor";


        /* Spawn position */

        hitbox.style.left = "180px";

        hitbox.style.top =
            (10 + Math.random() * 70) + "vh";


        /* Put meteor inside hitbox */

        hitbox.appendChild(
            meteor
        );


        /* Click */

        hitbox.addEventListener(
            "click",
            openMeteor
        );


        /* Add to page */

        container.appendChild(
            hitbox
        );


        console.log(
            "Meteor spawned"
        );


        /* Remove after animation */

        setTimeout(
            function () {

                if (hitbox.parentNode) {
                    hitbox.remove();
                }

            },
            5500
        );
    }


    /* =====================================================
       START
    ===================================================== */

    createMeteor();


    /* =====================================================
       SPAWN MORE
    ===================================================== */

    setInterval(
        function () {

            if (!document.hidden) {
                createMeteor();
            }

        },
        3500
    );

})();
```
