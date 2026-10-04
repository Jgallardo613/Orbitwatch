export async function getSpaceWeather() {
  const url = 'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json';
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function getSolarFlares() {
  const url = 'https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json';
  const response = await fetch(url);
  const data = await response.json();
  return data;
}