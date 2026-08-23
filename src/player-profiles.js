import { playersById } from './data/player-data.js';

const profile = document.getElementById('player-profile');
const cards = [...document.querySelectorAll('.member-card-premium[data-player-id]')];

const fieldGroups = [
  { title: 'Personal Information', fields: [['Full Name', 'fullName'], ['Date of Birth', 'dateOfBirth'], ['Height', 'height'], ['Spouse', 'spouse']] },
  { title: 'Career', fields: [['Home Club', 'homeClub'], ['Lowest WHS Index', 'lowestWhsIndex'], ['Best Gross Score', 'bestGrossScore'], ['TTO Debut', 'ttoDebut'], ['Canda Cup Debut', 'candaCupDebut']] },
  { title: 'Best Results', fields: [['TTO', 'bestResults.tto'], ['Canda Cup', 'bestResults.candaCup']] }
];

let activePlayerId = null;

function valueAtPath(object, path) {
  return path.split('.').reduce((value, key) => value?.[key], object);
}

function createField(label, value) {
  const row = document.createElement('div');
  row.className = 'profile-field';
  const term = document.createElement('dt');
  term.textContent = label;
  const detail = document.createElement('dd');
  detail.textContent = value || 'TBC';
  if (!value) detail.className = 'profile-field-empty';
  row.append(term, detail);
  return row;
}

function createDetails(player) {
  const details = document.createElement('aside');
  details.className = 'profile-details';
  details.setAttribute('aria-label', `${player.displayName} profile details`);
  fieldGroups.forEach((group) => {
    const section = document.createElement('section');
    section.className = 'profile-details-section';
    const heading = document.createElement('h4');
    heading.textContent = group.title;
    const list = document.createElement('dl');
    group.fields.forEach(([label, path]) => list.append(createField(label, valueAtPath(player, path))));
    section.append(heading, list);
    details.append(section);
  });
  return details;
}

function renderPlayer(player) {
  profile.replaceChildren();
  const header = document.createElement('header');
  header.className = 'profile-expanded-header';
  const headingGroup = document.createElement('div');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'profile-eyebrow';
  eyebrow.textContent = 'Player profile';
  const name = document.createElement('h2');
  name.textContent = player.displayName;
  headingGroup.append(eyebrow, name);
  const close = document.createElement('button');
  close.className = 'profile-close';
  close.type = 'button';
  close.setAttribute('aria-label', `Close ${player.displayName} profile`);
  close.textContent = 'Close';
  close.addEventListener('click', () => closeProfile(true));
  header.append(headingGroup, close);

  const layout = document.createElement('div');
  layout.className = 'profile-expanded-layout';
  const background = document.createElement('section');
  background.className = 'profile-background';
  const backgroundHeading = document.createElement('h3');
  backgroundHeading.textContent = 'Background';
  background.append(backgroundHeading);
  player.background.forEach((paragraph) => {
    const text = document.createElement('p');
    text.textContent = paragraph;
    background.append(text);
  });
  layout.append(background, createDetails(player));
  profile.append(header, layout);
}

function updateUrl(playerId, replaceHistory) {
  const url = new URL(window.location.href);
  if (playerId) url.searchParams.set('player', playerId);
  else url.searchParams.delete('player');
  window.history[replaceHistory ? 'replaceState' : 'pushState']({}, '', url);
}

function updateCards(playerId) {
  cards.forEach((card) => {
    const selected = card.dataset.playerId === playerId;
    card.classList.toggle('is-active', selected);
    card.setAttribute('aria-expanded', String(selected));
  });
}

function openProfile(playerId, { updateHistory = true, scroll = false } = {}) {
  const player = playersById[playerId];
  if (!player) return false;
  activePlayerId = playerId;
  renderPlayer(player);
  updateCards(playerId);
  profile.hidden = false;
  if (updateHistory) updateUrl(playerId, false);
  if (scroll) requestAnimationFrame(() => profile.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  return true;
}

function closeProfile(updateHistory = true) {
  activePlayerId = null;
  updateCards(null);
  profile.hidden = true;
  profile.replaceChildren();
  if (updateHistory) updateUrl(null, false);
}

function toggleCard(card) {
  if (activePlayerId === card.dataset.playerId) closeProfile(true);
  else openProfile(card.dataset.playerId, { scroll: true });
}

cards.forEach((card) => {
  card.addEventListener('click', () => toggleCard(card));
  card.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    toggleCard(card);
  });
});

window.addEventListener('popstate', () => {
  const playerId = new URLSearchParams(window.location.search).get('player');
  if (!openProfile(playerId, { updateHistory: false })) closeProfile(false);
});

const deepLinkedPlayerId = new URLSearchParams(window.location.search).get('player');
if (deepLinkedPlayerId && openProfile(deepLinkedPlayerId, { updateHistory: false, scroll: true })) {
  updateUrl(deepLinkedPlayerId, true);
}
