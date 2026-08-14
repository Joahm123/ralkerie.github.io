const meteorContainer = document.getElementById("meteors");

function createMeteor() {
    const meteor = document.createElement("div");

    meteor.className = "meteor";

    // Start near the top/right of the screen
    const startX =
        Math.random() * window.innerWidth + 150;

    const startY =
        Math.random() * window.innerHeight * 0.55 - 200;

    // Random meteor size
    const size =
        Math.random() * 2 + 2;

    // Random speed
    const duration =
        Math.random() * 1.5 + 1;

    meteor.style.left = `${startX}px`;
    meteor.style.top = `${startY}px`;

    meteor.style.width = `${size}px`;
    meteor.style.height = `${size}px`;

    meteor.style.animation = `
        meteorFly ${duration}s linear forwards
    `;

    meteorContainer.appendChild(meteor);

    setTimeout(() => {
        meteor.remove();
    }, duration * 1000);
}

function spawnMeteor() {
    createMeteor();
}

// Spawn a meteor every 700ms
setInterval(spawnMeteor, 700);
