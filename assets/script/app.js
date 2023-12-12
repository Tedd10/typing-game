import { onEvent, select, selectAll, create, print } from "./utils.js"

const words = [
  'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
  'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
  'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
  'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
  'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
  'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
  'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
  'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
  'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
  'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
  'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
  'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
  'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
  'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
  'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
  'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
  'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
  'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];

const sound = new Audio('./assets/audio/game-sound.mp3');
sound.type = 'audio/mp3';

const soundTwo = new Audio('./assets/audio/right.mp3');
soundTwo.type = 'audio/mp3';

const scores = [];
const SecondInMIlliseconds = 1000;

const startButton = select('.start-button');
const timer = select('.timer');
const hits = select('.hits span');
const word = select('.word');
const input = select('.input');
const result = select('.result');
const background = select('.background');
const resultText = select('.result h1');
const restartButton = select('.restart-button');
const scoreButton = select('.score-button');
const dialog = select('dialog');

let seconds = 20;
let hitsNumber = 0;

timer.innerText = `${seconds}`;

function keepPlaying() {
  if (sound.paused) {
    sound.play();
  }
}

onEvent('load', window, () => {
  input.value = '';
  // restartButton.classList.add('hidden');
  result.classList.add('hidden');
  input.setAttribute('disabled', '');
});

let gameOn = false;



function updateTheTimer() {
  if (timer === 0) {
    gameOver();
  }
  seconds--;
  timer.innerText = `${seconds}`;
  keepPlaying();
  gameOn = true;
}

function randomIndex(length) {
  words.sort(() => Math.random() - 0.5);
  // return Math.floor(Math.random() * length);
}

let copy = [...words];

function addNewWord() {
  // let index = randomIndex(copy.length);
  let index = Math.floor(Math.random() * copy.length);
  word.innerText = `${copy[index]}`;
  copy.splice(index, 1);
}

function removeHidden() {
  restartButton.classList.remove('hidden');
  startButton.classList.add('hidden');
}

let checkTimer;
let checkInput;

function setIntervals() {
  checkTimer = setInterval(updateTheTimer, SecondInMIlliseconds);
  checkInput = setInterval(wordHits, 1);
}

onEvent('click', startButton, () => {
  input.removeAttribute('disabled', '');
  input.focus();
  sound.play();
  setIntervals();
  addNewWord();
  removeHidden();
  console.log(setIntervals)
  console.log(addNewWord)
  console.log(removeHidden)
});


function hit() {
  hitsNumber++;
  hits.innerText = hitsNumber;
  input.value = '';
  addNewWord();
}

function wordHits() {
  gameOver();
  let userWord = input.value;
  if (userWord.toLowerCase().trim() === word.innerText) {
    if (userWord !== '' && word.innerText !== '') {
      soundTwo.play();
      hit();
    }
  }
}

function changeTitle() {
  resultText.innerText = 'Game Over';
  result.classList.remove('hidden');
  background.classList.add('blur-background');
}

let score;
let date;
let percentage;

function setScore() {
  score = hitsNumber;
  date = new Date().toDateString();
  percentage = (((score / words.length)) * 100).toFixed(1);
  scores.push({
    'score': score,
    'percentage': `${percentage}%`,
    'date': date
  });
  console.log(scores)
}

function sortArray(arr) {
  return arr.toSorted((a, b) => b.score - a.score).splice(0, 9);
}

function storeInLocalStorage() {
  let arrayOfScores = sortArray(scores);
  localStorage.setItem('scores', JSON.stringify(arrayOfScores));
}

let resultParagraphs;

function createParagraphs(obj, paragraph) {
  for (const prop in obj) {
    paragraph = create('p');
    paragraph.innerText = `${prop}: ${obj[prop]}`;
    result.appendChild(paragraph);
  }
}

function displayData() {
  setScore();
  storeInLocalStorage();
  let obj = scores[scores.length - 1];
  let paragraph;
  resultParagraphs = selectAll('.result p');
  createParagraphs(obj, paragraph);
  resultParagraphs.forEach(paragraph => paragraph.remove());
}

let storedScores;

function createHighScores(num) {
  storedScores.forEach(obj => {
    let paragraph1 = create('p');
    let paragraph2 = create('p');
    let paragraph3 = create('p');
    let box = create('div');
    paragraph1.innerText = `#${num}`
    paragraph2.innerText = `${obj.score} words`;
    paragraph3.innerText = `${obj.date}`;
    num++;
    [paragraph1, paragraph2, paragraph3].forEach(element => {
      box.appendChild(element);
      if (box.childElementCount == 3) dialog.appendChild(box);
    });
  });
}

function appendScoreInfo() {
  storedScores = JSON.parse(localStorage.getItem('scores'));
  let count = 1;
  createHighScores(count);
}

let noInfoIsAdded = false;

function gameNotStart() {
  if (!scores.length > 0 && !noInfoIsAdded) {
    let paragraph = create('p');
    paragraph.innerText = 'No games have been played';
    dialog.appendChild(paragraph);
    noInfoIsAdded = true;
  }
}

function clearTheDialog() {
  let pElements = dialog.querySelectorAll('dialog p');
  if (pElements.length > 0) {
    pElements.forEach(ele => ele.remove());
  }
}

function scoreBoardInfo() {
  if (scores.length > 0) {
    clearTheDialog();
    appendScoreInfo();
  } else {
    gameNotStart();
  }
}

let checkInputCleared;

function clearIntervals() {
  clearInterval(checkInput);
  clearInterval(checkTimer);
}

function gameOverFunctions() {
  input.value = '';
  displayData();
  scoreBoardInfo();
  clearIntervals();
  changeTitle();
  sound.pause();
  checkInputCleared = true;
}

function gameOver() {
  if (seconds === 0) {
    gameOverFunctions();
    gameOn = false;
  }
}

function removeGameOver() {
  result.classList.add('hidden');
  background.classList.remove('blur-background');
  resultText.innerText = '';
}

function resetGame() {
  removeGameOver();
  copy = [...words];
  input.value = '';
  hitsNumber = 0;
  hits.innerText = hitsNumber;
  resetIntervals();
  addNewWord();
}

function resetIntervals() {
  seconds = 20;
  timer.innerText = `${seconds}`;
  if (checkInputCleared) checkInput = setInterval(wordHits, 1);
  checkTimer = setInterval(updateTheTimer, SecondInMIlliseconds);
  sound.play();
  checkInputCleared = false;
}

onEvent('click', restartButton, () => {
  clearInterval(checkTimer);
  resetGame();
  input.focus();
});

onEvent('click', scoreButton, () => {
  gameNotStart();
  !gameOn ? dialog.showModal() : input.focus();
});

onEvent('click', dialog, function (event) {
  const rect = this.getBoundingClientRect();

  if (event.clientY < rect.top || event.clientY > rect.bottom ||
    event.clientX < rect.left || event.clientX > rect.right) {
    dialog.close();
  }
});