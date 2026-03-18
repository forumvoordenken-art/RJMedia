# GEO Lead Engine — Architectuur

## Overzicht

De GEO Lead Engine is een backend systeem dat de AI-vindbaarheid van MKB-websites analyseert. Het draait op n8n (workflow automation) met een Node.js scoring engine.

## Flow

```
[Frontend Form] → POST /geo-analyse → [n8n Webhook]
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
              Branch 1:               Branch 2:               Branch 3:
           Website Analyse          Performance            AI Citations
           (gratis, ~5s)          (gratis, ~15-25s)       (betaald, ~30-60s)
                    │                       │                       │
                    └───────────────────────┼───────────────────────┘
                                            ▼
                                    [Merge Resultaten]
                                            │
                                    [Score Berekening]
                                            │
                                    [Teaser Response]
                                            │
                              [Respond to Webhook → Frontend]
```

## Branch 1: Website Analyse

1. **HTTP Request** — Fetch de website HTML
2. **Schema.org Parser** — Detecteert JSON-LD structured data types
3. **Meta & Headings Parser** — Analyseert title, meta description, H1-H6, canonical, OG tags
4. **Technische Checks** — sitemap.xml, robots.txt (AI crawler blocking), llms.txt, HTTPS
5. **Platform Detectie** — WordPress/Shopify/Wix/Squarespace/Custom op basis van HTML signatures

## Branch 2: Performance

1. **Google PageSpeed API** — Mobile + Desktop
2. **Core Web Vitals Extractie** — Performance score, LCP, CLS, TBT

## Branch 3: AI Citations

1. **Prompt Generator** — 10 diverse zoekprompts per branche + stad
2. **AI Platform Queries** — Gemini, OpenAI (gpt-4o-mini), Claude (Haiku), Perplexity (Sonar)
3. **Response Parser** — JSON parsing met fuzzy bedrijfsnaam matching
4. **Citation Scorer** — Citation rate, gemiddelde positie, concurrentenlijst per platform

## Score Model

Gewogen totaalscore (0-100):

| Categorie    | Gewicht | Bron                          |
|-------------|---------|-------------------------------|
| AI Citations | 40%     | Citation rate + platform coverage |
| Technisch    | 30%     | 9 binaire checks (elk ~11.1 pt)  |
| Content      | 20%     | Meta, H1, FAQ, OG, canonical     |
| Performance  | 10%     | PageSpeed mobile score            |

## Lead Routing

Na intake (apart webhook endpoint):

- **Route B**: Lead heeft al een bureau → rapport per e-mail, CRM tag
- **Route A**: Geen bureau + toestemming → doorverkoopbaar naar partnerbureaus
- **Route A-passief**: Geen bureau + geen toestemming → nurturing flow

## Bestanden

```
src/parsers/          — HTML parsing, platform detectie, tech checks
src/citations/        — Prompt generatie, AI response parsing, citation scoring
src/scoring/          — GEO score berekening (gewogen model)
src/routing/          — Lead routing logica
src/report/           — Teaser en volledig rapport generatie
templates/            — HTML rapport template (e-mail compatible)
n8n/                  — Importeerbare n8n workflows
```
