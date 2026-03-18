# Scoring Model

## Totaalscore (0-100)

De GEO-score is een gewogen combinatie van vier categorieën:

```
totaal = citations × 0.40 + technisch × 0.30 + content × 0.20 + performance × 0.10
```

## 1. AI Citations Score (0-100) — Gewicht: 40%

Meet hoe vaak het bedrijf wordt genoemd door AI-zoekmachines.

**Berekening:**
```
citations_score = (gemiddelde_citation_rate × 0.7) + (platform_coverage × 0.3)
```

- **Citation rate per platform:** `(aantal_keer_genoemd / 10_prompts) × 100`
- **Platform coverage:** percentage van de 4 platforms (Gemini, OpenAI, Claude, Perplexity) waar het bedrijf minstens 1x wordt genoemd

**Fuzzy matching:** Bedrijfsnamen worden genormaliseerd (lowercase, "de"/"het"/"bv"/"b.v." verwijderd) voor vergelijking.

## 2. Technisch Score (0-100) — Gewicht: 30%

9 binaire checks, elk ~11.1 punten:

| # | Check                                              | Punten |
|---|----------------------------------------------------|--------|
| 1 | Schema.org aanwezig (JSON-LD)                      | 11.1   |
| 2 | LocalBusiness of Organization schema                | 11.1   |
| 3 | robots.txt aanwezig, blokkeert AI crawlers NIET     | 11.1   |
| 4 | sitemap.xml aanwezig en valide                      | 11.1   |
| 5 | HTTPS actief                                        | 11.1   |
| 6 | llms.txt aanwezig                                   | 11.1   |
| 7 | FAQ schema aanwezig                                 | 11.1   |
| 8 | Semantic HTML (correcte H1-H6 hiërarchie)           | 11.1   |
| 9 | Core Web Vitals "goed" (mobile performance > 50)    | 11.2   |

## 3. Content Score (0-100) — Gewicht: 20%

| Check                                | Punten |
|--------------------------------------|--------|
| Meta description aanwezig en > 120 tekens | 25 |
| H1 bevat branche of locatie               | 25 |
| FAQ sectie aanwezig op de site            | 25 |
| Open Graph tags aanwezig                  | 15 |
| Canonical URL correct                     | 10 |

## 4. Performance Score (0-100) — Gewicht: 10%

Directe overname van de Google PageSpeed Insights mobile performance score (0-100).

## Score Labels

| Score   | Label      |
|---------|------------|
| 80-100  | Uitstekend |
| 60-79   | Goed       |
| 40-59   | Matig      |
| 20-39   | Zwak       |
| 0-19    | Kritiek    |

## Voorbeeldberekening

Een restaurant in Utrecht met:
- Citations: gemiddelde rate 30%, coverage 50% → `30×0.7 + 50×0.3 = 36`
- Technisch: 5 van 9 checks → `5 × 11.1 = 55.5 → 56`
- Content: meta + FAQ → `25 + 25 = 50`
- Performance: PageSpeed 72 → `72`

**Totaal:** `36×0.4 + 56×0.3 + 50×0.2 + 72×0.1 = 14.4 + 16.8 + 10 + 7.2 = 48.4 → 48`

Score label: **Matig**
