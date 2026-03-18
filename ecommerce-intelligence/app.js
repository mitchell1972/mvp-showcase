const connectorList = document.querySelector("#connector-list");
const detailTitle = document.querySelector("#detail-title");
const detailCopy = document.querySelector("#detail-copy");
const metricCatalog = document.querySelector("#metric-catalog");
const metricPricing = document.querySelector("#metric-pricing");
const metricSync = document.querySelector("#metric-sync");
const connectorTemplate = document.querySelector("#connector-template");

const connectors = [
  {
    id: "shopify",
    title: "Shopify catalog connector",
    copy: "Normalize catalog, pricing, and inventory deltas into one stable ingestion path.",
    tag: "Reliable baseline",
    detailTitle: "Marketplace trend signal",
    detailCopy: "A clean API-backed source health view that makes it obvious which products need action and which connectors can be trusted.",
    catalog: "91%",
    pricing: "7 alerts",
    sync: "Stable"
  },
  {
    id: "amazon",
    title: "Amazon marketplace feed",
    copy: "Track competitive pricing changes and product drift without manual spreadsheet work.",
    tag: "High-volume source",
    detailTitle: "Competitive pricing drift",
    detailCopy: "Surface the products that actually need repricing attention, rather than flooding operators with raw feed noise.",
    catalog: "84%",
    pricing: "14 alerts",
    sync: "Monitoring"
  },
  {
    id: "meta",
    title: "Meta ads and offer sync",
    copy: "Join campaign activity with product availability so operators can react to broken spend quickly.",
    tag: "Cross-channel signal",
    detailTitle: "Spend vs. availability",
    detailCopy: "The useful MVP move here is connecting ad spend and inventory condition so the team sees broken loops before budget leaks.",
    catalog: "88%",
    pricing: "3 alerts",
    sync: "Healthy"
  }
];

let selectedConnectorId = connectors[0].id;

function renderDetails() {
  const connector = connectors.find((item) => item.id === selectedConnectorId);
  if (!connector) {
    return;
  }

  detailTitle.textContent = connector.detailTitle;
  detailCopy.textContent = connector.detailCopy;
  metricCatalog.textContent = connector.catalog;
  metricPricing.textContent = connector.pricing;
  metricSync.textContent = connector.sync;
}

function renderConnectors() {
  connectorList.innerHTML = "";
  connectors.forEach((connector) => {
    const fragment = connectorTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".connector-card");
    button.classList.toggle("is-active", connector.id === selectedConnectorId);
    fragment.querySelector(".connector-title").textContent = connector.title;
    fragment.querySelector(".connector-copy").textContent = connector.copy;
    fragment.querySelector(".connector-tag").textContent = connector.tag;
    button.addEventListener("click", () => {
      selectedConnectorId = connector.id;
      renderConnectors();
      renderDetails();
    });
    connectorList.appendChild(fragment);
  });
}

renderConnectors();
renderDetails();
