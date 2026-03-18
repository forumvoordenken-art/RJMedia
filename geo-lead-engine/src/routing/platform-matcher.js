/**
 * Platform Matcher — Match platform + branche naar bureau-type
 */

const PLATFORM_BUREAU_MAP = {
  wordpress: {
    bureau_types: ['wp-bureau', 'seo-specialist'],
    lead_value: 'hoog',
    description: 'WordPress specialist of SEO bureau'
  },
  shopify: {
    bureau_types: ['shopify-partner', 'ecommerce-bureau'],
    lead_value: 'hoog',
    description: 'Shopify partner of e-commerce bureau'
  },
  wix: {
    bureau_types: ['platform-expert', 'content-bureau'],
    lead_value: 'medium',
    description: 'Platform expert of content bureau'
  },
  squarespace: {
    bureau_types: ['platform-expert', 'content-bureau'],
    lead_value: 'medium',
    description: 'Platform expert of content bureau'
  },
  custom: {
    bureau_types: ['webdev-bureau', 'full-service-agency'],
    lead_value: 'hoog',
    description: 'Webdevelopment bureau of full-service agency'
  }
};

function matchBureau(platform, branche) {
  const mapping = PLATFORM_BUREAU_MAP[platform] || PLATFORM_BUREAU_MAP.custom;

  return {
    bureau_types: mapping.bureau_types,
    lead_value: mapping.lead_value,
    description: mapping.description,
    tags: [platform, branche].filter(Boolean)
  };
}

module.exports = { matchBureau, PLATFORM_BUREAU_MAP };
