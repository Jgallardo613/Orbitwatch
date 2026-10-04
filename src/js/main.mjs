import { getSatellitePositions } from './N2YOService.mjs';
import { getSpaceWeather } from './NOAAService.mjs';

let map = null;
let marker = null;

function initMap() {
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
}

function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return;
    results.innerHTML = `<li>Loading...</li>`;
    const data = await getSatellitePositions(query);
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
    } else {
      results.innerHTML = `<li>No data found.</li>`;
    }
  });
}

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

function updateClock() {
  const clock = document.getElementById('utc-clock');
  if (clock) {
    clock.textContent = new Date().toUTCString().slice(17, 25);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  initMap();
  initSearch();
  updateClock();
  setInterval(updateClock, 1000);

  const kIndex = await initSpaceWeather();
  initAlertFeed(kIndex);
});