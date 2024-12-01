const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game elements
const player = { x: 10, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 };
const ai = { x: canvas.width - 20, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speedX: 4, speedY: 4 };

// Game state
let keys = {};
let gameOver = false;
let gameRunning = false;
const WINNING_SCORE = 5;

// Buttons
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const restartButton = document.getElementById("restart");

// Draw functions
function drawRect(x, y, width, height, color = "white") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color = "white") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(text, x, y, fontSize = "20px", color = "white") {
  ctx.fillStyle = color;
  ctx.font = `${fontSize} Arial`;
  ctx.fillText(text, x, y);
}

// Reset ball position
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = -ball.speedX;
  ball.speedY = Math.random() > 0.5 ? 4 : -4;
}

// Update game logic
function update() {
  if (gameOver || !gameRunning) return;

  // Ball movement
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Ball collision with walls
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.speedY = -ball.speedY;
  }

  // Player controls
  if (keys["ArrowUp"] && player.y > 0) player.y -= 5;
  if (keys["ArrowDown"] && player.y < canvas.height - player.height) player.y += 5;

  // AI movement
  const aiCenter = ai.y + ai.height / 2;
  if (ball.y < aiCenter) ai.y -= 4;
  if (ball.y > aiCenter) ai.y += 4;

  // Paddle collisions
  if (
    ball.x - ball.radius < player.x + player.width &&
    ball.y > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.speedX = -ball.speedX * 1.1; // Slightly increase speed
    ball.x = player.x + player.width + ball.radius;
  }

  if (
    ball.x + ball.radius > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + ai.height
  ) {
    ball.speedX = -ball.speedX * 1.1; // Slightly increase speed
    ball.x = ai.x - ball.radius;
  }

  // Scoring
  if (ball.x - ball.radius < 0) {
    ai.score++;
    if (ai.score === WINNING_SCORE) {
      gameOver = true;
      alert("AI Wins!");
      endGame();
    } else {
      resetBall();
    }
  }

  if (ball.x + ball.radius > canvas.width) {
    player.score++;
    if (player.score === WINNING_SCORE) {
      gameOver = true;
      alert("You Win!");
      endGame();
    } else {
      resetBall();
    }
  }
}

// Render the game
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles, ball, and scores
  drawRect(player.x, player.y, player.width, player.height);
  drawRect(ai.x, ai.y, ai.width, ai.height);
  drawCircle(ball.x, ball.y, ball.radius);
  drawText(player.score, canvas.width / 4, 50);
  drawText(ai.score, (3 * canvas.width) / 4, 50);
}

// Game loop
function gameLoop() {
  if (gameOver || !gameRunning) return;
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Event listeners
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Start button
startButton.addEventListener("click", () => {
  if (gameOver) resetGame();
  gameRunning = true;
  startButton.disabled = true;
  stopButton.disabled = false;
  gameLoop();
});

// Stop button
stopButton.addEventListener("click", () => {
  gameRunning = false;
  startButton.disabled = false;
  stopButton.disabled = true;
});

// Restart button
restartButton.addEventListener("click", resetGame);

function resetGame() {
  player.score = 0;
  ai.score = 0;
  gameOver = false;
  gameRunning = false;
  startButton.disabled = false;
  stopButton.disabled = true;
  restartButton.style.display = "none";
  resetBall();
  render();
}

function endGame() {
  gameRunning = false;
  restartButton.style.display = "block";
  startButton.disabled = true;
  stopButton.disabled = true;
}
