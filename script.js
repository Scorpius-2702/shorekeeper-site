function twoDigits(n) {
  if (n < 10) {
    return `0${n}`;
  }
  return `${n}`;
}
 
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
 
const screens = document.querySelectorAll('.screen');
for (let i = 0; i < screens.length; i++) {
  const heading = screens[i].querySelector('h2');
  if (heading !== null) {
    const label = document.createElement('p');
    label.className = 'screen-num';
    label.textContent = `${twoDigits(i + 1)} / ${twoDigits(screens.length)}`;
    heading.before(label);
  }
}
 
 
const navLinks = document.querySelectorAll('nav a');
 
function updateCurrentLink() {
  const line = window.innerHeight / 3;
  let current = navLinks[0];
  for (const link of navLinks) {
    const screen = document.querySelector(link.getAttribute('href'));
    if (screen.getBoundingClientRect().top <= line) {
      current = link;
    }
  }
  for (const link of navLinks) {
    if (link === current) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }
}
 
updateCurrentLink();
window.addEventListener('scroll', updateCurrentLink);
 
 
const skillsScreen = document.querySelector('#skills');
const cardList = document.querySelector('.skill-cards');
const cards = [];
 
let skillData = [];
 
function buildCard(skill, index) {
  const card = document.createElement('li');
  card.className = 'skill-card';
 
  const num = document.createElement('span');
  num.className = 'card-num';
  num.textContent = twoDigits(index + 1);
  num.setAttribute('aria-hidden', 'true');
 
  const button = document.createElement('button');
  button.className = 'card-button';
  button.type = 'button';
 
  const image = document.createElement('img');
  image.src = skill.image;
  image.alt = '';
 
  const name = document.createElement('span');
  name.className = 'card-name';
  name.textContent = skill.type;
 
  button.append(image, name);
  card.append(num, button);
  card.addEventListener('click', () => {
    openSkill(index);
  });
  return card;
}
 
function showSkill(skill) {
  hideTip();
  document.querySelector('.skill-type').textContent = skill.type;
  document.querySelector('.skill-name').textContent = skill.name;
  buildMoves(skill);
  showMove(skill, 0);
  buildWhat(skill.what);
 
  const related = document.querySelector('.skill-related');
  related.textContent = '';
  for (const text of skill.related) {
    const item = document.createElement('li');
    buildRichText(item, text);
    related.append(item);
  }
 
  document.querySelector('.detail-what').hidden = skill.what.length === 0;
  document.querySelector('.detail-related').hidden = skill.related.length === 0;
}



 
function openSkill(index) {
  const wasOpen = skillsScreen.classList.contains('is-open');
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.toggle('is-active', i === index);
    const button = cards[i].querySelector('.card-button');
    if (i === index) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  }
  skillsScreen.classList.add('is-open');
  showSkill(skillData[index]);
  if (wasOpen === false) {
    skillsScreen.scrollIntoView();
  }
}


function closeSkill() {
  const activeCard = document.querySelector('.skill-card.is-active');
  if (activeCard === null) {
    return;
  }
  hideTip();
  activeCard.classList.remove('is-active');
  const button = activeCard.querySelector('.card-button');
  button.removeAttribute('aria-current');
  skillsScreen.classList.remove('is-open');
  skillVideo.pause();
  skillsScreen.scrollIntoView();
  button.focus();
}

 
document.querySelector('.skill-close').addEventListener('click', closeSkill);

const skillVideo = document.querySelector('.skill-video');
const movesBox = document.querySelector('.skill-moves');
const videoToggle = document.querySelector('.video-toggle');
 
let videoPaused = reduceMotion;
 
function playVideo() {
  if (videoPaused) {
    return;
  }
  skillVideo.play().catch(() => {});
}

function buildMoves(skill) {
  movesBox.textContent = '';
  if (skill.moves.length < 2) {
    return;
  }
  for (let i = 0; i < skill.moves.length; i++) {
    const button = document.createElement('button');
    button.className = 'move-button';
    button.type = 'button';
    button.textContent = skill.moves[i].name;
    button.addEventListener('click', () => {
      showMove(skill, i);
    });
    movesBox.append(button);
  }
}
function showMove(skill, moveIndex) {
  const move = skill.moves[moveIndex];
  const short = document.querySelector('.skill-short');
  if (move.short !== '') {
    short.textContent = move.short;
  } else {
    short.textContent = skill.short;
  }

  const buttons = movesBox.querySelectorAll('.move-button');
  for (let i = 0; i < buttons.length; i++) {
    if (i === moveIndex) {
      buttons[i].setAttribute('aria-current', 'true');
    } else {
      buttons[i].removeAttribute('aria-current');
    }
  }
 
  if (move.video !== '') {
    skillVideo.poster = move.poster;
    skillVideo.src = move.video;
    videoToggle.hidden = false;
    playVideo();
  } else {
    skillVideo.removeAttribute('poster');
    skillVideo.removeAttribute('src');
    skillVideo.load();
    videoToggle.hidden = true;
  }
}
function updateToggle() {
  videoToggle.classList.toggle('is-paused', videoPaused);
  const text = videoToggle.querySelector('.video-toggle-text');
  if (videoPaused) {
    text.textContent = 'Play';
  } else {
    text.textContent = 'Pause';
  }
}

videoToggle.addEventListener('click', () => {
  if (videoPaused) {
    videoPaused = false;
    playVideo();
  } else {
    videoPaused = true;
    skillVideo.pause();
  }
  updateToggle();
});

updateToggle();

async function loadSkills() {
  const response = await fetch('skills.json');
  skillData = await response.json();
  for (let i = 0; i < skillData.length; i++) {
    const card = buildCard(skillData[i], i);
    cardList.append(card);
    cards.push(card);
  }
  console.log(`Loaded ${skillData.length} skills from skills.json`);

  const termResponse = await fetch('terms.json');
  termData = await termResponse.json();
  console.log('Terms in terms.json:', Object.keys(termData));
}


let termData = {};
 
const tip = document.querySelector('#term-tip');
const tipTitle = document.querySelector('.term-tip-title');
const tipText = document.querySelector('.term-tip-text');
 

let currentTerm = null;
let hideTimer = null;
 

function buildRichText(element, text) {
  const pieces = text.split(/(\*[^*]+\*|\[[^\]]+\])/);
  for (const piece of pieces) {
    if (piece.startsWith('*')) {
      const mark = document.createElement('b');
      mark.className = 'hl';
      mark.textContent = piece.slice(1, -1);
      element.append(mark);
    } else if (piece.startsWith('[')) {
      element.append(buildTerm(piece.slice(1, -1)));
    } else {
      element.append(piece);
    }
  }
}
 

function buildTerm(name) {
  const term = document.createElement('button');
  term.type = 'button';
  term.className = 'term';
  term.textContent = name;
  term.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      showTip(term);
    }
  });
  term.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') {
      hideTipSoon();
    }
  });
  term.addEventListener('click', () => showTip(term));
  term.addEventListener('focus', () => showTip(term));
  term.addEventListener('blur', hideTip);
  return term;
}
 
function buildWhat(blocks) {
  const what = document.querySelector('.skill-what');
  what.textContent = '';
  for (const block of blocks) {
    if (block.title !== '') {
      const title = document.createElement('h5');
      title.className = 'what-title';
      title.textContent = block.title;
      what.append(title);
    }
    for (const part of block.body) {
      if (Array.isArray(part)) {
        const list = document.createElement('ul');
        for (const line of part) {
          const item = document.createElement('li');
          buildRichText(item, line);
          list.append(item);
        }
        what.append(list);
      } else {
        const paragraph = document.createElement('p');
        buildRichText(paragraph, part);
        what.append(paragraph);
      }
    }
  }
}
 
function showTip(term) {
  hideTip();
  const text = termData[term.textContent];
  if (text === undefined) {
    console.warn(`terms.json has no entry for: ${term.textContent}`);
    return;
  }
  tipTitle.textContent = term.textContent;
  tipText.textContent = '';
  buildRichText(tipText, text);
  placeTip(term);
  tip.classList.add('is-visible');
  term.setAttribute('aria-describedby', 'term-tip');
  currentTerm = term;
}
 
function hideTip() {
  clearTimeout(hideTimer);
  tip.classList.remove('is-visible');
  if (currentTerm !== null) {
    currentTerm.removeAttribute('aria-describedby');
    currentTerm = null;
  }
}
 
function hideTipSoon() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideTip, 150);
}
 
function placeTip(term) {
  const box = term.getBoundingClientRect();
  const gap = 8;
  const edge = 16;
  let left = box.left;
  let top = box.bottom + gap;
  if (left + tip.offsetWidth > window.innerWidth - edge) {
    left = window.innerWidth - edge - tip.offsetWidth;
  }
  if (top + tip.offsetHeight > window.innerHeight - edge) {
    top = box.top - gap - tip.offsetHeight;
  }
  tip.style.left = `${left + window.scrollX}px`;
  tip.style.top = `${top + window.scrollY}px`;
}
 
tip.addEventListener('pointerenter', () => {
  clearTimeout(hideTimer);
});
tip.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'mouse') {
    hideTipSoon();
  }
});
 
document.addEventListener('pointerdown', (event) => {
  if (event.target.closest('.term, .term-tip') === null) {
    hideTip();
  }
});
 
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }
  if (currentTerm !== null) {
    hideTip();
  } else if (skillsScreen.classList.contains('is-open')) {
    closeSkill();
  } else {
    closeSector();
  }
});




loadSkills();


const carousel = document.querySelector('.gallery-carousel');
const track = document.querySelector('.gallery-track');
const slides = document.querySelectorAll('.gallery-slide');
const galleryRows = document.querySelectorAll('.gallery-list li');
const prevButton = document.querySelector('.carousel-prev');
const nextButton = document.querySelector('.carousel-next');
 
let currentSlide = 0;
let autoTimer = null;
let isHovering = false;
 
function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(${-100 * currentSlide}%)`;
  for (let i = 0; i < galleryRows.length; i++) {
    galleryRows[i].classList.toggle('is-current', i === currentSlide);
  }
}

prevButton.addEventListener('click', () => {
  showSlide(currentSlide - 1);
  startAuto();
});
 
nextButton.addEventListener('click', () => {
  showSlide(currentSlide + 1);
  startAuto();
});
 
for (let i = 0; i < galleryRows.length; i++) {
  galleryRows[i].addEventListener('click', () => {
    showSlide(i);
    startAuto();
  });
}

function startAuto() {
  stopAuto();
  if (reduceMotion || isHovering) {
    return;
  }
  autoTimer = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}
 
function stopAuto() {
  clearInterval(autoTimer);
}
 
carousel.addEventListener('mouseenter', () => {
  isHovering = true;
  stopAuto();
});
 
carousel.addEventListener('mouseleave', () => {
  isHovering = false;
  startAuto();
});

let swipeStartX = null;
 
carousel.addEventListener('pointerdown', (event) => {
  swipeStartX = event.clientX;
});
 
carousel.addEventListener('pointerup', (event) => {
  if (swipeStartX === null) {
    return;
  }
  const distance = event.clientX - swipeStartX;
  if (distance < -50) {
    showSlide(currentSlide + 1);
    startAuto();
  } else if (distance > 50) {
    showSlide(currentSlide - 1);
    startAuto();
  }
  swipeStartX = null;
});

showSlide(0);
startAuto();

const bsBars = document.querySelector('.bs-bars');
const bars = [];
 
let sectorData = [];
 
function buildBar(sector, index) {
  const bar = document.createElement('button');
  bar.className = 'bar';
  bar.type = 'button';
 
  const art = document.createElement('img');
  art.className = 'bar-art';
  art.src = sector.art;
  art.alt = '';
 
  const inner = document.createElement('span');
  inner.className = 'bar-in';
 
  const num = document.createElement('span');
  num.className = 'bar-num';
  num.textContent = twoDigits(index + 1);
  num.setAttribute('aria-hidden', 'true');
 
  const label = document.createElement('span');
  label.className = 'bar-label';
  label.textContent = sector.label;
 
  
  inner.append(num, label);
  bar.append(art, inner);
  bar.addEventListener('click', () => {
    openSector(index);
  });
 
  return bar;
}

async function loadSectors() {
  const response = await fetch('blackshores.json');
  sectorData = await response.json();
  for (let i = 0; i < sectorData.length; i++) {
    const bar = buildBar(sectorData[i], i);
    bsBars.append(bar);
    bars.push(bar);
  }
  console.log(`Loaded ${sectorData.length} sectors from blackshores.json`);
}
 
loadSectors();

const bsSection = document.querySelector('.black-shores');
const bsStage = document.querySelector('.bs-stage');
 
let currentSector = -1;

const bsWorld = document.querySelector('.bs-world');
 
const backSlots = [
  { x: '-29rem', y: '-28%', z: '-6rem', rx: '14deg', ry: '26deg', rz: '-6deg' },
  { x: '29rem', y: '30%', z: '-8rem', rx: '-10deg', ry: '-24deg', rz: '6deg' },
  { x: '28rem', y: '-30%', z: '-12rem', rx: '12deg', ry: '-20deg', rz: '4deg' },
  { x: '-28rem', y: '30%', z: '-10rem', rx: '-12deg', ry: '22deg', rz: '-4deg' },
  { x: '0rem', y: '36%', z: '-14rem', rx: '-16deg', ry: '6deg', rz: '-3deg' },
  { x: '0rem', y: '-38%', z: '-16rem', rx: '18deg', ry: '-8deg', rz: '3deg' }
];
 
function frontSlot(k, count) {
  const x = (k - (count - 1) / 2) * 19;
  return { x: `${x}rem`, y: '0rem', z: '6rem', rx: '8deg', ry: '-10deg', rz: '-2deg' };
}
 
function placeTape(tape, slot) {
  tape.style.setProperty('--x', slot.x);
  tape.style.setProperty('--y', slot.y);
  tape.style.setProperty('--z', slot.z);
  tape.style.setProperty('--rx', slot.rx);
  tape.style.setProperty('--ry', slot.ry);
  tape.style.setProperty('--rz', slot.rz);
}

 
function buildTape(entry, sector, index) {
  const tape = document.createElement('button');
  tape.className = 'tape';
  tape.type = 'button';
  tape.classList.add(entry.look);
  if (entry.featured === true) {
    tape.classList.add('featured');
  }
  tape.setAttribute('aria-label', `${entry.name}, ${entry.meta}`);
 
  const label = document.createElement('span');
  label.className = 'tape-label';
 
  const code = document.createElement('span');
  code.className = 'tape-code';
  code.textContent = `BLACK SHORES · ${sector.code}-${twoDigits(index + 1)}`;
 
  const name = document.createElement('span');
  name.className = 'tape-name';
  name.textContent = entry.name;
 
  const head = document.createElement('span');
  head.className = 'tape-head';
  const side = document.createElement('span');
  side.className = 'tape-side';
  side.textContent = 'A';
  head.append(side, code);
 
  label.append(head, name);

 
  const tapeWindow = document.createElement('span');
  tapeWindow.className = 'tape-window';
  for (let i = 0; i < 2; i++) {
    const reel = document.createElement('span');
    reel.className = 'tape-reel';
    tapeWindow.append(reel);
  }
 
  const front = document.createElement('span');
  front.className = 'tape-face tape-front';
  front.append(label, tapeWindow);
  tape.append(front);

  for (const side of ['back', 'top', 'bottom', 'left', 'right']) {
    const face = document.createElement('span');
    face.className = `tape-face tape-${side}`;
    tape.append(face);
  }

  return tape;
}

function fillWorld(sector) {
  bsWorld.textContent = '';
  if (sector.entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'bs-empty';
    empty.textContent = 'No records yet.';
    bsWorld.append(empty);
  }
 
  let frontCount = 0;
  for (const entry of sector.entries) {
    if (entry.featured === true) {
      frontCount++;
    }
  }
  const allFront = frontCount === 0;
  if (allFront) {
    frontCount = sector.entries.length;
  }
 
  let f = 0;
  let b = 0;
  for (let i = 0; i < sector.entries.length; i++) {
    const entry = sector.entries[i];
    const tape = buildTape(entry, sector, i);
    if (entry.featured === true || allFront) {
      placeTape(tape, frontSlot(f, frontCount));
      f++;
    } else {
      placeTape(tape, backSlots[b % backSlots.length]);
      b++;
    }
    bsWorld.append(tape);
  }
}

const tilt = {x : 0, y : 0, targetX: 0, targetY: 0};
let driftFrame = 0;
bsSection.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse') {
    return;
  }
  const box = bsSection.getBoundingClientRect();
  const px = (event.clientX - box.left) / box.width - 0.5;
  const py = (event.clientY - box.top) / box.height - 0.5;
  tilt.targetX = py * 6;
  tilt.targetY = -px * 8;
});
 
bsSection.addEventListener('pointerleave', () => {
  tilt.targetX = 0;
  tilt.targetY = 0;
});
 
function drift(time) {
  const seconds = time / 1000;
  const tapes = bsWorld.querySelectorAll('.tape');
  for (let i = 0; i < tapes.length; i++) {
    const dx = Math.cos(seconds * 0.6 + i * 2.3) * 4;
    const dy = Math.sin(seconds * 0.9 + i * 1.7) * 8;
    tapes[i].style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`;
  }
  tilt.x += (tilt.targetX - tilt.x) * 0.08;
  tilt.y += (tilt.targetY - tilt.y) * 0.08;
  bsStage.style.setProperty('--tilt-x', `${tilt.x.toFixed(3)}deg`);
  bsStage.style.setProperty('--tilt-y', `${tilt.y.toFixed(3)}deg`);
  driftFrame = requestAnimationFrame(drift);
}
 
function startDrift() {
  if (reduceMotion || driftFrame !== 0) {
    return;
  }
  driftFrame = requestAnimationFrame(drift);
}
 
function stopDrift() {
  cancelAnimationFrame(driftFrame);
  driftFrame = 0;
  tilt.x = 0;
  tilt.y = 0;
  tilt.targetX = 0;
  tilt.targetY = 0;
  bsStage.style.removeProperty('--tilt-x');
  bsStage.style.removeProperty('--tilt-y');
}


function openSector(index) {
  const sector = sectorData[index];
  currentSector = index;
  for (let i = 0; i < bars.length; i++) {
    if (i === index) {
      bars[i].setAttribute('aria-current', 'true');
    } else {
      bars[i].removeAttribute('aria-current');
    }
  }
  fillWorld(sector);
  startDrift();
  bsSection.classList.add('is-open');
  bsSection.scrollIntoView();
  const firstTape = bsStage.querySelector('.tape');
  if (firstTape !== null) {
    firstTape.focus({ preventScroll: true });
  }
}
 
function closeSector() {
  if (currentSector === -1) {
    return;
  }
  const bar = bars[currentSector];
  bar.removeAttribute('aria-current');
  bsSection.classList.remove('is-open');
  bsWorld.textContent = '';
  stopDrift();
  currentSector = -1;
  bsSection.scrollIntoView();
  bar.focus();
}
 
document.querySelector('.bs-close').addEventListener('click', closeSector);
