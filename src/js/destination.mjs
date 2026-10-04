export function router() {
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    section.style.display = 'block';
  });
}

window.addEventListener('load', router);