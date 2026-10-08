const API_KEY = import.meta.env.VITE_N2YO_API_KEY;
const BASE_URL = '/api/n2yo/rest/v1/satellite';

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