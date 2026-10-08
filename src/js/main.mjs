import { getSatellitePositions } from './N2YOService.mjs';
import { getSpaceWeather } from './NOAAService.mjs';

let map = null;
let marker = null;

// -- localStorage helpers --
function getWatchlist() {
  return JSON.parse(localStorage.getItem('orbitwatch-watchlist') || '[]');
}

function saveWatchlist(list) {
  localStorage.setItem('orbitwatch-watchlist', JSON.stringify(list));
}

function addToWatchlist(id, name) {
  const list = getWatchlist();
  // avoid duplicates
  if (list.find(item => item.id === id)) return;
  list.push({ id, name, added: new Date().toISOString() });
  saveWatchlist(list);
  renderWatchlist();
}

function removeFromWatchlist(id) {
  const list = getWatchlist().filter(item => item.id !== id);
  saveWatchlist(list);
  renderWatchlist();
}

function renderWatchlist() {
  const ul = document.getElementById('watchlist-items');
  const list = getWatchlist();
  if (list.length === 0) {
    ul.innerHTML = '<li class="empty-msg">No satellites saved yet.</li>';
    return;
  }
  ul.innerHTML = list.map(item => `
    <li class="watchlist-item">
      <span class="watch-name">${item.name} (${item.id})</span>
      <span class="watch-added">Added: ${new Date(item.added).toLocaleDateString()}</span>
      <button class="watch-track-btn" data-id="${item.id}">Track</button>
      <button class="watch-remove-btn" data-id="${item.id}">Remove</button>
    </li>
  `).join('');

  ul.querySelectorAll('.watch-track-btn').forEach(btn => {
    btn.addEventListener('click', () => trackSatellite(btn.dataset.id));
  });
  ul.querySelectorAll('.watch-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromWatchlist(btn.dataset.id));
  });
}

// -- Map --
function initMap() {
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
}

// -- Track a satellite by NORAD ID --
async function trackSatellite(noradId) {
  const results = document.getElementById('search-results');
  results.innerHTML = `<li>Loading...</li>`;
  const data = await getSatellitePositions(noradId);
  if (data && data.positions) {
    const pos = data.positions[0];
    results.innerHTML = `
      <li><strong>${data.info.satname}</strong></li>
      <li>Lat: ${pos.satlatitude}</li>
      <li>Lng: ${pos.satlongitude}</li>
      <li>Alt: ${pos.sataltitude} km</li>
    `;
    if (marker) marker.remove();
    marker = L.marker([pos.satlatitude, pos.satlongitude])
      .addTo(map)
      .bindPopup(`<b>${data.info.satname}</b><br>Alt: ${pos.sataltitude} km`)
      .openPopup();
    map.setView([pos.satlatitude, pos.satlongitude], 3);
    document.getElementById('world-map').scrollIntoView({ behavior: 'smooth' });
  } else {
    results.innerHTML = `<li>No data found.</li>`;
  }
}

// -- Search --
function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return;
    const results = document.getElementById('search-results');
    results.innerHTML = `<li>Loading...</li>`;
    const data = await getSatellitePositions(query);
    if (data && data.positions) {
      const pos = data.positions[0];
      results.innerHTML = `
        <li><strong>${data.info.satname}</strong></li>
        <li>Lat: ${pos.satlatitude}</li>
        <li>Lng: ${pos.satlongitude}</li>
        <li>Alt: ${pos.sataltitude} km</li>
        <li><button id="add-watch-btn">+ Add to Watchlist</button></li>
      `;
      if (marker) marker.remove();
      marker = L.marker([pos.satlatitude, pos.satlongitude])
        .addTo(map)
        .bindPopup(`<b>${data.info.satname}</b><br>Alt: ${pos.sataltitude} km`)
        .openPopup();
      map.setView([pos.satlatitude, pos.satlongitude], 3);

      document.getElementById('add-watch-btn').addEventListener('click', () => {
        addToWatchlist(query, data.info.satname);
      });
    } else {
      results.innerHTML = `<li>No data found.</li>`;
    }
  });
}

// -- Space Weather --
async function initSpaceWeather() {
  const weatherDiv = document.getElementById('weather-data');
  try {
    const data = await getSpaceWeather();
    const latest = data[data.length - 1];
    const kIndex = latest.kp_index;
    const timeTag = latest.time_tag;
    let status = 'Quiet';
    let color = '#4caf50';
    if (kIndex >= 5) { status = 'Storm'; color = '#f44336'; }
    else if (kIndex >= 4) { status = 'Active'; color = '#ff9800'; }
    else if (kIndex >= 3) { status = 'Unsettled'; color = '#ffeb3b'; }

    weatherDiv.innerHTML = `
      <p>Planetary K-Index: <strong style="color:${color}">${kIndex} (${status})</strong></p>
      <p style="margin-top:0.5rem;font-size:0.85rem;color:#7a9bb5;">Updated: ${timeTag}</p>
    `;
    return kIndex;
  } catch (e) {
    weatherDiv.innerHTML = `<p>Unable to load space weather data.</p>`;
    return 0;
  }
}

// -- Alert Feed --
function initAlertFeed(kIndex) {
  const alertList = document.getElementById('alert-list');
  const alerts = [];
  if (kIndex >= 5) alerts.push('⚠️ Geomagnetic Storm detected — K-Index ' + kIndex);
  else if (kIndex >= 4) alerts.push('⚠️ Active geomagnetic conditions — K-Index ' + kIndex);
  if (alerts.length === 0) {
    alertList.innerHTML = '<li>No active alerts.</li>';
  } else {
    alertList.innerHTML = alerts.map(a => `<li>${a}</li>`).join('');
  }
}

// -- Clock --
function updateClock() {
  const clock = document.getElementById('utc-clock');
  if (clock) {
    clock.textContent = new Date().toUTCString().slice(17, 25);
  }
}

// -- Init --
document.addEventListener('DOMContentLoaded', async () => {
  initMap();
  initSearch();
  renderWatchlist();
  updateClock();
  setInterval(updateClock, 1000);

  const kIndex = await initSpaceWeather();
  initAlertFeed(kIndex);
});