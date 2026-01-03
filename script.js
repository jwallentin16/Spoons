/* ---------- BACKGROUND LETTERS ---------- */
const lettersContainer = document.querySelector(".letters");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

for (let i = 0; i < 60; i++) {
  const span = document.createElement("span");
  span.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
  span.style.animationDelay = `${Math.random() * 4}s`;
  lettersContainer.appendChild(span);
}

/* ---------- PUZZLES ---------- */
const puzzles = [
  {
    pairA: ["Mad", "Dash"],
    pairB: ["Dad", "Mash"],
    hintA: "A scramble",
    hintB: "Your father's favorite potato dish"
  },
  {
    pairA: ["Cold", "Feet"],
    pairB: ["Fold", "Keet"],
    hintA: "Pre-wedding nerves",
    hintB: "A very confused bird"
  }
];

/* ---------- DAILY LOGIC ---------- */
const startDate = new Date("2026-01-01");
const today = new Date();
const dayIndex = Math.floor(
  (today - startDate) / (1000 * 60 * 60 * 24)
);

const puzzle = puzzles[dayIndex % puzzles.length];
const storageKey = `spoonerisms-${today.toDateString()}`;

/* ---------- GAME STATE ---------- */
let guessesLeft = 3;

const dotsContainer = document.getElementById("guess-dots");
const guessesLeftEl = document.getElementById("guesses-left");

function renderDots() {
  dotsContainer.innerHTML = "";
  for (let i = 0; i < guessesLeft; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dotsContainer.appendChild(dot);
  }
  guessesLeftEl.textContent = `${guessesLeft} guess${guessesLeft !== 1 ? "es" : ""} left`;
}

renderDots();

/* ---------- UI ---------- */
const container = document.getElementById("game-container");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submit");

function createRow(hint) {
  const div = document.createElement("div");

  const hintEl = document.createElement("div");
  hintEl.className = "hint";
  hintEl.textContent = hint;

  const inputs = document.createElement("div");
  inputs.className = "inputs";

  const input1 = document.createElement("input");
  const input2 = document.createElement("input");

  inputs.append(input1, input2);
  div.append(hintEl, inputs);

  return { div, input1, input2 };
}

const rowA = createRow(puzzle.hintA);
const rowB = createRow(puzzle.hintB);

container.append(rowA.div, rowB.div);

/* ---------- GAME LOGIC ---------- */
function normalize(word) {
  return word.toLowerCase().trim();
}
function check() {
  let correct = 0;

  const checks = [
    [rowA.input1, puzzle.pairA[0]],
    [rowA.input2, puzzle.pairA[1]],
    [rowB.input1, puzzle.pairB[0]],
    [rowB.input2, puzzle.pairB[1]]
  ];

  checks.forEach(([input, answer]) => {
    if (normalize(input.value) === normalize(answer)) {
      input.classList.add("correct");
      correct++;
    } else {
      input.classList.remove("correct");
    }
  });

  if (correct === 4) {
    message.textContent =
      "🥄 Spoonerific! You're a rockstar. See you tomorrow.";
    launchConfetti();
    localStorage.setItem(storageKey, "won");
    submitBtn.disabled = true;
    return;
  }

  guessesLeft--;

  container.classList.add("shake");
  setTimeout(() => container.classList.remove("shake"), 300);


 if (correct > 0) {
  message.textContent = `❌ ${correct} word${correct > 1 ? "s" : ""} correct`;
} else {
  message.textContent = "❌";
}

const usedDot = dotsContainer.querySelector(".dot");
if (usedDot) {
  usedDot.classList.add("used");
  usedDot.textContent = "❌";
}

renderDots();

  // Clear inputs for next guess
  [...document.querySelectorAll("input")].forEach(input => {
    input.value = "";
    input.classList.remove("correct");
  });

  if (guessesLeft === 0) {
    submitBtn.disabled = true;
    message.textContent = "❌❌❌ No more guesses — see you tomorrow!";
    localStorage.setItem(storageKey, "lost");
  }
}

function launchConfetti() {
  const confetti = document.getElementById("confetti");
  const emojis = ["🎉", "🥄"];

  for (let i = 0; i < 30; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.animationDuration = 2 + Math.random() * 2 + "s";
    piece.style.opacity = Math.random();
    confetti.appendChild(piece);

    setTimeout(() => piece.remove(), 4000);
  }
}

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", () => {
    input.classList.add("typing");
    setTimeout(() => input.classList.remove("typing"), 150);
  });
});

const toggle = document.getElementById("dark-toggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark")
  );
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}



/* ---------- LOCK IF PLAYED ---------- */
if (localStorage.getItem(storageKey)) {
  submitBtn.disabled = true;
  message.textContent = "You've already played today's Spoonerism 🥄";
}

/* ---------- EVENTS ---------- */
submitBtn.addEventListener("click", check);

const spoonFacts = [
  "The word 'spoon' comes from the Old English 'spōn', meaning chip of wood.",
  "The average household owns about 40 spoons.",
  "Spoons predate forks by several hundred years.",
  "The world’s largest spoon is over 10 feet long.",
  "Spoonerisms are named after Reverend William Spooner."
];

document.getElementById("spoon-fact").textContent =
  spoonFacts[Math.floor(Math.random() * spoonFacts.length)];

@media (max-width: 360px) {
  #guess-dots {
    gap: 6px;
  }
}



