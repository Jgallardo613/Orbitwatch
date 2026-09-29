export function router() {
  const hash = window.location.hash || '#dashboard';
  const sections = document.querySelectorAll('section');

  sections.forEach((section) => {
    section.style.display = 'none';
  });

  const target = document.querySelector(hash);
  if (target) {
    target.style.display = 'block';
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);