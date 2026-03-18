/**
 * PageSpeed Parser — Core Web Vitals extractie uit PageSpeed API response
 */

function parsePageSpeedResponse(response) {
  if (!response || !response.lighthouseResult) {
    return { score: 0, lcp: null, cls: null, tbt: null };
  }

  const lr = response.lighthouseResult;

  const score = Math.round(
    ((lr.categories && lr.categories.performance && lr.categories.performance.score) || 0) * 100
  );

  const audits = lr.audits || {};

  const lcp = audits['largest-contentful-paint']
    ? audits['largest-contentful-paint'].numericValue || null
    : null;

  const cls = audits['cumulative-layout-shift']
    ? audits['cumulative-layout-shift'].numericValue || null
    : null;

  const tbt = audits['total-blocking-time']
    ? audits['total-blocking-time'].numericValue || null
    : null;

  return { score, lcp, cls, tbt };
}

function parsePageSpeedResults(mobileResponse, desktopResponse) {
  return {
    mobile: parsePageSpeedResponse(mobileResponse),
    desktop: parsePageSpeedResponse(desktopResponse)
  };
}

module.exports = { parsePageSpeedResponse, parsePageSpeedResults };
