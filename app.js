const estimateRange = document.querySelector("#estimate-range");
const estimateSummary = document.querySelector("#estimate-summary");
const selectedCount = document.querySelector("#selected-count");
const selectedPoints = document.querySelector("#selected-points");
const featureForm = document.querySelector("#feature-form");
const boardColumns = document.querySelector("#board-columns");
const taskTemplate = document.querySelector("#task-card-template");

const estimateBands = [
  {
    max: 10,
    range: "2-3 weeks",
    summary: "Tight stabilization sprint focused on the most fragile handoff."
  },
  {
    max: 18,
    range: "4-6 weeks",
    summary: "Balanced completion sprint that makes the product usable end to end."
  },
  {
    max: 26,
    range: "6-8 weeks",
    summary: "Broader hardening pass with deeper operational visibility and QA."
  },
  {
    max: Infinity,
    range: "8+ weeks",
    summary: "This is pushing into platform refactoring and should be phased carefully."
  }
];

const boardStateKey = "mvp-showcase-board";
const initialColumns = [
  {
    id: "discovery",
    title: "Audit",
    tasks: [
      {
        id: "scope",
        badge: "Map",
        title: "Trace the broken handoffs",
        body: "Identify exactly where AOI, samples, analysis, training, and results lose context.",
        action: "Move to Integrate"
      }
    ]
  },
  {
    id: "build",
    title: "Integrate",
    tasks: [
      {
        id: "flows",
        badge: "Workflow",
        title: "Reconnect the core pipeline",
        body: "Unify the frontend and backend so the main flow completes without manual intervention.",
        action: "Move to Release"
      },
      {
        id: "payments",
        badge: "Stability",
        title: "Clean the orchestration layer",
        body: "Tighten APIs, job states, and failure handling across Python and app services.",
        action: "Move to Release"
      }
    ]
  },
  {
    id: "launch",
    title: "Release",
    tasks: [
      {
        id: "handoff",
        badge: "Pilot",
        title: "Prepare the first stable release",
        body: "Run QA across the happy path and package the product for a controlled pilot rollout.",
        action: "Recycle"
      }
    ]
  }
];

function readBoardState() {
  const saved = window.localStorage.getItem(boardStateKey);
  if (!saved) {
    return initialColumns;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return initialColumns;
  }
}

function writeBoardState(columns) {
  window.localStorage.setItem(boardStateKey, JSON.stringify(columns));
}

function updateEstimate() {
  const selected = Array.from(featureForm.querySelectorAll("input:checked"));
  const points = selected.reduce(
    (sum, input) => sum + Number.parseInt(input.dataset.points || "0", 10),
    0
  );
  const band = estimateBands.find((item) => points <= item.max);

  selectedCount.textContent = String(selected.length);
  selectedPoints.textContent = String(points);
  estimateRange.textContent = band.range;
  estimateSummary.textContent = band.summary;
}

function cycleTask(taskId) {
  const columns = readBoardState().map((column) => ({
    ...column,
    tasks: [...column.tasks]
  }));

  let currentColumnIndex = -1;
  let currentTaskIndex = -1;

  columns.forEach((column, columnIndex) => {
    const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      currentColumnIndex = columnIndex;
      currentTaskIndex = taskIndex;
    }
  });

  if (currentColumnIndex === -1) {
    return;
  }

  const [task] = columns[currentColumnIndex].tasks.splice(currentTaskIndex, 1);

  if (currentColumnIndex === columns.length - 1) {
    columns[0].tasks.push({
      ...task,
      badge: "Recycle",
      action: "Move to Integrate"
    });
  } else {
    columns[currentColumnIndex + 1].tasks.push(task);
  }

  writeBoardState(columns);
  renderBoard();
}

function createTaskElement(task) {
  const fragment = taskTemplate.content.cloneNode(true);
  fragment.querySelector(".task-badge").textContent = task.badge;
  fragment.querySelector("h3").textContent = task.title;
  fragment.querySelector("p").textContent = task.body;

  const button = fragment.querySelector(".task-action");
  button.textContent = task.action;
  button.addEventListener("click", () => cycleTask(task.id));

  return fragment;
}

function renderBoard() {
  const columns = readBoardState();
  boardColumns.innerHTML = "";

  columns.forEach((column) => {
    const section = document.createElement("section");
    section.className = "column";

    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = column.title;
    const count = document.createElement("span");
    count.className = "column-count";
    count.textContent = `${column.tasks.length} items`;

    header.append(title, count);

    const taskList = document.createElement("div");
    taskList.className = "task-list";
    column.tasks.forEach((task) => taskList.appendChild(createTaskElement(task)));

    section.append(header, taskList);
    boardColumns.appendChild(section);
  });
}

featureForm.addEventListener("change", updateEstimate);

updateEstimate();
renderBoard();
