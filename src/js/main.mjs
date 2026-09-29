import { router } from './destination.mjs';
function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) return;
    results.innerHTML = `<li>Searching for: ${query}</li>`;
  });
}

document.addEventListener('DOMContentLoaded', initSearch);