const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ball Properties
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 2; // Ball speed in X direction
let ballDY = -2; // Ball speed in Y direction
let ballRadius = 10;

// Paddle Properties
let paddleWidth = 75;
let paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleDX = 7; // Paddle movement speed





let starttimer = Date.now();
let elapsedtime= 0;
let gamerunning = true;

// Brick Properties
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 20;
let bricks = [];

// Initialize Bricks
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Key Press Events
let rightPressed = false;
let leftPressed = false;

// Event Listeners
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
    if (event.key === "ArrowRight") {
        rightPressed = true;
    } else if (event.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "ArrowRight") {
        rightPressed = false;
    } else if (event.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Draw Ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

// Draw Paddle
function drawPaddle() {
    ctx.fillStyle = "blue";
    ctx.fillRect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
}

// Draw Bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.fillStyle = "green";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}
function drawtimer(){
    if (gamerunning) {
        elapsedtime = Math.floor(( Date.now() - starttimer) / 1000);
    }
    ctx.fillStyle = "black";
    ctx.font = "16px arial";
    ctx.fillText("Time:"+ elapsedtime + "s", 10,20);
}

// Collision Detection for Ball and Bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];
            if (brick.status === 1) {
                if (
                    ballX > brick.x &&
                    ballX < brick.x + brickWidth &&
                    ballY > brick.y &&
                    ballY < brick.y + brickHeight
                ) {
                    ballDY = -ballDY;
                    brick.status = 0; // Remove brick
                }
            }
        }
    }
}

// Move Ball
function moveBall() {
    ballX += ballDX;
    ballY += ballDY;

    // Bounce Ball off Left & Right Walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballDX = -ballDX;
    }

    // Bounce Ball off Top Wall
    if (ballY - ballRadius < 0) {
        ballDY = -ballDY;
    }

    // Ball Hits Paddle
    if (
        ballY + ballRadius > canvas.height - paddleHeight - 5 &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
    ) {
        ballDY = -ballDY;
    }

    // Ball Falls Off Bottom (Game Over)
    if (ballY + ballRadius > canvas.height) {
        alert("Game Over! Restarting...");
        document.location.reload(); // Restart Game
    }
}

// Move Paddle
function movePaddle() {
    if (rightPressed && paddleX + paddleWidth < canvas.width) {
        paddleX += paddleDX;
    }
    if (leftPressed && paddleX > 0) {
        paddleX -= paddleDX;
    }
}
// Update Game (Main Loop)
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear Canvas
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    moveBall();
    movePaddle();
    drawtimer();
    
    requestAnimationFrame(update); // Keep Looping
}

update(); // Start Game
