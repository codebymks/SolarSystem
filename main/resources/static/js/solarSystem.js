console.log("JS loaded");
console.log("Form found:", document.getElementById("chatForm"));
document.addEventListener("DOMContentLoaded", function() {
//Animation of the solar system.
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Make canvas fill the left side
canvas.width = window.innerWidth - 320;
canvas.height = window.innerHeight;

const cx = canvas.width / 2;   //center X
const cy = canvas.height / 2;  //center Y

//Each planet: name, distance from sun, size, color, and speed
const planets = [
    { name: "Mercury", distance: 60,  size: 4,  color: "#b5b5b5", angle: 0, speed: 4.7  },
    { name: "Venus",   distance: 90,  size: 7,  color: "#e8c97e", angle: 1, speed: 3.5  },
    { name: "Earth",   distance: 125, size: 8,  color: "#4fa3e0", angle: 2, speed: 2.9  },
    { name: "Mars",    distance: 160, size: 6,  color: "#c1440e", angle: 3, speed: 2.4  },
    { name: "Jupiter", distance: 215, size: 18, color: "#c88b3a", angle: 4, speed: 1.3  },
    { name: "Saturn",  distance: 270, size: 14, color: "#e4d191", angle: 5, speed: 0.97 },
    { name: "Uranus",  distance: 315, size: 11, color: "#7de8e8", angle: 0, speed: 0.68 },
    { name: "Neptune", distance: 350, size: 10, color: "#4b6fd4", angle: 1, speed: 0.54 },
];

//Track where the mouse is
let mouseX = 0;
let mouseY = 0;
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

//Get speed from the slider
function getSpeed() {
    return parseFloat(document.getElementById("speed").value);
}

//Draw one frame
function draw() {
    //Clear the canvas with a dark background
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw the Sun in the center
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#ffe066";
    ctx.fill();

    //Draw each planet
    for (let planet of planets) {
        //Calculate planet's X and Y position using its angle
        const x = cx + Math.cos(planet.angle) * planet.distance;
        const y = cy + Math.sin(planet.angle) * planet.distance;

        //Draw the orbit circle (faint ring)
        ctx.beginPath();
        ctx.arc(cx, cy, planet.distance, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.stroke();

        //Draw the planet
        ctx.beginPath();
        ctx.arc(x, y, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();

        //Check if mouse is hovering over this planet
        const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        if (dist < planet.size + 8) {
            //Show planet name above it
            ctx.fillStyle = "white";
            ctx.font = "13px Arial";
            ctx.textAlign = "center";
            ctx.fillText(planet.name, x, y - planet.size - 6);
        }

        //Move the planet along its orbit
        planet.angle += (planet.speed / 1000) * getSpeed();
    }
    requestAnimationFrame(draw);
}

//Start the animation
draw();

//Chat
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const messages = document.getElementById("messages");
const spinner = document.getElementById("spinner");

// Add a message bubble to the chat
function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = "message " + who;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

//When the user submits a question
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("Form submitted!"); // Add this

        const question = input.value.trim();
        if (!question) return;

        addMessage(question, "user");
        input.value = "";
        spinner.style.display = "block";

        try {
            console.log("Fetching..."); // Add this
            const response = await fetch("http://localhost:8080/api/v1/joke?about=" + encodeURIComponent(question));
            console.log("Response status:", response.status); // Add this
            const data = await response.json();
            console.log("Data received:", data); // Add this
            const answer = data.answer;
            addMessage(answer, "bot");
        } catch (error) {
            console.error("Fetch failed:", error); // Change this
            addMessage("Error: " + error.message, "bot");
        } finally {
            spinner.style.display = "none";
        }
    });
});