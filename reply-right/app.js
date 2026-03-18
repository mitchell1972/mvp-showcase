const sourceMessage = document.querySelector("#source-message");
const rewriteButton = document.querySelector("#rewrite-button");
const rewrittenMessage = document.querySelector("#rewritten-message");
const conflictScore = document.querySelector("#conflict-score");
const selectedModeLabel = document.querySelector("#selected-mode-label");
const messageLength = document.querySelector("#message-length");
const historyList = document.querySelector("#history-list");
const historyTemplate = document.querySelector("#history-item-template");
const modeButtons = document.querySelectorAll(".mode-chip");
const retainFacts = document.querySelector("#retain-facts");
const removeBlame = document.querySelector("#remove-blame");

const historyKey = "reply-right-history";
let selectedMode = "neutral";

const replacements = [
  [/you never/gi, "I want to clarify"],
  [/you always/gi, "I am concerned that"],
  [/this is ridiculous/gi, "this is difficult"],
  [/asap/gi, "as soon as you can"],
  [/why didn't you/gi, "can you clarify why"],
  [/stop/gi, "please stop"],
  [/need it now/gi, "need it soon"],
  [/immediately/gi, "promptly"],
  [/!!!+/g, "."]
];

function calculateConflict(text) {
  const negativeWords = ["never", "always", "ridiculous", "angry", "hate", "frustrated", "wrong"];
  const lowered = text.toLowerCase();
  const keywordHits = negativeWords.filter((word) => lowered.includes(word)).length;
  const punctuationHits = (text.match(/[!?]/g) || []).length;
  const uppercaseHits = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
  return Math.min(100, 18 + keywordHits * 12 + punctuationHits * 4 + uppercaseHits * 8);
}

function rewriteText(text) {
  let output = text.trim().replace(/\s+/g, " ");

  replacements.forEach(([pattern, value]) => {
    output = output.replace(pattern, value);
  });

  if (removeBlame.checked) {
    output = output
      .replace(/\byou\b/gi, "we")
      .replace(/\byour\b/gi, "the");
  }

  if (selectedMode === "neutral") {
    output = `I want to keep things clear and cooperative. ${output}`;
  }

  if (selectedMode === "clear") {
    output = `To keep things moving smoothly: ${output}`;
  }

  if (selectedMode === "brief") {
    output = output
      .split(/[.?!]/)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(". ");
    if (!output.endsWith(".")) {
      output += ".";
    }
  }

  if (!retainFacts.checked) {
    output = output.replace(/\b(details|timing|plan|pickup)\b/gi, "next steps");
  }

  return output
    .replace(/\s+,/g, ",")
    .replace(/\s+\./g, ".")
    .replace(/\.{2,}/g, ".")
    .trim();
}

function readHistory() {
  const saved = window.localStorage.getItem(historyKey);
  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function writeHistory(items) {
  window.localStorage.setItem(historyKey, JSON.stringify(items));
}

function renderHistory() {
  historyList.innerHTML = "";
  const items = readHistory();

  items.forEach((item) => {
    const fragment = historyTemplate.content.cloneNode(true);
    fragment.querySelector(".history-mode").textContent = item.mode;
    fragment.querySelector(".history-score").textContent = `Score ${item.score}`;
    fragment.querySelector(".history-preview").textContent = item.preview;
    historyList.appendChild(fragment);
  });
}

function updateOutput() {
  const raw = sourceMessage.value;
  const output = rewriteText(raw);
  const score = calculateConflict(raw);

  rewrittenMessage.textContent = output;
  conflictScore.textContent = String(score);
  selectedModeLabel.textContent = selectedMode[0].toUpperCase() + selectedMode.slice(1);
  messageLength.textContent = `${output.length} chars`;

  const history = readHistory();
  history.unshift({
    mode: selectedMode[0].toUpperCase() + selectedMode.slice(1),
    score,
    preview: output
  });
  writeHistory(history.slice(0, 6));
  renderHistory();
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    selectedMode = button.dataset.mode || "neutral";
  });
});

rewriteButton.addEventListener("click", updateOutput);

renderHistory();
