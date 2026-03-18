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
    summary: "Lean validation slice focused on one core workflow and fast user feedback."
  },
  {
    max: 18,
    range: "4-6 weeks",
    summary: "Balanced MVP with the right amount of surface area for early user testing."
  },
  {
    max: 26,
    range: "6-8 weeks",
    summary: "Broader MVP with stronger operations, monetization, and internal tooling."
  },
  {
    max: Infinity,
    range: "8+ weeks",
    summary: "This is starting to push beyond MVP scope and needs phased delivery."
  }
];

const boardStateKey = "mvp-showcase-board";
const initialColumns = [
  {
    id: "discovery",
    title: "Discovery",
    tasks: [
      {
        id: "scope",
        badge: "Research",
        title: "Scope the first usable release",
        body: "Lock the smallest feature set that proves value for early users.",
        action: "Move to Build"
      }
    ]
  },
  {
    id: "build",
    title: "Build",
    tasks: [
      {
        id: "flows",
        badge: "Execution",
        title: "Implement core user flows",
        body: "Authentication, dashboard flow, and the one workflow clients actually care about.",
        action: "Move to Launch"
      },
      {
        id: "payments",
        badge: "Revenue",
        title: "Wire billing and permissions",
        body: "Make payments, plans, and user roles production-ready for the first cohort.",
        action: "Move to Launch"
      }
    ]
  },
  {
    id: "launch",
    title: "Launch",
    tasks: [
      {
        id: "handoff",
        badge: "Delivery",
        title: "Prepare for pilot rollout",
        body: "Finish QA, configure analytics, and tighten the first feedback loop.",
        action: "Archive"
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
      badge: "Recycled",
      action: "Move to Build"
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
