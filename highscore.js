const HIGHSCORE_SIZE = 10;

// Highscore starting data with famous Snokas master to beat
let highscores = [
  { name: 'Anjakonda Snokas Master', score: 40 },
  { name: 'Ninja turtle', score: 30 },
  { name: 'Jedi knight', score: 20 },
  { name: 'Padawan', score: 10 }
];

function getHighscoreFromStorage() {
  if (localStorage.getItem('snokasHighscore') !== null) {
    highscores = JSON.parse(localStorage.getItem('snokasHighscore') || '[]');
  }
}

function saveHighscoreToStorage() {
  localStorage.setItem('snokasHighscore', JSON.stringify(highscores));
}

function newHighscore(score) {
  highscores.sort((a, b) => parseInt(b.score) - parseInt(a.score)); // Sort descending
  if (score < 1) { return };

  if (highscores.length < HIGHSCORE_SIZE) {
    swalPrompt(score);
  } else if (score > highscores[highscores.length - 1].score) {
    swalPrompt(score);
  }
}

// Prompts for name before adding new highscore
// From https://sweetalert2.github.io/
async function swalPrompt(score) {
  const { value: name } = await Swal.fire({
    title: 'New Highscore!!',
    input: 'text',
    inputLabel: 'Please enter your name to store in the hall of fame',
    showCancelButton: true,
    confirmButtonColor: '#98006ae7',
    inputValidator: (value) => {
      if (!value) {
        return 'Please enter a name!'
      } else if (value.length > 20) {
        return 'Name too long!'
      }
    }
  })

  if (name) {
    addHighscore(name, score);
  }
}

// Adds highscore
function addHighscore(name, score) {
  let newScore = { name: name, score: score };
  highscores.push(newScore);
  trimHighscore();
  saveHighscoreToStorage();
  highScoreButton();
}

// Keeps highscore size in check
function trimHighscore() {
  highscores.sort((a, b) => parseInt(b.score) - parseInt(a.score)); // Sort descending
  if (highscores.length > HIGHSCORE_SIZE) { highscores = highscores.slice(0, 10) };
}

// Highscore Button to create element
async function highScoreButton() {
  await getHighscoreFromStorage();
  mainSection.innerHTML = "";

  let table = document.createElement('table');
  table.className = 'styled-table';
  mainSection.appendChild(table);

  // Get headers and add headers
  let thead = document.createElement('thead');
  table.appendChild(thead);
  let tr = document.createElement('tr');
  thead.appendChild(tr);

  tr.appendChild(document.createElement('th'));
  Object.keys(highscores[0]).forEach((key) => {
    let th = document.createElement('th');
    let thText = document.createTextNode(capitalizeFirstLetter(key));
    th.appendChild(thText);
    tr.appendChild(th);
  });

  // Add all rows of highscores
  highscores.sort((a, b) => parseInt(b.score) - parseInt(a.score)); // Sort descending

  let tbody = document.createElement('tbody');
  table.appendChild(tbody);
  highscores.forEach((element, i) => {
    let tr = document.createElement('tr');      // Create row

    let td = document.createElement('td');    // Create column
    let tdText = document.createTextNode(`${i + 1}` + (i === 0 ? ' 🏆' : ''));
    td.appendChild(tdText);
    tr.appendChild(td);

    for (const [key, value] of Object.entries(element)) {
      console.log(`${key}: ${value}`);
      let td = document.createElement('td');    // Create column
      let tdText = document.createTextNode(`${value}`);
      if (typeof value == 'number') {           // Align scores to the right
        console.log('is number: ' + value);
        td.style.textAlign = 'right';
      }
      td.appendChild(tdText);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
}

