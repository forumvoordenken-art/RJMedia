/**
 * Teaser Generator — Genereer teaser data (score + top 3 problemen)
 */

function generateTeaser(geoScore, technicalChecks, contentChecks) {
  const problems = [];

  // Prioritized problem detection
  if (technicalChecks && !technicalChecks.has_schema) {
    problems.push({
      severity: 'kritiek',
      title: 'Geen Schema.org markup gevonden',
      impact: 'AI-zoekmachines begrijpen je website minder goed'
    });
  }

  if (technicalChecks && technicalChecks.robots_blocks_ai === true) {
    problems.push({
      severity: 'kritiek',
      title: 'AI-crawlers worden geblokkeerd',
      impact: 'ChatGPT en Claude kunnen je website niet indexeren'
    });
  }

  if (contentChecks && !contentChecks.h1_contains_location) {
    problems.push({
      severity: 'waarschuwing',
      title: 'H1 bevat geen locatie of branche',
      impact: 'Minder relevant voor lokale AI-zoekopdrachten'
    });
  }

  if (contentChecks && !contentChecks.has_faq_section) {
    problems.push({
      severity: 'waarschuwing',
      title: 'Geen FAQ-sectie gevonden',
      impact: 'Gemiste kans voor direct antwoorden in AI-resultaten'
    });
  }

  if (technicalChecks && !technicalChecks.has_llms_txt) {
    problems.push({
      severity: 'tip',
      title: 'Geen llms.txt aanwezig',
      impact: 'AI-modellen missen context over je bedrijf'
    });
  }

  if (contentChecks && !contentChecks.meta_description_ok) {
    problems.push({
      severity: 'waarschuwing',
      title: 'Meta description ontbreekt of is te kort',
      impact: 'AI-zoekmachines missen een goede samenvatting'
    });
  }

  if (contentChecks && !contentChecks.has_og_tags) {
    problems.push({
      severity: 'tip',
      title: 'Geen Open Graph tags',
      impact: 'Slechtere weergave bij delen op social media'
    });
  }

  return {
    geo_score: geoScore.total,
    score_label: getScoreLabel(geoScore.total),
    top_problems: problems.slice(0, 3),
    total_problems: problems.length
  };
}

function getScoreLabel(score) {
  if (score >= 80) return 'Uitstekend';
  if (score >= 60) return 'Goed';
  if (score >= 40) return 'Matig';
  if (score >= 20) return 'Zwak';
  return 'Kritiek';
}

module.exports = { generateTeaser, getScoreLabel };
