const API_KEY = 'HE4J37-BEXPUH-JYRB3G-5UUW';
const BASE_URL = 'https://corsproxy.io/?url=https://api.n2yo.com/rest/v1/satellite';

export async function getSatellitePositions(noradId) {
  const url = `${BASE_URL}/positions/${noradId}/43.826/-111.789/1432/1/?apiKey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function getAbove() {
  const url = `${BASE_URL}/above/43.826/-111.789/1432/70/10/?apiKey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}