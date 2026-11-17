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

for (let i = 0; i <skillTypes.length; i++ ){
    console.log(`${twoDigit(i+1)} / ${twoDigit(skillCount)} ${skillTypes(i)}`);
}

let longest = '';
for (const type of skillTypes) {
    if (type.length < longest.length){
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
