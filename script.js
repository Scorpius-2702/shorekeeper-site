console.log('script.js loaded');

const siteName = 'Shorekeeper';
const skillCount = 6;

const skillTypes = [
    'Normal Attack',
    'Resonance Skill',
    'Resonance Liberation',
    'Forte Circuit',
    'Intro Skill',
    'Outro Skill',
]

function twoDigit (n){
    if (n < 10) {
        return `0${n}`;
    }
    return `${n}`;
}

for (let i = 0; i < skillTypes.length; i++) {
    console.log(`${twoDigit(i + 1)} / ${twoDigit(skillCount)} ${skillTypes[i]}`);
}

let longest = '';
for (const type of skillTypes) {
    if (type.length > longest.length) {
        longest = type;
    }
}
console.log(`Longest card name: ${longest} (${longest.length} characters)`);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
if (reduceMotion) {
  console.log(`${siteName}: reduced motion is on`);
} else {
  console.log(`${siteName}: reduced motion is off`);
}

const cards = document.querySelectorAll ('.skill-card');
console.log(`Found ${cards.length} skill cards`);

for (let i = 0; i < cards.length; i++) {
    const num = document.createElement('span');
    num.className = 'card-num';
    num.textContent = twoDigit(i + 1);
    num.setAttribute('aria-hidden', 'true');
    cards[i].prepend(num);
}

const screens = document.querySelectorAll('.screen');
for (let i = 0; i < screens.length; i++) {
    const heading = screens[i].querySelector('h2');
    if (heading !== null) {
        const label = document.createElement('p');
        label.className = 'screen-num';
        label.textContent = `${twoDigit(i + 1)} / ${twoDigit(screens.length)}`;
        heading.before(label);
    }
}

for (const card of cards) {
    card.addEventListener('click', () => {
        const name = card.querySelector('.card-name').textContent
        console.log(`Clicked: ${name}`);
    });
}

const navLinks = document.querySelectorAll('nav a');

function updateCurrentLink() {
    const line = window.innerHeight / 3;
    let current = navLinks[0];
    for (const link of navLinks){
        const screen = document.querySelector(link.getAttribute('href'));
        if (screen.getBoundingClientRect().top <= line){
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

document.addEventListener('keydown', (event) => {
    console.log(`Key: ${event.key}`);
});