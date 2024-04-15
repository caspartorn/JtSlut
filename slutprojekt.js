const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0; // Initialize score

const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.35,
    jumpStrength: -8,
    draw: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    },
    flap: function() {
        this.velocity = this.jumpStrength;
    },
    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;
    }
};

const pipes = [];
const pipeGap = 200;

function Pipe() {
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - pipeGap * 2) + pipeGap / 2;

    this.draw = function() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, 0, 50, this.y - pipeGap / 2);
        ctx.fillRect(this.x, this.y + pipeGap / 2, 50, canvas.height - (this.y + pipeGap / 2));
    };

    this.update = function() {
        this.x -= 2;

        // Check if bird has passed this pipe
        if (bird.x > this.x && bird.x < this.x + 50) {
            score++; // Increment score
        }
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bird.draw();
    pipes.forEach(pipe => pipe.draw());

    // Display score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 40);
}

function update() {
    bird.update();
    pipes.forEach(pipe => {
        pipe.update();
        if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + 50 &&
            (bird.y - bird.radius < pipe.y - pipeGap / 2 || bird.y + bird.radius > pipe.y + pipeGap / 2)) {
            location.reload();
        }
    });
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        location.reload();
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        bird.flap();
    }
});

setInterval(function() {
    pipes.push(new Pipe());
}, 2000);
