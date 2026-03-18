const phaseList = document.querySelector("#phase-list");
const detailTitle = document.querySelector("#detail-title");
const detailCopy = document.querySelector("#detail-copy");
const metricUi = document.querySelector("#metric-ui");
const metricRisk = document.querySelector("#metric-risk");
const phaseTemplate = document.querySelector("#phase-template");

const phases = [
  {
    id: "audit",
    title: "Prototype audit",
    copy: "Map what can be kept, what breaks under real usage, and what needs backend support.",
    tag: "Reuse first",
    detail: "Review what is already reusable, isolate fragile interactions, and decide where native wrappers or backend services are actually needed.",
    ui: "78%",
    risk: "Medium"
  },
  {
    id: "wrap",
    title: "Mobile app shell",
    copy: "Turn the static prototype into a stable container for iOS/Android delivery.",
    tag: "Native-ready",
    detail: "Add routing, persistent state, error handling, and the app shell required to move from prototype screens to an installable product.",
    ui: "86%",
    risk: "Low"
  },
  {
    id: "ship",
    title: "Deployment and QA",
    copy: "Prepare builds, close edge cases, and make release handoff predictable.",
    tag: "Release path",
    detail: "Run through the real user path, package builds, and make sure the converted product can be deployed without prototype-only assumptions.",
    ui: "92%",
    risk: "Low"
  }
];

let selectedPhaseId = phases[0].id;

function renderDetails() {
  const phase = phases.find((item) => item.id === selectedPhaseId);
  if (!phase) {
    return;
  }

  detailTitle.textContent = phase.title;
  detailCopy.textContent = phase.detail;
  metricUi.textContent = phase.ui;
  metricRisk.textContent = phase.risk;
}

function renderPhases() {
  phaseList.innerHTML = "";
  phases.forEach((phase) => {
    const fragment = phaseTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".phase-card");
    button.classList.toggle("is-active", phase.id === selectedPhaseId);
    fragment.querySelector(".phase-title").textContent = phase.title;
    fragment.querySelector(".phase-copy").textContent = phase.copy;
    fragment.querySelector(".phase-tag").textContent = phase.tag;
    button.addEventListener("click", () => {
      selectedPhaseId = phase.id;
      renderPhases();
      renderDetails();
    });
    phaseList.appendChild(fragment);
  });
}

renderPhases();
renderDetails();
