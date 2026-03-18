# RJ Media — GEO Lead Engine

Backend voor de RJ Media GEO Lead Engine: een self-service platform waar MKB-bedrijven hun website-URL invoeren, een GEO-analyse krijgen (hoe vindbaar zijn ze voor AI-zoekmachines zoals ChatGPT, Gemini, Claude en Perplexity), en vervolgens als lead worden doorverkocht aan partnerbureaus. Het systeem draait op n8n workflow automation met een Node.js scoring engine.

## Vereisten

- **Node.js** 18+
- **n8n** Cloud of self-hosted instance
- **API keys** voor:
  - OpenAI (gpt-4o-mini)
  - Anthropic (Claude Haiku)
  - Google Gemini
  - Perplexity (Sonar)

## Setup

```bash
# 1. Clone de repository
git clone <repo-url>
cd geo-lead-engine

# 2. Installeer dependencies
npm install

# 3. Configureer environment variables
cp .env.example .env
# Vul je API keys in in .env

# 4. Importeer de n8n workflow
# Open n8n → Workflows → Import → selecteer n8n/workflow-main.json

# 5. Activeer de workflow in n8n
```

## Tests draaien

```bash
npm test
```

## Projectstructuur

```
geo-lead-engine/
├── n8n/
│   └── workflow-main.json          # Importeerbare n8n workflow
├── src/
│   ├── parsers/                    # HTML parsing, platform detectie, tech checks
│   ├── citations/                  # Prompt generatie, AI response parsing
│   ├── scoring/                    # GEO score berekening (gewogen model)
│   ├── routing/                    # Lead routing logica
│   └── report/                     # Rapport generatie
├── templates/
│   └── report.html                 # HTML rapport template (e-mail compatible)
└── docs/
    ├── ARCHITECTURE.md             # Workflow architectuur
    ├── API-ENDPOINTS.md            # Webhook endpoints en payloads
    └── SCORING-MODEL.md            # Uitleg scoring model
```

## Architectuur

Zie [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) voor een volledig overzicht van de workflow en dataflow.

## Scoring Model

De GEO-score is opgebouwd uit vier categorieën:

| Categorie     | Gewicht | Beschrijving                              |
|--------------|---------|-------------------------------------------|
| AI Citations  | 40%     | Hoe vaak wordt het bedrijf genoemd door AI |
| Technisch     | 30%     | Schema.org, robots.txt, sitemap, HTTPS etc |
| Content       | 20%     | Meta tags, headings, FAQ, Open Graph       |
| Performance   | 10%     | Google PageSpeed mobile score              |

Zie [docs/SCORING-MODEL.md](docs/SCORING-MODEL.md) voor details.

## API Endpoints

Zie [docs/API-ENDPOINTS.md](docs/API-ENDPOINTS.md) voor webhook payloads en externe API documentatie.
