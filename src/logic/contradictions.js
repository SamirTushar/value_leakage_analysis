// Contradiction detection — hardcoded rules, no LLM

export function detectContradictions(inputs, benchmarks) {
  const { adjustedAccuracy, dio, fillRate } = inputs;
  const medianDIO = benchmarks.medianDIO.value;
  const results = [];

  // Rule 1: High fill + low accuracy
  if (fillRate != null && fillRate > 95 && adjustedAccuracy != null && adjustedAccuracy < 50) {
    results.push({
      id: 1,
      priority: 5,
      type: 'high_fill_low_accuracy',
      text: `Fill rate is ${fillRate}% despite forecast accuracy of ${adjustedAccuracy.toFixed(0)}%. The gap is being bridged by excess inventory and freight spend.`,
    });
  }

  // Rule 2: High fill + high DIO
  if (fillRate != null && fillRate > 95 && dio != null && dio > medianDIO + 15) {
    results.push({
      id: 2,
      priority: 4,
      type: 'high_fill_high_dio',
      text: `Fill rate is healthy but DIO is ${(dio - medianDIO).toFixed(0)} days above median. Service is being maintained by holding significantly more stock than needed.`,
    });
  }

  // Rule 3: Low fill + high DIO
  if (fillRate != null && fillRate < 94 && dio != null && dio > medianDIO) {
    results.push({
      id: 3,
      priority: 4,
      type: 'low_fill_high_dio',
      text: `Carrying ${(dio - medianDIO).toFixed(0)} days above median inventory but service is ${fillRate}%. Excess stock is likely in the wrong products.`,
    });
  }

  // Rule 4: Accuracy at wrong level
  if (
    inputs.reportedAccuracy != null &&
    inputs.reportedAccuracy > 55 &&
    inputs.accuracyLevel !== 'SKU-Week' &&
    adjustedAccuracy != null
  ) {
    results.push({
      id: 4,
      priority: 3,
      type: 'wrong_level',
      text: `Reported accuracy of ${inputs.reportedAccuracy}% at ${inputs.accuracyLevel}. At SKU-week level where decisions happen, accuracy is closer to ${adjustedAccuracy.toFixed(0)}%.`,
    });
  }

  // Rule 5: Metrics look fine
  if (
    adjustedAccuracy != null && adjustedAccuracy > 50 &&
    fillRate != null && fillRate > 95 &&
    dio != null && Math.abs(dio - medianDIO) <= 10
  ) {
    results.push({
      id: 5,
      priority: 1,
      type: 'metrics_ok',
      text: 'Metrics are in line with industry. Opportunity is in closing the gap to best-in-class.',
    });
  }

  // Sort by priority descending
  results.sort((a, b) => b.priority - a.priority);
  return results;
}
