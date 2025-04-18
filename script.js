const board = document.getElementById("game-board");
const winMessage = document.getElementById("win-message");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");

let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let seconds = 0;
let isTiming = false;
let timer;
let totalPairs = 8; // default for medium

const icons = [
  { icon: "fa-star", color: "#FFD700" },
  { icon: "fa-heart", color: "#FF4C4C" },
  { icon: "fa-moon", color: "#B0C4DE" },
  { icon: "fa-sun", color: "#FFA500" },
  { icon: "fa-leaf", color: "#32CD32" },
  { icon: "fa-snowflake", color: "#00BFFF" },
  { icon: "fa-bolt", color: "#FFD700" },
  { icon: "fa-gem", color: "#8A2BE2" },
  { icon: "fa-ghost", color: "#999" },
  { icon: "fa-fish", color: "#1E90FF" },
  { icon: "fa-apple-alt", color: "#DC143C" },
  { icon: "fa-feather", color: "#D2691E" },
  { icon: "fa-anchor", color: "#4682B4" },
  { icon: "fa-cube", color: "#6A5ACD" }
];

function startGame(difficulty = 'medium') {
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

  let numPairs;
  switch (difficulty) {
    case 'easy':
      numPairs = 4;
      board.style.gridTemplateColumns = 'repeat(4, 1fr)';
      break;
    case 'medium':
      numPairs = 8;
      board.style.gridTemplateColumns = 'repeat(4, 1fr)';
      break;
    case 'hard':
      numPairs = 12;
      board.style.gridTemplateColumns = 'repeat(6, 1fr)';
      break;
  }

  totalPairs = numPairs;

  const selectedIcons = shuffle(icons).slice(0, numPairs);
  const iconPairs = [...selectedIcons, ...selectedIcons].map(obj => ({ ...obj }));
  const gameIcons = shuffle(iconPairs);

  gameIcons.forEach(({ icon, color }) => {
    board.appendChild(createCard(icon, color));
  });
}

function createCard(icon, color) {
  const card = document.createElement('div');
  card.classList.add('card');

  const inner = document.createElement('div');
  inner.classList.add('card-inner');

  const front = document.createElement('div');
  front.classList.add('front');
  front.innerHTML = `<i class="fas ${icon}" style="color: ${color}; font-size: 24px;"></i>`;

  const back = document.createElement('div');
  back.classList.add('back');

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener('click', () => handleFlip(card, icon));

  return card;
}

function handleFlip(card, icon) {
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  if (!isTiming) {
    isTiming = true;
    timer = setInterval(updateTimer, 1000);
  }

  card.classList.add("flipped");
  flippedCards.push({ card, icon });

  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    const [first, second] = flippedCards;

    if (first.icon === second.icon) {
      matchedCount++;
      flippedCards = [];

      if (matchedCount === totalPairs) {
        clearInterval(timer);
        // Update the win message with final moves and time
        document.getElementById("final-moves").textContent = moves;
        document.getElementById("final-time").textContent = timerEl.textContent;
        winMessage.classList.remove("hidden");
      }
    } else {
      setTimeout(() => {
        first.card.classList.remove("flipped");
        second.card.classList.remove("flipped");
        flippedCards = [];
      }, 1000);
    }
  }
}

function updateTimer() {
  seconds++;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  timerEl.textContent = `${mins}:${secs}`;
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex--);
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
