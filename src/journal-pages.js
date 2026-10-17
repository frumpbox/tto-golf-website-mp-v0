import './main.js';
import './styles/homepage.css';
import './styles/championship.css';

// The new masthead is independent of the legacy page-specific renderers.
const masthead = document.querySelector('.masthead');
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('primary-menu');
const mobile = matchMedia('(max-width: 700px)');
function setMenu(open, returnFocus = false) {
  toggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  masthead.classList.toggle('menu-open', open);
  if (returnFocus) toggle.focus();
}
function syncMenu() { setMenu(false); toggle.hidden = !mobile.matches; }
masthead.classList.add('menu-enabled');
syncMenu();
mobile.addEventListener('change', syncMenu);
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => { if (!masthead.contains(event.target)) setMenu(false); });
masthead.addEventListener('focusout', () => requestAnimationFrame(() => {
  if (!masthead.contains(document.activeElement)) setMenu(false);
}));
