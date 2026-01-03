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

  if (normalize(rowA.input1.value) === normalize(puzzle.pairA[0])) {
    rowA.input1.classList.add("correct");
    correct++;
  }
  if (normalize(rowA.input2.value) === normalize(puzzle.pairA[1])) {
    rowA.input2.classList.add("correct");
    correct++;
  }
  if (normalize(rowB.input1.value) === normalize(puzzle.pairB[0])) {
    rowB.input1.classList.add("correct");
    correct++;
  }
  if (normalize(rowB.input2.value) === normalize(puzzle.pairB[1])) {
    rowB.input2.classList.add("correct");
    correct++;
  }

  if (correct === 4) {
    message.textContent = "🎉 Perfect! See you tomorrow.";
    localStorage.setItem(storageKey, "won");
    submitBtn.disabled = true;
  } else {
    message.textContent = "Not quite — try again!";
  }
}

/* ---------- LOCK IF PLAYED ---------- */
if (localStorage.getItem(storageKey)) {
  submitBtn.disabled = true;
  message.textContent = "You've already played today's puzzle 🥄";
}

/* ---------- EVENTS ---------- */
submitBtn.addEventListener("click", check);
