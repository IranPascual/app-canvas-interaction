const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = 600;
canvas.width = 1000;

canvas.style.background = "black";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        this.dx = 0;
        this.dy = -this.speed; // Establecer la velocidad vertical hacia arriba
    }

    draw(context) {
        context.beginPath();

        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "30px Arial";
        context.fillStyle = "White";
        context.fillText(this.text, this.posX, this.posY);

        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        if ((this.posX + this.radius) > window_width) {
            this.dx = -this.dx;
        }

        if ((this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        // Comprobar si el círculo sale del área visible
        if ((this.posY - this.radius) < 0) {
            // Reiniciar la posición del círculo al borde inferior de la pantalla
            this.posY = window_height + this.radius;
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }
}

function getDistance(posx1, posy1, posx2, posy2) {
    let result = Math.sqrt(Math.pow(posx2 - posx1, 2) + Math.pow(posy2 - posy1, 2));
    return result;
}

// Función para generar un destello de luz de un color aleatorio en la posición dada
function emitLight(x, y) {
    let lightColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fillStyle = lightColor;
    ctx.globalAlpha = 0.5; // Define la opacidad del destello
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1; // Restaurar la opacidad a su valor predeterminado
}

let arrayCircle = [];
let NumeroCirculos = 10;

for (let i = 0; i < NumeroCirculos; i++) {
    let randomX = Math.random() * (window_width - 200) + 100;
    let randomY = window_height + Math.floor(Math.random() * 200); // Empezar los círculos fuera de la pantalla
    let randomRadius = Math.floor(Math.random() * 100 + 25);
    let randomSpeed = Math.floor(Math.random() * 10) + 1;
    let miCirculo = new Circle(randomX, randomY, randomRadius, 'Blue', i + 1, 5);
    arrayCircle.push(miCirculo);
}

function detectarColision(circulo1, circulo2) {
    let distancia = getDistance(circulo1.posX, circulo1.posY, circulo2.posX, circulo2.posY);
    return distancia < (circulo1.radius + circulo2.radius);
}

function updateCircle() {
    ctx.clearRect(0, 0, window_width, window_height);

    arrayCircle.forEach(circle => {
        circle.color = "Blue";
    });

    for (let i = 0; i < arrayCircle.length; i++) {
        let circle = arrayCircle[i];
        for (let j = i + 1; j < arrayCircle.length; j++) {
            let otherCircle = arrayCircle[j];
            if (detectarColision(circle, otherCircle)) {
                circle.color = "red";
                otherCircle.color = "red";
                let angle = Math.atan2(otherCircle.posY - circle.posY, otherCircle.posX - circle.posX);
                let overlap = circle.radius + otherCircle.radius - getDistance(circle.posX, circle.posY, otherCircle.posX, otherCircle.posY);
                circle.posX -= overlap * Math.cos(angle) / 2;
                circle.posY -= overlap * Math.sin(angle) / 2;
                otherCircle.posX += overlap * Math.cos(angle) / 2;
                otherCircle.posY += overlap * Math.sin(angle) / 2;
                let normalX = Math.cos(angle);
                let normalY = Math.sin(angle);
                let tangentX = -normalY;
                let tangentY = normalX;
                let circleSpeedNormal = circle.dx * normalX + circle.dy * normalY;
                let circleSpeedTangent = circle.dx * tangentX + circle.dy * tangentY;
                let otherCircleSpeedNormal = otherCircle.dx * normalX + otherCircle.dy * normalY;
                let otherCircleSpeedTangent = otherCircle.dx * tangentX + otherCircle.dy * tangentY;
                let circleSpeedNormalAfter = otherCircleSpeedNormal;
                let otherCircleSpeedNormalAfter = circleSpeedNormal;
                circle.dx = circleSpeedNormalAfter * normalX + circleSpeedTangent * tangentX;
                circle.dy = circleSpeedNormalAfter * normalY + circleSpeedTangent * tangentY;
                otherCircle.dx = otherCircleSpeedNormalAfter * normalX + otherCircleSpeedTangent * tangentX;
                otherCircle.dy = otherCircleSpeedNormalAfter * normalY + otherCircleSpeedTangent * tangentY;
            }
        }
    }
    arrayCircle.forEach(circle => {
        circle.update(ctx);
    });

    requestAnimationFrame(updateCircle);
}

updateCircle();

// Agregar evento de clic al lienzo
canvas.addEventListener("click", function(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    // Iterar sobre los círculos y eliminar el clic si está dentro de alguno
    for (let i = arrayCircle.length - 1; i >= 0; i--) {
        let circle = arrayCircle[i];
        let distance = getDistance(mouseX, mouseY, circle.posX, circle.posY);
        if (distance < circle.radius) {
            // Emitir una luz de color aleatorio desde el centro del círculo
            emitLight(circle.posX, circle.posY);
            // Eliminar el círculo
            arrayCircle.splice(i, 1);
        }}});
            


// Agregar contador para mostrar la posición del cursor
let cursorPosition = document.createElement('div');
cursorPosition.style.position = 'fixed';
cursorPosition.style.top = '10px';
cursorPosition.style.left = '10px'; // Ajustar para que se coloque en la esquina superior izquierda
cursorPosition.style.color = 'white';
document.body.appendChild(cursorPosition);

// Agregar evento de actualización de la posición del cursor
document.addEventListener('mousemove', function(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    cursorPosition.textContent = `X: ${mouseX}, Y: ${mouseY}`;
});
