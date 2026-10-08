const API_KEY = 'HE4J37-BEXPUH-JYRB3G-5UUW';
const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

export async function getSatellitePositions(noradId) {
  const target = `${BASE_URL}/positions/${noradId}/43.826/-111.789/1432/1/?apiKey=${API_KEY}`;
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
  const response = await fetch(url);
  const json = await response.json();
  return JSON.parse(json.contents);
}

export async function getAbove() {
  const target = `${BASE_URL}/above/43.826/-111.789/1432/70/10/?apiKey=${API_KEY}`;
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`;
  const response = await fetch(url);
  const json = await response.json();
  return JSON.parse(json.contents);
}