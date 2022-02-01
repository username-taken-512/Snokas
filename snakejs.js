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

const gameMusic = new Audio('/sound/Loyalty_Freak_Music_-_03_-_IM_ON_FIRE.mp3');  // Music: https://www.chosic.com/free-music/all/ 
const deadSound = new Audio('/sound/error.mp3');  // Sound: https://www.zapsplat.com/
const eatSound = new Audio('/sound/slime.mp3'); // Sound: https://www.zapsplat.com/
const turnSound = new Audio('/sound/zapsplat_multimedia_game_sound_short_digital_beep_single_78375.mp3'); // Sound: https://www.zapsplat.com/

let foodX;   // Food location horizontal
let foodY;   // Food location vertical
let changingDirection = false;
let soundEnabled = false;       // Default: true
let gameStarted = false;
let snakeSpeed = 100;           // lower means quicker snake
let stepSize = 10;
let dX = stepSize;  // Horizontal velocity, start direction 10 to go right
let dY = 0;         // Vertical velocity
let score = 0;

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
  console.log('resize listener width ' + window.innerWidth);
  console.log('resize listene height ' + window.innerHeight);
  snakeboard.style.width = (window.innerWidth - 40) + 'px';
  console.log('new Canvas size: ' + (window.innerWidth - 100));
}

function updateScore() {
  document.getElementById('score').innerHTML = ' 🍎 ' + (++score);
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
    if (dY < 0) { // Going up
      // snakeboard_ctx.strokeRect(snakePart.x + 3, snakePart.y + 3, 1, 1);
      // snakeboard_ctx.strokeRect(snakePart.x + 6, snakePart.y + 3, 1, 1);
      snakeboardCanvas.strokeRect(snakePart.x + stepSize / 3 - 1, snakePart.y + (stepSize / 3), stepSize / 10, stepSize / 10);
      snakeboardCanvas.strokeRect(snakePart.x + (stepSize / 3) * 2, snakePart.y + (stepSize / 3), stepSize / 10, stepSize / 10);
    } else {      // Going down
      snakeboardCanvas.strokeRect(snakePart.x + stepSize / 3 - 1, snakePart.y + (stepSize / 3) * 2, stepSize / 10, stepSize / 10);
      snakeboardCanvas.strokeRect(snakePart.x + (stepSize / 3) * 2, snakePart.y + (stepSize / 3) * 2, stepSize / 10, stepSize / 10);
    }
  } else {        // Going left/right
    if (dX < 0) { // Going left
      snakeboardCanvas.strokeRect(snakePart.x + stepSize / 3, snakePart.y + (stepSize / 3) - 1, stepSize / 10, stepSize / 10);
      snakeboardCanvas.strokeRect(snakePart.x + stepSize / 3, snakePart.y + (stepSize / 3) * 2, stepSize / 10, stepSize / 10);

      // snakeboard_ctx.strokeRect(snakePart.x + 3, snakePart.y + 3, 1, 1);
      // snakeboard_ctx.strokeRect(snakePart.x + 3, snakePart.y + 6, 1, 1);
    } else {      // Going right
      snakeboardCanvas.strokeRect(snakePart.x + (stepSize / 3) * 2, snakePart.y + (stepSize / 3) - 1, stepSize / 10, stepSize / 10);
      snakeboardCanvas.strokeRect(snakePart.x + (stepSize / 3) * 2, snakePart.y + (stepSize / 3) * 2, stepSize / 10, stepSize / 10);

      // snakeboard_ctx.strokeRect(snakePart.x + 6, snakePart.y + 3, 1, 1);
      // snakeboard_ctx.strokeRect(snakePart.x + 6, snakePart.y + 6, 1, 1);
    }
  }
  console.log('dx: ' + dX + ' dy: ' + dY);
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
  // Create the new Snake's head
  const head = { x: snake[0].x + dX, y: snake[0].y + dY };
  snake.unshift(head);
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
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dX = 0;
    dY = -stepSize;
    playTurnSound();
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dX = stepSize;
    dY = 0;
    playTurnSound();
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dX = 0;
    dY = stepSize;
    playTurnSound();
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
  // snakeboard_ctx.fillStyle = FOOD_COLOR;
  // snakeboard_ctx.strokeStyle = FOOD_BORDER_COLOR;
  // snakeboard_ctx.fillRect(foodX, foodY, stepSize, stepSize);
  // snakeboard_ctx.strokeRect(foodX, foodY, stepSize, stepSize);

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
  // let soundSwitch = document.getElementById('soundSwitch').checked;
  // console.log(soundSwitch.checked);

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

// Restart game be resetting values
function resetGame() {
  snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
  ];

  dX = stepSize;  // Horizontal velocity
  dY = 0;   // Vertical velocity
  foodX;   // Food location horizontal
  foodY;   // Food location vertical
  changingDirection = false;
  score = -1;
  updateScore();

  if (!gameStarted) {
    main();
  }
}

// main function called repeatedly to keep the game running
function main() {
  if (hasGameEnded()) {
    playDeadSound();
    gameStarted = false;
    newHighScore(score);  // Add new highscore, if high enough
    return
  };

  gameStarted = true;
  changingDirection = false;
  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    // Call main again
    main();
  }, snakeSpeed)
}

drawCanvas();
main();
generateFood();
playGameMusic();
resizeCanvas();
