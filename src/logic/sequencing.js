// Input card sequencing — determines which card is "next"

export function getInputStates(inputs) {
  const { industry, revenue, reportedAccuracy, dio, fillRate, expeditedFreight } = inputs;

  const hasIndustry = industry != null && industry !== '';
  const hasRevenue = revenue != null && revenue !== '';
  const hasAccuracy = reportedAccuracy != null && reportedAccuracy !== '';
  const hasDIO = dio != null && dio !== '';
  const hasFillRate = fillRate != null && fillRate !== '';
  const hasExpedited = expeditedFreight != null && expeditedFreight !== '';

  return {
    revenue: hasRevenue ? 'entered' : (!hasIndustry ? 'later' : 'next'),
    accuracy: hasAccuracy ? 'entered' : (hasRevenue && hasIndustry ? 'next' : 'later'),
    dio: hasDIO ? 'entered' : (hasAccuracy ? 'next' : 'later'),
    fillRate: hasFillRate ? 'entered' : (hasDIO ? 'next' : 'later'),
    expeditedFreight: hasExpedited ? 'entered' : (hasFillRate ? 'next' : 'later'),
  };
}

export function getDiagnosticState(inputs) {
  const { industry, revenue, reportedAccuracy, dio, fillRate, expeditedFreight } = inputs;

  const hasIndustry = industry != null && industry !== '';
  const hasRevenue = revenue != null && revenue !== '';
  const hasAccuracy = reportedAccuracy != null && reportedAccuracy !== '';
  const hasDIO = dio != null && dio !== '';
  const hasFillRate = fillRate != null && fillRate !== '';
  const hasExpedited = expeditedFreight != null && expeditedFreight !== '';

  if (!hasIndustry || !hasRevenue) return 0;
  if (!hasAccuracy) return 1;
  if (!hasDIO) return 2;
  if (!hasFillRate) return 3;
  if (!hasExpedited) return 4;
  return 5;
}
