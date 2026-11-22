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
  document.querySelector('.skill-type').textContent = skill.type;
  document.querySelector('.skill-name').textContent = skill.name;
  document.querySelector('.skill-short').textContent = skill.short;
  document.querySelector('.skill-what').textContent = skill.what;
 
  const related = document.querySelector('.skill-related');
  related.textContent = '';
  for (const text of skill.related) {
    const item = document.createElement('li');
    item.textContent = text;
    related.append(item);
  }
}
 
function openSkill(index) {
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.toggle('is-active', i === index);
  }
  skillsScreen.classList.add('is-open');
  showSkill(skillData[index]);
}
 
async function loadSkills() {
  const response = await fetch('skills.json');
  skillData = await response.json();
  for (let i = 0; i < skillData.length; i++) {
    const card = buildCard(skillData[i], i);
    cardList.append(card);
    cards.push(card);
  }
  console.log(`Loaded ${skillData.length} skills from skills.json`);
}
 
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