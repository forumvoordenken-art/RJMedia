# API Endpoints

## 1. GEO Analyse (Webhook)

**URL:** `POST {N8N_WEBHOOK_URL}/geo-analyse`

### Request

```json
{
  "url": "https://example.nl",
  "stad": "Utrecht",
  "branche": "horeca"
}
```

| Veld     | Type   | Verplicht | Beschrijving                        |
|----------|--------|-----------|-------------------------------------|
| url      | string | Ja        | Website URL (incl. https://)        |
| stad     | string | Ja        | Stad van het bedrijf                |
| branche  | string | Ja        | Branche/sector van het bedrijf      |

### Response (Teaser)

```json
{
  "geo_score": 42,
  "score_label": "Matig",
  "top_problems": [
    {
      "severity": "kritiek",
      "title": "Geen Schema.org markup gevonden",
      "impact": "AI-zoekmachines begrijpen je website minder goed"
    },
    {
      "severity": "waarschuwing",
      "title": "H1 bevat geen locatie of branche",
      "impact": "Minder relevant voor lokale AI-zoekopdrachten"
    },
    {
      "severity": "tip",
      "title": "Geen llms.txt aanwezig",
      "impact": "AI-modellen missen context over je bedrijf"
    }
  ],
  "total_problems": 5
}
```

## 2. Lead Intake (Webhook)

**URL:** `POST {N8N_WEBHOOK_URL}/geo-intake`

### Request

```json
{
  "email": "info@degoudenvork.nl",
  "bedrijfsnaam": "De Gouden Vork",
  "telefoon": "06-12345678",
  "beheertype": "zelf",
  "toestemming": "ja",
  "rapport_id": "abc123"
}
```

| Veld          | Type   | Verplicht | Waarden                       |
|---------------|--------|-----------|-------------------------------|
| email         | string | Ja        | E-mailadres van de lead       |
| bedrijfsnaam  | string | Ja        | Naam van het bedrijf          |
| telefoon      | string | Nee       | Telefoonnummer                |
| beheertype    | string | Ja        | "zelf", "bureau", "niemand"   |
| toestemming   | string | Ja        | "ja", "nee"                   |
| rapport_id    | string | Ja        | ID van het eerder gegenereerde rapport |

### Response

```json
{
  "status": "ok",
  "route": "A",
  "message": "Lead ontvangen en gerouteerd"
}
```

## Externe API's

### Google PageSpeed Insights
- **URL:** `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
- **Params:** `url`, `strategy` (mobile/desktop)
- **Limiet:** 25.000 calls/dag (gratis)

### Gemini (Google)
- **URL:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Auth:** API key als query param `?key={GEMINI_API_KEY}`
- **Limiet:** 15 req/min, 1500/dag (gratis tier)

### OpenAI (gpt-4o-mini)
- **URL:** `https://api.openai.com/v1/chat/completions`
- **Auth:** `Authorization: Bearer {OPENAI_API_KEY}`
- **Kosten:** ~€0.50 per 10 prompts

### Claude (Haiku)
- **URL:** `https://api.anthropic.com/v1/messages`
- **Auth:** `x-api-key: {ANTHROPIC_API_KEY}`, `anthropic-version: 2023-06-01`
- **Kosten:** ~€0.30 per 10 prompts

### Perplexity (Sonar)
- **URL:** `https://api.perplexity.ai/chat/completions`
- **Auth:** `Authorization: Bearer {PERPLEXITY_API_KEY}`
- **Kosten:** ~€0.20 per 10 prompts
