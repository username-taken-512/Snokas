/*
Snokas Äventyr! 

By: 
Jonatan Engerdahl
HKR
DA377C VT22 - Software Development for the Web

<!-- Source for inspiration: https://www.educative.io/blog/javascript-snake-game-tutorial -->
*/

const CANVAS_BORDER_COLOR = 'black';
const CANVAS_BACKGROUND_COLOR = 'antiquewhite';
const SNAKE_COLOR = 'lightgreen';
const SNAKE_BORDER_COLOR = 'darkgreen';
const SNAKE_EYE_COLOR = 'red';
const FOOD_COLOR = 'crimson';
const FOOD_BORDER_COLOR = 'maroon';
const DEFAULT_SNAKE_SPEED = 70;
const MAX_SNAKE_SPEED = 30;

const gameMusic = new Audio('/sound/Loyalty_Freak_Music_-_03_-_IM_ON_FIRE.mp3');  // Music: https://www.chosic.com/free-music/all/ 
const deadSound = new Audio('/sound/error.mp3');  // Sound: https://www.zapsplat.com/
const eatSound = new Audio('/sound/slime.mp3'); // Sound: https://www.zapsplat.com/
const turnSound = new Audio('/sound/zapsplat_multimedia_game_sound_short_digital_beep_single_78375.mp3'); // Sound: https://www.zapsplat.com/

let foodX;   // Food location horizontal
let foodY;   // Food location vertical
let changingDirection = false;
let soundEnabled = true;       // Default: true
let gameStarted = false;
let snakeSpeed = DEFAULT_SNAKE_SPEED;           // lower means quicker snake
let stepSize = 10;  // The size of each snake step & size of a snake block
let dX = stepSize;  // Horizontal velocity, start direction 10 to go right
let dY = 0;         // Vertical velocity
let score = 0;
let direction = 'r';

let mainSection = document.getElementById('mainSection');
let snakeboard;
let snakeboardCanvas;
document.addEventListener('keydown', changeDirection);

drawCanvas(); // Need to create Canvas to initialize snakeboard/snakeboardCanvas

let startX = snakeboard.getAttribute('width') / 2;
let startY = snakeboard.getAttribute('height') / 2;
let snake = [
  { x: startX, y: startY },
  { x: startX - stepSize, y: startY },
  { x: startX - stepSize * 2, y: startY },
  { x: startX - stepSize * 3, y: startY },
  { x: startX - stepSize * 4, y: startY }
];

// Fit Snake canvas to screen (Grade 5 req)
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  snakeboard.style.width = (window.innerWidth - 40) + 'px';
}

function updateScore() {
  if (snakeSpeed > MAX_SNAKE_SPEED) { snakeSpeed-- } // Make quicker snake
  document.getElementById('score').innerHTML = ' 🍎 ' + (++score); // Update and display score
}

function gameButton() {
  drawCanvas();
  resizeCanvas();
  resetGame();
}

// Draw Canvas HTML
function drawCanvas() {
  mainSection.innerHTML = "";

  let newCanvas = document.createElement('canvas');
  newCanvas.id = 'gameCanvas';
  newCanvas.width = 400;
  newCanvas.height = 400;
  mainSection.appendChild(newCanvas);
  snakeboard = document.getElementById('gameCanvas');
  snakeboardCanvas = gameCanvas.getContext('2d');
}

// draw a border around the canvas
function clearCanvas() {
  snakeboardCanvas.fillStyle = CANVAS_BACKGROUND_COLOR;
  snakeboardCanvas.strokeStyle = CANVAS_BORDER_COLOR;
  snakeboardCanvas.fillRect(0, 0, snakeboard.width, snakeboard.height);   // Draw a "filled" rectangle to cover the entire canvas
  snakeboardCanvas.strokeRect(0, 0, snakeboard.width, snakeboard.height);   // Draw a "border" around the entire canvas
}

// Draw snake head & snake parts 
function drawSnake() {
  snake.forEach((element, index) => {
    (index == 0) ? drawSnakeHead(element) : drawSnakePart(element);
  });
}

// Draw snake head
function drawSnakeHead(snakePart) {
  snakeboardCanvas.fillStyle = SNAKE_COLOR;
  snakeboardCanvas.strokeStyle = SNAKE_BORDER_COLOR;
  snakeboardCanvas.fillRect(snakePart.x, snakePart.y, stepSize, stepSize);   // Draw a "filled" rectangle to represent the snake head
  snakeboardCanvas.strokeRect(snakePart.x, snakePart.y, stepSize, stepSize);   // Draw a border around the snake head

  // Draw snake eyes
  snakeboardCanvas.strokeStyle = SNAKE_EYE_COLOR;
  if (dX === 0) { // Going up/down
    if (dY < 0) {   // Going up
      snakeboardCanvas.strokeRect(snakePart.x + stepSize / 3 - 1, snakePart.y + (stepSize / 3), stepSize / 10, stepSize / 10);
      snakeboardCanvas.strokeRect(snakePart.x + (stepSize / 3) * 2, snakePart.y + (stepSize / 3), stepSize / 10, stepSize / 10);
    } else {        // Going down
      snakeboardCanvas.strokeRect(snakePart.x + stepSize / 3 - 1, snakePart.y + (stepSize / 3) * 2, stepSize / 10, stepSize / 10);
      snakeboardCanvas.strokeRect(snakePart.x + (stepSize / 3) * 2, snakePart.y + (stepSize / 3) * 2, stepSize / 10, stepSize / 10);
    }
  } else {        // Going left/right
    if (dX < 0) {   // Going left
      snakeboardCanvas.strokeRect(snakePart.x + stepSize / 3, snakePart.y + (stepSize / 3) - 1, stepSize / 10, stepSize / 10);
      snakeboardCanvas.strokeRect(snakePart.x + stepSize / 3, snakePart.y + (stepSize / 3) * 2, stepSize / 10, stepSize / 10);
    } else {        // Going right
      snakeboardCanvas.strokeRect(snakePart.x + (stepSize / 3) * 2, snakePart.y + (stepSize / 3) - 1, stepSize / 10, stepSize / 10);
      snakeboardCanvas.strokeRect(snakePart.x + (stepSize / 3) * 2, snakePart.y + (stepSize / 3) * 2, stepSize / 10, stepSize / 10);
    }
  }
}

// Draw one snake part
function drawSnakePart(snakePart) {
  snakeboardCanvas.fillStyle = SNAKE_COLOR;
  snakeboardCanvas.strokeStyle = SNAKE_BORDER_COLOR;
  snakeboardCanvas.fillRect(snakePart.x, snakePart.y, stepSize, stepSize);   // Draw a "filled" rectangle to represent the snake part at the coordinates the part is located
  snakeboardCanvas.strokeRect(snakePart.x, snakePart.y, stepSize, stepSize);   // Draw a border around the snake part
}

// Move snake by adding new head, popping tail (or keeping tail when eating)
function moveSnake() {
  const bodyFront = { x: snake[0].x + dX, y: snake[0].y + dY };
  snake.unshift(bodyFront);
  const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
  if (hasEatenFood) {
    playEatSound();
    generateFood();
    updateScore();
  } else {
    snake.pop();
  }
}

// Direction 
function changeDirection(event) {
  playGameMusic(); // Music start on any first key button press
  const LEFT_KEY = 'ArrowLeft';
  const RIGHT_KEY = 'ArrowRight';
  const UP_KEY = 'ArrowUp';
  const DOWN_KEY = 'ArrowDown';

  // Prevent scrolling in browser
  if ([LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY].indexOf(event.code) > -1) {
    event.preventDefault();
  }
  console.log(event.code);

  if (changingDirection) return;
  changingDirection = true;
  const keyPressed = event.code;
  const goingUp = dY === -stepSize;
  const goingDown = dY === stepSize;
  const goingRight = dX === stepSize;
  const goingLeft = dX === -stepSize;

  // Change velocity according to press, but don't go backwards
  if (keyPressed === LEFT_KEY && !goingRight) {
    dX = -stepSize;
    dY = 0;
    playTurnSound();
    direction = 'l';
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dX = 0;
    dY = -stepSize;
    playTurnSound();
    direction = 'u';
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dX = stepSize;
    dY = 0;
    playTurnSound();
    direction = 'r';
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dX = 0;
    dY = stepSize;
    playTurnSound();
    direction = 'd';
  }
}

// Randomize food location
function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / stepSize) * stepSize;
}

// Generate food
function generateFood() {
  foodX = random_food(0, snakeboard.width - stepSize);
  foodY = random_food(0, snakeboard.height - stepSize);
  console.log('Generating food at: ', foodX, foodY);
  snake.forEach(function hasSnakeEatenFood(part) {
    const hasEaten = part.x == foodX && part.y == foodY;
    if (hasEaten) generateFood();
  });
}

// Food on Canvas
function drawFood() {
  let drawing = new Image();
  drawing.src = '/img/apple.png';
  snakeboardCanvas.drawImage(drawing, foodX, foodY, stepSize, stepSize);
}

// End game conditions
function hasGameEnded() {
  // Check if self collision
  for (let i = 4; i < snake.length; i++) {
    const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (hasCollided)
      return true;
  }
  // Check wall collision
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - stepSize;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - stepSize;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function toggleSound() {
  if (!document.getElementById('soundSwitch').checked) {
    gameMusic.pause();
    soundEnabled = false;
  } else {
    gameMusic.play();
    soundEnabled = true;
  }
}

function playEatSound() {
  if (soundEnabled) { eatSound.cloneNode().play() };
}

function playTurnSound() {
  if (soundEnabled) { turnSound.cloneNode().play() };
}

function playDeadSound() {
  if (soundEnabled) { deadSound.cloneNode().play() };
}

function playGameMusic() {
  gameMusic.loop = true;
  gameMusic.volume = 0.1;
  if (soundEnabled) { gameMusic.play() };
}

// Restart game by resetting values
function resetGame() {
  snake = [
    { x: startX, y: startY },
    { x: startX - stepSize, y: startY },
    { x: startX - stepSize * 2, y: startY },
    { x: startX - stepSize * 3, y: startY },
    { x: startX - stepSize * 4, y: startY }
  ];

  dX = stepSize;  // Horizontal velocity
  dY = 0;   // Vertical velocity
  foodX;   // Food location horizontal
  foodY;   // Food location vertical
  changingDirection = false;
  score = -1;
  snakeSpeed = DEFAULT_SNAKE_SPEED;
  updateScore();

  if (!gameStarted) {
    main();
  }
}

// Game loop
function main() {
  if (hasGameEnded()) {
    playDeadSound();
    gameStarted = false;
    newHighscore(score);  // Add new highscore, if high enough
    return
  };

  gameStarted = true;
  changingDirection = false;
  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    main();
  }, snakeSpeed)
}

// Start the game
main();
generateFood();
playGameMusic();
resizeCanvas();
