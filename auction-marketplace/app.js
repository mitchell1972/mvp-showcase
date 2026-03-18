const listingGrid = document.querySelector("#listing-grid");
const detailTitle = document.querySelector("#detail-title");
const currentBid = document.querySelector("#current-bid");
const timeLeft = document.querySelector("#time-left");
const detailDescription = document.querySelector("#detail-description");
const bidInput = document.querySelector("#bid-input");
const placeBid = document.querySelector("#place-bid");
const bidNote = document.querySelector("#bid-note");
const bidHistory = document.querySelector("#bid-history");
const listingTemplate = document.querySelector("#listing-card-template");
const historyTemplate = document.querySelector("#bid-history-template");

const stateKey = "auction-marketplace-demo";
const listings = [
  {
    id: "camera",
    category: "Electronics",
    title: "Vintage rangefinder camera",
    copy: "Lean listing flow with a current bid, seller history, and a buyer-safe bidding experience.",
    description: "A simplified auction item used to validate seller listing, item detail pages, and bid placement without unnecessary marketplace complexity.",
    endsIn: "3h 18m",
    currentBid: 420,
    history: [
      { amount: 420, meta: "Current high bid · 2 minutes ago" },
      { amount: 405, meta: "Bid received · 11 minutes ago" },
      { amount: 390, meta: "Opening momentum · 34 minutes ago" }
    ]
  },
  {
    id: "watch",
    category: "Collectibles",
    title: "Field watch, limited run",
    copy: "Designed to show a clean item detail, bid history, and lightweight admin oversight for early testing.",
    description: "This sample listing highlights the fast path for registration, seller profiles, listing creation, and bidding validation in the first MVP.",
    endsIn: "9h 40m",
    currentBid: 265,
    history: [
      { amount: 265, meta: "Current high bid · 4 minutes ago" },
      { amount: 250, meta: "Bid received · 17 minutes ago" }
    ]
  },
  {
    id: "chair",
    category: "Furniture",
    title: "Mid-century accent chair",
    copy: "A broader seller-side example showing how the product can stay simple while still feeling credible.",
    description: "The admin slice remains intentionally narrow here: listing management, bid review, and quick visibility into active auctions.",
    endsIn: "1d 2h",
    currentBid: 610,
    history: [
      { amount: 610, meta: "Current high bid · 9 minutes ago" },
      { amount: 580, meta: "Bid received · 22 minutes ago" },
      { amount: 540, meta: "Opening bid · 1 hour ago" }
    ]
  }
];

let selectedListingId = listings[0].id;

function readState() {
  const saved = window.localStorage.getItem(stateKey);
  if (!saved) {
    return listings;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return listings;
  }
}

function writeState(items) {
  window.localStorage.setItem(stateKey, JSON.stringify(items));
}

function renderListings() {
  listingGrid.innerHTML = "";
  const state = readState();

  state.forEach((listing) => {
    const fragment = listingTemplate.content.cloneNode(true);
    fragment.querySelector(".listing-category").textContent = listing.category;
    fragment.querySelector(".listing-time").textContent = listing.endsIn;
    fragment.querySelector(".listing-title").textContent = listing.title;
    fragment.querySelector(".listing-copy").textContent = listing.copy;
    fragment.querySelector(".listing-bid").textContent = `$${listing.currentBid}`;

    fragment.querySelector(".listing-button").addEventListener("click", () => {
      selectedListingId = listing.id;
      renderDetail();
    });

    listingGrid.appendChild(fragment);
  });
}

function renderDetail() {
  const listing = readState().find((item) => item.id === selectedListingId);
  if (!listing) {
    return;
  }

  detailTitle.textContent = listing.title;
  currentBid.textContent = `$${listing.currentBid}`;
  timeLeft.textContent = listing.endsIn;
  detailDescription.textContent = listing.description;
  bidInput.value = String(listing.currentBid + 20);
  bidHistory.innerHTML = "";

  listing.history.forEach((entry) => {
    const fragment = historyTemplate.content.cloneNode(true);
    fragment.querySelector(".bid-amount").textContent = `$${entry.amount}`;
    fragment.querySelector(".bid-meta").textContent = entry.meta;
    bidHistory.appendChild(fragment);
  });
}

function placeBidOnListing() {
  const state = readState();
  const listing = state.find((item) => item.id === selectedListingId);
  if (!listing) {
    return;
  }

  const value = Number.parseInt(bidInput.value || "0", 10);
  if (Number.isNaN(value) || value <= listing.currentBid) {
    bidNote.textContent = `Bid must be above $${listing.currentBid}.`;
    return;
  }

  listing.currentBid = value;
  listing.history.unshift({
    amount: value,
    meta: "New demo bid · just now"
  });

  writeState(state);
  bidNote.textContent = `Bid accepted at $${value}. This simulates the core auction loop for MVP validation.`;
  renderListings();
  renderDetail();
}

placeBid.addEventListener("click", placeBidOnListing);

renderListings();
renderDetail();
