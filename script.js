const board = document.getElementById('game-board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const winMessage = document.getElementById('win-message');
const finalMoves = document.getElementById('final-moves');
const finalTime = document.getElementById('final-time');

const icons = [
    { icon: "fa-star", color: "#FFD700" },
    { icon: "fa-heart", color: "#FF4C4C" },
    { icon: "fa-moon", color: "#B0C4DE" },
    { icon: "fa-sun", color: "#FFA500" },
    { icon: "fa-leaf", color: "#32CD32" },
    { icon: "fa-snowflake", color: "#00BFFF" },
    { icon: "fa-bolt", color: "#FFD700" },
    { icon: "fa-gem", color: "#8A2BE2" }
  ];
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let timer;
let seconds = 0;
let isTiming = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createCard(icon, color) {
    const card = document.createElement('div');
    card.classList.add('card');
  
    const inner = document.createElement('div');
    inner.classList.add('card-inner');
  
    const front = document.createElement('div');
    front.classList.add('front');
    front.innerHTML = `<i class="fas ${icon}" style="color: ${color};"></i>`;
  
    const back = document.createElement('div');
    back.classList.add('back');
  
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
  
    card.addEventListener('click', () => handleFlip(card, icon));
  
    return card;
  }  
  

function handleFlip(card, icon) {
  if (card.classList.contains('flipped') || flippedCards.length === 2) return;
  if (!isTiming) startTimer();
  card.classList.add('flipped');
  flippedCards.push({ card, icon });

  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    const [first, second] = flippedCards;
    if (first.icon === second.icon) {
      matchedCount++;
      flippedCards = [];
      if (matchedCount === icons.length) {
        clearInterval(timer);
        showWin();
      }
    } else {
      setTimeout(() => {
        first.card.classList.remove('flipped');
        second.card.classList.remove('flipped');
        flippedCards = [];
      }, 1000);
    }
  }
}

function startTimer() {
  isTiming = true;
  timer = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
}

function showWin() {
  winMessage.classList.remove('hidden');
  finalMoves.textContent = moves;
  finalTime.textContent = timerEl.textContent;
}

function startGame() {
    board.innerHTML = '';
    winMessage.classList.add('hidden');
    flippedCards = [];
    matchedCount = 0;
    moves = 0;
    seconds = 0;
    isTiming = false;
    clearInterval(timer);
    movesEl.textContent = '0';
    timerEl.textContent = '00:00';
  
    const iconPairs = [...icons, ...icons].map(obj => ({ ...obj }));
    const gameIcons = shuffle(iconPairs);
  
    gameIcons.forEach(({ icon, color }) => {
      board.appendChild(createCard(icon, color));
    });
  }
  

startGame();
