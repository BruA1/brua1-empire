"use strict";
// Only the public tagged or short-preview URLs from the published safe manifest are used.
// Playback never reads the clean MP3/WAV master object keys.
const list = document.getElementById("track-list");
const summary = document.getElementById("summary");
const player = document.getElementById("player");
const bar = document.getElementById("now-playing");
const nowTitle = document.getElementById("now-title");
const search = document.getElementById("search");
let tracks = [];
let currentId = null;

function make(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function updateSummary() {
  const unavailable = tracks.filter(item => item.state === "missing").length;
  summary.textContent = tracks.length + " original instrumentals · " +
    (tracks.length - unavailable) + " preview links available" +
    (unavailable ? " · " + unavailable + " unavailable" : "") +
    " · Tap Play to listen";
}

function updateButtons() {
  for (const item of tracks) {
    const row = document.getElementById("track-" + item.id);
    if (!row) continue;
    const status = row.querySelector(".details p");
    const button = row.querySelector("button");
    const selected = currentId === item.id;
    row.classList.toggle("current", selected);
    const playing = selected && !player.paused;
    if (item.state === "ready") {
      button.disabled = false;
      button.textContent = playing ? "Pause" : "Play";
      button.setAttribute("aria-label", (playing ? "Pause " : "Play ") + item.title + " preview");
      status.textContent = item.preview_type === "tagged" ? "Tagged preview ready" : "Short preview ready";
    } else {
      button.disabled = true;
      button.textContent = item.state === "checking" ? "Checking" : "Pending";
      status.textContent = item.state === "checking" ? "Checking correct audio…" : "Preview not yet available";
    }
  }
  updateSummary();
}

function play(item) {
  if (item.state !== "ready") return;
  if (currentId === item.id) {
    if (player.paused) {
      player.play().catch(() => { summary.textContent = "Tap Play in the player to start audio."; });
    } else player.pause();
  } else {
    player.pause();
    currentId = item.id;
    player.src = item.preview_url;
    nowTitle.textContent = item.title + " — BruA1";
    bar.hidden = false;
    player.load();
    player.play().catch(() => { summary.textContent = "Tap Play in the player to start audio."; });
  }
  updateButtons();
}

function render() {
  list.replaceChildren();
  const q = search.value.trim().toLocaleLowerCase();
  const filtered = tracks.filter(item => item.title.toLocaleLowerCase().includes(q));
  filtered.forEach(item => {
    const row = make("article", "track");
    row.setAttribute("role", "listitem");
    row.id = "track-" + item.id;
    row.append(make("span", "num", String(tracks.indexOf(item) + 1).padStart(2, "0")));
    const info = make("div", "details");
    info.append(make("h3", "", item.title), make("p", "", ""));
    row.append(info);
    const button = make("button", "play", "Play");
    button.type = "button";
    button.disabled = false;
    button.addEventListener("click", () => play(item));
    row.append(button);
    list.append(row);
  });
  if (!filtered.length) list.append(make("p", "", "No instrumentals matched your search."));
  list.setAttribute("aria-busy", "false");
  updateButtons();
}

// Mobile browsers may ignore automatic audio preloading. Let visitors initiate playback
// directly. If an actual audio request fails, disable only that track and show the failure.
player.addEventListener("playing", updateButtons);
player.addEventListener("pause", updateButtons);
player.addEventListener("ended", updateButtons);
player.addEventListener("error", () => {
  const current = tracks.find(item => item.id === currentId);
  if (current) { current.state = "missing"; updateButtons(); }
  summary.textContent = "That preview could not play. Its listing has been disabled.";
});
search.addEventListener("input", render);

(async () => {
  try {
    const response = await fetch("./data/instrumental-public-previews.json", { cache: "no-store" });
    if (!response.ok) throw Error("Catalog HTTP " + response.status);
    const data = await response.json();
    if (!Array.isArray(data.products) || data.products.length !== 39) throw Error("Unexpected catalog");
    tracks = data.products.filter(item => item && /^BRUA1-INS-\d{4}$/.test(item.id) &&
      typeof item.title === "string" && /^https:\/\//.test(item.preview_url))
      .map(item => ({ ...item, state: "ready" }));
    render();
  } catch (error) {
    console.error("BruA1 preview playlist unavailable", error);
    list.replaceChildren(make("p", "", "The playlist could not load. Please refresh the page."));
    summary.textContent = "Could not load instrumentals";
  }
})();