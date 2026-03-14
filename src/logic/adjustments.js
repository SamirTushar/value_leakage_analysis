// Accuracy level multipliers — converts reported accuracy to SKU-Week equivalent
const LEVEL_MULTIPLIERS = {
  'SKU-Week': 1.0,
  'SKU-Month': 1.4,
  'Product Family-Month': 1.8,
  'National-Month': 2.0,
};

export const ACCURACY_LEVELS = Object.keys(LEVEL_MULTIPLIERS);

export function adjustAccuracy(reportedMAPE, level) {
  if (reportedMAPE == null || reportedMAPE === '') return null;
  const multiplier = LEVEL_MULTIPLIERS[level] || 1.0;
  const adjusted = reportedMAPE * multiplier;
  return Math.min(adjusted, 100);
}

export function getMultiplier(level) {
  return LEVEL_MULTIPLIERS[level] || 1.0;
}
