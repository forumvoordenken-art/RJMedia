/**
 * System Prompt — Template dat JSON output forceert van AI platforms
 */

const SYSTEM_PROMPT = `Je bent een hulpmiddel dat zoekvragen beantwoordt. Beantwoord de vraag van de gebruiker.
Antwoord UITSLUITEND in dit JSON format, geen tekst eromheen:
{"recommendations": [{"name": "Bedrijfsnaam", "reason": "Korte reden", "position": 1}], "total_results": 5}
Noem maximaal 10 bedrijven. Geef elk een position (1 = beste aanbeveling).`;

function getSystemPrompt() {
  return SYSTEM_PROMPT;
}

module.exports = { getSystemPrompt, SYSTEM_PROMPT };
