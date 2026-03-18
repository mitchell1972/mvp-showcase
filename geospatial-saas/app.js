const regionList = document.querySelector("#region-list");
const regionName = document.querySelector("#region-name");
const regionSummary = document.querySelector("#region-summary");
const sampleCount = document.querySelector("#sample-count");
const analysisCount = document.querySelector("#analysis-count");
const modelStatus = document.querySelector("#model-status");
const stageList = document.querySelector("#stage-list");
const regionTemplate = document.querySelector("#region-template");
const stageTemplate = document.querySelector("#stage-template");

const regions = [
  {
    id: "andalusia",
    title: "Andalusia corridor",
    tag: "Vegetation change",
    summary: "Vegetation and land use change monitoring with an active sample queue and one model run pending review.",
    samples: "218",
    analyses: "4 active",
    model: "Needs review",
    stages: [
      { title: "AOI selection", state: "Stable", copy: "Polygon selection and saved context are working cleanly." },
      { title: "Sample creation", state: "In progress", copy: "Sampling rules are wired but still need edge-case cleanup." },
      { title: "Model training", state: "Pending", copy: "Training should start only after sample QA and run approval." }
    ]
  },
  {
    id: "castile",
    title: "Castile heat map",
    tag: "Infra monitoring",
    summary: "AOI selection is stable, analysis throughput is healthy, and the next risk is model reproducibility.",
    samples: "142",
    analyses: "2 active",
    model: "Ready to train",
    stages: [
      { title: "AOI selection", state: "Stable", copy: "Saved filters and region context now flow correctly into analysis jobs." },
      { title: "Analysis", state: "Stable", copy: "Queued jobs are visible enough for client-facing reporting." },
      { title: "Results output", state: "Needs polish", copy: "Export formatting and run summaries still need tightening." }
    ]
  },
  {
    id: "valencia",
    title: "Valencia coastal set",
    tag: "Habitat tracking",
    summary: "The pipeline is closer to pilot readiness, but review surfaces still need to be clearer for operators.",
    samples: "301",
    analyses: "1 active",
    model: "Pilot ready",
    stages: [
      { title: "Sample creation", state: "Stable", copy: "Review flows and sample counts are clean and visible." },
      { title: "Analysis", state: "Stable", copy: "Pipeline orchestration is consistent and fast enough for pilot usage." },
      { title: "Operator review", state: "In progress", copy: "Admin QA surfaces are the last major cleanup area." }
    ]
  }
];

let selectedRegionId = regions[0].id;

function renderStages(stages) {
  stageList.innerHTML = "";
  stages.forEach((stage) => {
    const fragment = stageTemplate.content.cloneNode(true);
    fragment.querySelector(".stage-title").textContent = stage.title;
    fragment.querySelector(".stage-state").textContent = stage.state;
    fragment.querySelector(".stage-copy").textContent = stage.copy;
    stageList.appendChild(fragment);
  });
}

function renderRegionDetails() {
  const region = regions.find((item) => item.id === selectedRegionId);
  if (!region) {
    return;
  }

  regionName.textContent = region.title;
  regionSummary.textContent = region.summary;
  sampleCount.textContent = region.samples;
  analysisCount.textContent = region.analyses;
  modelStatus.textContent = region.model;
  renderStages(region.stages);
}

function renderRegions() {
  regionList.innerHTML = "";
  regions.forEach((region) => {
    const fragment = regionTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".region-button");
    button.classList.toggle("is-active", region.id === selectedRegionId);
    fragment.querySelector(".region-title").textContent = region.title;
    fragment.querySelector(".region-tag").textContent = region.tag;
    button.addEventListener("click", () => {
      selectedRegionId = region.id;
      renderRegions();
      renderRegionDetails();
    });
    regionList.appendChild(fragment);
  });
}

renderRegions();
renderRegionDetails();
