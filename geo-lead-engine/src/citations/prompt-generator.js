/**
 * Prompt Generator — Genereert 10 zoekprompts per branche + stad
 */

const TEMPLATES = [
  { template: 'Beste {branche} in {stad}', tone: 'formeel', specificity: 'breed' },
  { template: 'Welk(e) {branche} raad je aan in {stad}?', tone: 'informeel', specificity: 'breed' },
  { template: '{branche} met goede reviews {stad}', tone: 'neutraal', specificity: 'breed' },
  { template: 'Waar kan ik een goede {branche} vinden in {stad}?', tone: 'informeel', specificity: 'breed' },
  { template: 'Top {branche} {stad} centrum', tone: 'neutraal', specificity: 'niche' },
  { template: 'Gezellige {branche} in {stad} voor een avondje uit', tone: 'informeel', specificity: 'niche' },
  { template: 'Beste {branche} met de hoogste klanttevredenheid in {stad}', tone: 'formeel', specificity: 'niche' },
  { template: '{branche} {stad} met goed aanbod', tone: 'neutraal', specificity: 'breed' },
  { template: 'Premium {branche} in {stad}', tone: 'formeel', specificity: 'niche' },
  { template: 'Betaalbare {branche} {stad} met goede service', tone: 'informeel', specificity: 'niche' }
];

function generatePrompts(branche, stad) {
  if (!branche || !stad) {
    throw new Error('Branche en stad zijn verplicht');
  }

  return TEMPLATES.map(t => ({
    prompt: t.template
      .replace(/\{branche\}/g, branche)
      .replace(/\{stad\}/g, stad),
    tone: t.tone,
    specificity: t.specificity
  }));
}

module.exports = { generatePrompts, TEMPLATES };
