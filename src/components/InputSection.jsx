import InputCard from './InputCard';
import { ACCURACY_LEVELS, adjustAccuracy } from '../logic/adjustments';
import { getInputStates } from '../logic/sequencing';
import { formatCr } from '../utils/formatCurrency';

export default function InputSection({ inputs, benchmarks, onUpdate, contradictions }) {
  const states = getInputStates(inputs);
  const b = benchmarks;

  const adjustedMAPE = inputs.reportedAccuracy != null && inputs.reportedAccuracy !== ''
    ? adjustAccuracy(Number(inputs.reportedAccuracy), inputs.accuracyLevel)
    : null;

  // Auto-calculate COGS for unlisted companies
  const autoFilledCOGS = inputs.companyType === 'Unlisted' && inputs.revenue && b
    ? (inputs.revenue * (1 - b.grossMargin.value)).toFixed(1)
    : null;

  // Contradiction Rule 1 highlight for expedited freight card
  const rule1Fired = contradictions.some(c => c.id === 1);

  return (
    <div className="space-y-4">
      {/* Revenue */}
      <InputCard
        status={states.revenue}
        label="Revenue (₹ Cr)"
        infoText="Annual revenue from latest financials. For listed companies, use Screener.in or annual report."
      >
        <input
          type="number"
          value={inputs.revenue ?? ''}
          onChange={(e) => onUpdate({ revenue: e.target.value ? Number(e.target.value) : null })}
          placeholder="e.g. 9764"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </InputCard>

      {/* COGS */}
      <InputCard
        status={inputs.cogs != null && inputs.cogs !== '' ? 'entered' : (inputs.revenue ? 'next' : 'later')}
        label="COGS (₹ Cr)"
        infoText="Cost of Goods Sold. For unlisted companies, we estimate this from industry gross margin benchmarks."
        feedbackText={
          inputs.companyType === 'Unlisted' && autoFilledCOGS && (inputs.cogs == null || inputs.cogs === '')
            ? `Estimated from ${benchmarks?.label || 'industry'} gross margin of ${(b.grossMargin.value * 100).toFixed(0)}%`
            : null
        }
      >
        <input
          type="number"
          value={inputs.cogs ?? (autoFilledCOGS || '')}
          onChange={(e) => onUpdate({ cogs: e.target.value ? Number(e.target.value) : null })}
          placeholder={inputs.companyType === 'Listed' ? 'e.g. 5956' : 'Auto-estimated if blank'}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </InputCard>

      {/* Forecast Accuracy */}
      <InputCard
        status={states.accuracy}
        label="Forecast Accuracy (MAPE %)"
        infoText="Mean Absolute Percentage Error — how far off your demand forecast is from actual demand, on average. Lower is better. If you don't measure this, leave blank and we'll use the industry average."
        benchmarkText={b ? `Industry typical: ${b.typicalMAPE.value}%. Best-in-class: ${b.bestInClassMAPE.value}%.` : null}
        feedbackText={
          adjustedMAPE != null && inputs.accuracyLevel !== 'SKU-Week'
            ? `At SKU-week level, this is approximately ${adjustedMAPE.toFixed(0)}%${adjustedMAPE >= 100 ? ' — effectively no better than naive methods.' : '.'}`
            : inputs.reportedAccuracy == null || inputs.reportedAccuracy === ''
            ? (b ? `Using industry average of ${b.typicalMAPE.value}%.` : null)
            : null
        }
        feedbackType={adjustedMAPE != null && adjustedMAPE >= 100 ? 'warning' : undefined}
      >
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            max="100"
            value={inputs.reportedAccuracy ?? ''}
            onChange={(e) => onUpdate({ reportedAccuracy: e.target.value ? Number(e.target.value) : null })}
            placeholder="e.g. 45"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
        {inputs.reportedAccuracy != null && inputs.reportedAccuracy !== '' && (
          <div className="mt-2">
            <label className="text-xs text-gray-500 mb-1 block">Measured at:</label>
            <select
              value={inputs.accuracyLevel}
              onChange={(e) => onUpdate({ accuracyLevel: e.target.value })}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white cursor-pointer"
            >
              {ACCURACY_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        )}
      </InputCard>

      {/* DIO */}
      <InputCard
        status={states.dio}
        label="Days Inventory Outstanding (DIO)"
        infoText="How many days of sales your inventory could cover. DIO = (Inventory ÷ COGS) × 365. Higher DIO means more cash locked in stock."
        benchmarkText={b ? `${inputs.industryLabel || 'Industry'} median: ${b.medianDIO.value} days. Best-in-class: ${b.bestInClassDIO.value} days.` : null}
        feedbackText={
          inputs.dio != null && inputs.dio !== '' && b
            ? inputs.dio > b.medianDIO.value
              ? `${(inputs.dio - b.medianDIO.value).toFixed(0)} days above industry median`
              : 'At or below industry median'
            : inputs.companyType === 'Unlisted' && !inputs.dio
            ? `Estimated at ${b ? Math.round(b.medianDIO.value * 1.15) : '—'} days (industry median + buffer). Refine if known.`
            : null
        }
        feedbackType={
          inputs.dio != null && inputs.dio !== '' && b
            ? inputs.dio > b.medianDIO.value ? 'warning' : 'good'
            : undefined
        }
      >
        <div className="space-y-2">
          <input
            type="number"
            value={inputs.dio ?? ''}
            onChange={(e) => onUpdate({ dio: e.target.value ? Number(e.target.value) : null })}
            placeholder="e.g. 78 (days)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          <div className="text-xs text-gray-400">
            Or enter inventory value:
            <input
              type="number"
              value={inputs.inventoryValue ?? ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                const effectiveCOGS = inputs.cogs || (autoFilledCOGS ? Number(autoFilledCOGS) : null);
                if (val != null && effectiveCOGS) {
                  onUpdate({ inventoryValue: val, dio: Math.round((val / effectiveCOGS) * 365) });
                } else {
                  onUpdate({ inventoryValue: val });
                }
              }}
              placeholder="₹ Cr"
              className="ml-2 w-28 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>
      </InputCard>

      {/* Fill Rate */}
      <InputCard
        status={states.fillRate}
        label="Fill Rate / Service Level (%)"
        infoText="Percentage of customer orders fulfilled completely and on time. Also called OTIF. Higher is better. If exact number isn't known, a rough sense is enough."
        benchmarkText={b ? `Industry typical: ${b.typicalFillRate.value}%.` : null}
      >
        <input
          type="number"
          min="0"
          max="100"
          value={inputs.fillRate ?? ''}
          onChange={(e) => onUpdate({ fillRate: e.target.value ? Number(e.target.value) : null })}
          placeholder="e.g. 96"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </InputCard>

      {/* Expedited Freight */}
      <InputCard
        status={states.expeditedFreight}
        label="Expedited / Premium Freight Spend (₹ Cr/year)"
        infoText="Annual spend on rush shipments, air freight, or premium logistics used to fix stockouts or meet deadlines. This is often buried across multiple line items. Even a rough estimate helps."
        optional
        highlight={rule1Fired && (inputs.expeditedFreight == null || inputs.expeditedFreight === '')}
        feedbackText={
          rule1Fired && (inputs.expeditedFreight == null || inputs.expeditedFreight === '')
            ? 'This number would sharpen the freight cost estimate below.'
            : null
        }
        feedbackType={rule1Fired ? 'warning' : undefined}
      >
        <input
          type="number"
          value={inputs.expeditedFreight ?? ''}
          onChange={(e) => onUpdate({ expeditedFreight: e.target.value ? Number(e.target.value) : null })}
          placeholder="e.g. 40"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </InputCard>
    </div>
  );
}
