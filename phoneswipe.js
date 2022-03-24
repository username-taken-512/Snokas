// Adds ability to swipe to snakejs.js

mainSection.addEventListener("touchstart", startTouch, false);
mainSection.addEventListener("touchmove", moveTouch, false);

// Swipe Up / Down / Left / Right
let initialX = null;
let initialY = null;

function startTouch(event) {
  initialX = event.touches[0].clientX;
  initialY = event.touches[0].clientY;
};

function moveTouch(event) {
  event.preventDefault(); // Don't scroll
  if (initialX === null) {
    return;
  }

  if (initialY === null) {
    return;
  }

  let currentX = event.touches[0].clientX;
  let currentY = event.touches[0].clientY;

  let diffX = initialX - currentX;
  let diffY = initialY - currentY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0 && direction !== 'r') {
      // swiped left
      console.log("swiped left");
      dX = -stepSize;
      dY = 0;
      playTurnSound();
      direction = 'l';
    } else if (direction !== 'l') {
      // swiped right
      console.log("swiped right");
      dX = stepSize;
      dY = 0;
      playTurnSound();
      direction = 'r';
    }
  } else {
    // sliding vertically
    if (diffY > 0 && direction !== 'd') {
      // swiped up
      console.log("swiped up");
      dX = 0;
      dY = -stepSize;
      playTurnSound();
      direction = 'u';
    } else if (direction !== 'u') {
      // swiped down
      console.log("swiped down");
      dX = 0;
      dY = stepSize;
      playTurnSound();
      direction = 'd';
    }
  }
  initialX = null;
  initialY = null;
};