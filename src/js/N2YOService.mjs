const API_KEY = 'HE4J37-BEXPUH-JYRB3G-5UUW';
const BASE_URL = 'https://corsproxy.io/?url=https%3A%2F%2Fapi.n2yo.com%2Frest%2Fv1%2Fsatellite';

export async function getSatellitePositions(noradId) {
  const url = `${BASE_URL}%2Fpositions%2F${noradId}%2F43.826%2F-111.789%2F1432%2F1%2F%3FapiKey%3D${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function getAbove() {
  const url = `${BASE_URL}%2Fabove%2F43.826%2F-111.789%2F1432%2F70%2F10%2F%3FapiKey%3D${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}