const hand = document.getElementById("mootevaHand");
const hi = document.querySelector(".title-hi");
const dots = document.querySelectorAll(".hi-dot");
const highFive = document.querySelector(".title-high-five");

let sequenceStarted = false;
let highFiveStarted = false;
let fallStarted = false;

function startHighFiveTyping() {
    if (highFive.classList.contains("is-typing")) return;

    const text = highFive.textContent;
    highFive.textContent = "";

    Array.from(text).forEach((character, index) => {
        const letter = document.createElement("span");
        letter.className = character === " " ? "letter space" : "letter";
        letter.textContent = character;
        letter.style.animationDelay = `${index * 0.055}s`;
        highFive.appendChild(letter);
    });

    highFive.classList.add("is-typing");
}

function startIntro() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    hi.classList.add("is-visible");

    setTimeout(() => {
        hi.classList.add("dots-playing");
        hand.classList.add("is-entering");
    }, 460);
}

const highFiveAudio = new Audio("./assets/audio/sfxmint-hand-clap-07.mp3");
highFiveAudio.preload = "auto";

function playHighFiveSound() {
    highFiveAudio.currentTime = 0;

    const playback = highFiveAudio.play();
    if (playback) {
        playback.catch(error => {
            console.warn("High Five sound could not play:", error);
        });
    }
}

function performHighFive() {
    if (highFiveStarted || !hand.classList.contains("is-ready")) return;

    highFiveStarted = true;
    hand.classList.remove("is-ready", "is-hovering", "is-visible");
    hand.classList.add("is-impacting");

    setTimeout(playHighFiveSound, 361);
}

function startFallSequence() {
    if (fallStarted) return;

    const fallSequence = document.getElementById("fallSequence");
    const experience = document.querySelector(".experience");

    if (!fallSequence || !experience) {
        console.error("Fall scene elements were not found.");
        return;
    }

    fallStarted = true;
    experience.classList.add("fall-active");
    experience.classList.remove("fall-impact");
    fallSequence.replaceChildren();

    const palette = [
        { color: "#174C45", weight: 35 },
        { color: "#292B2C", weight: 13 },
        { color: "#77797B", weight: 25 },
        { color: "#151718", weight: 20 },
        { color: "#F2C94C", weight: 3 },
        { color: "#C94747", weight: 3 },
        { color: "#F5F5F2", weight: 2 },
        { color: "#050505", weight: 2 }
    ];

    const elements = [
        ["M", "text"], ["O", "text"], ["O", "text"],
        ["T", "text"], ["E", "text"], ["V", "text"],
        ["A", "text"],
        ["0", "number"], ["1", "number"],
        ["2", "number"], ["3", "number"],
        ["4", "number"], ["5", "number"],
        ["6", "number"], ["7", "number"],
        ["8", "number"], ["9", "number"],
        ["+", "symbol"], ["×", "symbol"],
        ["−", "symbol"], ["=", "symbol"],
        ["◇", "symbol"], ["○", "symbol"],
        ["△", "symbol"], ["□", "symbol"],
        ["✦", "symbol"]
    ];

    function pickColor() {
        let value = Math.random() * 103;

        for (const entry of palette) {
            value -= entry.weight;
            if (value <= 0) return entry.color;
        }

        return palette[0].color;
    }

    const total = 200;
    const lanes = 15;
    const height = window.innerHeight;
    const objectsPerLane = Math.ceil(total / lanes);

    for (let i = 0; i < total; i++) {
        const item = document.createElement("span");
        const choice = elements[
            Math.floor(Math.random() * elements.length)
        ];

        item.className = `fall-item ${choice[1]}-item`;
        item.textContent = choice[0];

        // Middle third of the screen only.
        const lane = i % lanes;
        const x = 33.33 + ((lane + 0.5) / lanes) * 33.34;
        const xJitter = (Math.random() - 0.5) * 1.2;

        item.style.left = `${x + xJitter}%`;
        item.style.top = "0px";
        item.style.color = pickColor();

        const depth = 0.75 + Math.random() * 0.65;
        const weight = 0.8 + Math.random() * 0.9;

        const size = (20 + Math.random() * 30) * depth;
        item.style.fontSize = `${size}px`;

        if (choice[1] === "symbol" && Math.random() > 0.72) {
            item.textContent = "";
            item.classList.add("shape-item");

            const shapeSize = 12 + Math.random() * 18;
            item.style.width = `${shapeSize}px`;
            item.style.height = `${shapeSize}px`;
            item.style.border = "1px solid currentColor";

            if (Math.random() > 0.5) {
                item.style.borderRadius = "50%";
            }
        }

        fallSequence.appendChild(item);

        const order = Math.floor(i / lanes);
        const progress = order / objectsPerLane;

        // Stagger each lane so objects pass one after another.
        const delay =
            (order / objectsPerLane) * 4550 +
            lane * 3 +
            Math.random() * 12;

        // Stronger acceleration toward the end.
        const baseDuration = 300 - 225 * Math.pow(progress, 1.7);
        const duration = Math.max(55, baseDuration / weight);

        const startY = height + size + 20;
        const endY = -height - size - 20;

        item.animate(
            [
                {
                    transform: `translate3d(0, ${startY}px, 0)`,
                    opacity: 0,
                    offset: 0
                },
                {
                    transform: `translate3d(0, ${startY * 0.65}px, 0)`,
                    opacity: 1,
                    offset: 0.3,
                    easing: "cubic-bezier(.5,0,.85,.3)"
                },
                {
                    transform: `translate3d(0, ${endY * 0.35}px, 0)`,
                    opacity: 1,
                    offset: 0.7,
                    easing: "cubic-bezier(.8,0,1,.2)"
                },
                {
                    transform: `translate3d(0, ${endY}px, 0)`,
                    opacity: 0,
                    offset: 1
                }
            ],
            {
                duration,
                delay,
                fill: "both",
                easing: "linear"
            }
        );
    }

    setTimeout(() => {
        fallSequence.replaceChildren();
        experience.classList.remove("fall-active");
        experience.classList.add("fall-impact");
        experience.classList.add("coming-soon-active");
    }, 5000);
}

if (hand && hi && dots.length === 2 && highFive) {
    if (document.readyState === "complete") {
        startIntro();
    } else {
        window.addEventListener("load", startIntro, { once: true });
    }

    hand.addEventListener("animationend", (event) => {
        if (event.target !== hand) return;

        if (event.animationName === "hand-enter") {
            hand.classList.remove("is-entering");
            hand.classList.add("is-visible", "is-waving");
            startHighFiveTyping();

        } else if (event.animationName === "hand-wave") {
            hand.classList.remove("is-waving");
            hand.classList.add("is-ready", "is-visible");

        } else if (event.animationName === "hand-hover") {
            hand.classList.remove("is-hovering");

        } else if (event.animationName === "high-five-motion") {
            hand.classList.remove("is-impacting");
            hand.classList.add("is-exiting");

        } else if (event.animationName === "hand-exit") {
            hand.classList.remove("is-exiting");
            hand.classList.add("is-gone");

            document.querySelector(".experience").classList.add("elevator-sequence");
        }
    });

    hand.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "mouse") return;
        if (!hand.classList.contains("is-ready")) return;

        hand.classList.remove("is-hovering");
        void hand.offsetWidth;
        hand.classList.add("is-hovering");
    });

    hand.addEventListener("click", performHighFive);
}

const heroMessage = document.querySelector(".hero-message");

if (heroMessage) {
    heroMessage.addEventListener("animationend", (event) => {
        if (event.animationName === "elevator-journey") {
            startFallSequence();
        }
    });
}




