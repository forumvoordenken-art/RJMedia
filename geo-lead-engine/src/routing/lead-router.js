/**
 * Lead Router — Route A/B logica op basis van beheertype + toestemming
 */

const { matchBureau } = require('./platform-matcher');

/**
 * Bepaal de route voor een lead
 * @param {Object} intake - Intake data van webhook
 * @param {Object} rapportData - Rapport data met platform info
 * @returns {Object} Routing beslissing
 */
function routeLead(intake, rapportData) {
  const { beheertype, toestemming } = intake;
  const platform = rapportData && rapportData.platform || 'custom';
  const branche = rapportData && rapportData.branche || '';

  if (beheertype === 'bureau') {
    return {
      route: 'B',
      action: 'send_report_email',
      crm_tags: ['route-b', 'heeft-bureau', platform, branche].filter(Boolean),
      doorverkoopbaar: false,
      description: 'Lead heeft al een bureau. Rapport per e-mail, marktonderzoek-vraag sturen.'
    };
  }

  // beheertype === 'zelf' || beheertype === 'niemand'
  if (toestemming === 'ja') {
    const bureauMatch = matchBureau(platform, branche);
    return {
      route: 'A',
      action: 'match_partner_bureau',
      crm_tags: ['route-a', 'doorverkoopbaar', platform, branche, beheertype].filter(Boolean),
      doorverkoopbaar: true,
      bureau_match: bureauMatch,
      description: 'Lead is doorverkoopbaar. Matchen met partnerbureaus.'
    };
  }

  // toestemming === 'nee'
  return {
    route: 'A-passief',
    action: 'nurturing',
    crm_tags: ['route-a-passief', 'geen-toestemming', platform, branche, beheertype].filter(Boolean),
    doorverkoopbaar: false,
    description: 'Lead heeft geen toestemming gegeven. Rapport per e-mail, nurturing flow.'
  };
}

module.exports = { routeLead };
