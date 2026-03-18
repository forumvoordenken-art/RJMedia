/**
 * Full Report Generator — Genereer volledig rapport data object
 */

const { getScoreLabel } = require('./teaser-generator');

function generateBevindingen(technicalChecks, contentChecks, performanceData) {
  const bevindingen = [];

  // Technical findings
  if (technicalChecks) {
    if (!technicalChecks.has_schema) {
      bevindingen.push({
        severity: 'kritiek',
        title: 'Geen Schema.org markup',
        description: 'Je website bevat geen JSON-LD structured data. Dit maakt het voor AI-zoekmachines moeilijk om je bedrijfsinformatie te begrijpen.',
        impact: 'hoog'
      });
    }
    if (!technicalChecks.has_local_schema) {
      bevindingen.push({
        severity: 'kritiek',
        title: 'Geen LocalBusiness/Organization schema',
        description: 'Zonder LocalBusiness of Organization schema weten AI-modellen niet dat je een lokaal bedrijf bent.',
        impact: 'hoog'
      });
    }
    if (technicalChecks.robots_blocks_ai) {
      bevindingen.push({
        severity: 'kritiek',
        title: 'AI-crawlers geblokkeerd in robots.txt',
        description: 'Je robots.txt blokkeert AI-crawlers (GPTBot, ClaudeBot). Hierdoor kunnen AI-zoekmachines je website niet indexeren.',
        impact: 'hoog'
      });
    }
    if (!technicalChecks.has_sitemap) {
      bevindingen.push({
        severity: 'waarschuwing',
        title: 'Geen sitemap.xml gevonden',
        description: 'Een XML sitemap helpt zoekmachines en AI-crawlers om al je pagina\'s te vinden.',
        impact: 'medium'
      });
    }
    if (!technicalChecks.is_https) {
      bevindingen.push({
        severity: 'kritiek',
        title: 'Geen HTTPS',
        description: 'Je website draait niet op HTTPS. Dit is een basisvereiste voor betrouwbaarheid.',
        impact: 'hoog'
      });
    }
    if (!technicalChecks.has_llms_txt) {
      bevindingen.push({
        severity: 'tip',
        title: 'Geen llms.txt aanwezig',
        description: 'Een llms.txt bestand geeft AI-modellen extra context over je bedrijf en diensten.',
        impact: 'laag'
      });
    }
    if (!technicalChecks.has_faq_schema) {
      bevindingen.push({
        severity: 'waarschuwing',
        title: 'Geen FAQ schema',
        description: 'FAQ schema markup zorgt ervoor dat veelgestelde vragen direct beantwoord kunnen worden door AI.',
        impact: 'medium'
      });
    }
    if (!technicalChecks.has_heading_hierarchy) {
      bevindingen.push({
        severity: 'waarschuwing',
        title: 'Onlogische heading-structuur',
        description: 'Je headings (H1-H6) volgen geen logische hiërarchie. Dit maakt je content minder machine-leesbaar.',
        impact: 'medium'
      });
    }
  }

  // Content findings
  if (contentChecks) {
    if (!contentChecks.meta_description_ok) {
      bevindingen.push({
        severity: 'waarschuwing',
        title: 'Meta description ontbreekt of te kort',
        description: 'Een goede meta description (>120 tekens) helpt AI-modellen je pagina te begrijpen en samen te vatten.',
        impact: 'medium'
      });
    }
    if (!contentChecks.h1_contains_location) {
      bevindingen.push({
        severity: 'waarschuwing',
        title: 'H1 mist locatie of branche',
        description: 'Je H1 bevat geen verwijzing naar je stad of branche. Dit vermindert de lokale relevantie voor AI-zoekopdrachten.',
        impact: 'medium'
      });
    }
    if (!contentChecks.has_faq_section) {
      bevindingen.push({
        severity: 'waarschuwing',
        title: 'Geen FAQ-sectie op de website',
        description: 'Een FAQ-sectie geeft AI-zoekmachines kant-en-klare antwoorden om aan gebruikers te tonen.',
        impact: 'medium'
      });
    }
    if (!contentChecks.has_canonical) {
      bevindingen.push({
        severity: 'tip',
        title: 'Geen canonical URL',
        description: 'Een canonical tag voorkomt duplicate content problemen bij AI-indexering.',
        impact: 'laag'
      });
    }
  }

  // Performance findings
  if (performanceData && performanceData.mobile) {
    if (performanceData.mobile.score < 50) {
      bevindingen.push({
        severity: 'waarschuwing',
        title: 'Slechte mobiele performance',
        description: `Je mobiele performance score is ${performanceData.mobile.score}/100. Snelheid beïnvloedt hoe AI-modellen je website waarderen.`,
        impact: 'medium'
      });
    }
  }

  return bevindingen;
}

function generateFullReport(data) {
  const {
    bedrijfsnaam, url, platform, branche, datum,
    geoScore, technicalChecks, contentChecks, performanceData,
    citationResults, toestemming
  } = data;

  const bevindingen = generateBevindingen(technicalChecks, contentChecks, performanceData);

  // Build competitor list from citation data
  const concurrenten = [];
  if (citationResults && citationResults.platforms) {
    const allCompetitors = {};
    for (const p of citationResults.platforms) {
      for (const comp of (p.competitors || [])) {
        allCompetitors[comp.name] = (allCompetitors[comp.name] || 0) + comp.count;
      }
    }
    const sorted = Object.entries(allCompetitors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
    for (const [name, count] of sorted) {
      concurrenten.push({
        name,
        url_masked: '***',
        score: Math.min(100, Math.round((count / 40) * 100)) // rough relative score
      });
    }
  }

  return {
    bedrijfsnaam,
    url,
    platform,
    branche,
    datum: datum || new Date().toISOString().split('T')[0],
    geo_score: geoScore.total,
    score_label: getScoreLabel(geoScore.total),
    citations_score: geoScore.breakdown.citations,
    technical_score: geoScore.breakdown.technical,
    content_score: geoScore.breakdown.content,
    performance_score: geoScore.breakdown.performance,
    bevindingen,
    concurrenten,
    toestemming: toestemming || 'nee'
  };
}

module.exports = { generateFullReport, generateBevindingen };
