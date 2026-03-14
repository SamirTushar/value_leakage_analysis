import { getDiagnosticState } from '../logic/sequencing';
import { formatCr } from '../utils/formatCurrency';

export default function RunningCommentary({ inputs, benchmarks, contradictions, gaps }) {
  const state = getDiagnosticState(inputs);
  const b = benchmarks;

  if (state === 0) {
    return (
      <CommentaryCard>
        <p className="text-gray-500 italic">Select an industry and enter revenue to begin the diagnostic.</p>
      </CommentaryCard>
    );
  }

  const industryLabel = inputs.industryLabel || 'Industry';

  return (
    <CommentaryCard>
      {/* What we know so far */}
      {state >= 1 && (
        <p className="text-sm text-gray-700 mb-3">
          Revenue: {formatCr(inputs.revenue)} ({industryLabel})
        </p>
      )}

      {state >= 2 && inputs.adjustedAccuracy != null && (
        <div className="mb-3">
          <p className="text-sm text-gray-700">
            Forecast accuracy: {inputs.adjustedAccuracy.toFixed(0)}%
            {inputs.accuracyLevel !== 'SKU-Week' && ` at ${inputs.accuracyLevel} (adjusted to SKU-week)`}
            . {industryLabel} best-in-class: {b.bestInClassMAPE.value}%. Gap: {(inputs.adjustedAccuracy - b.bestInClassMAPE.value).toFixed(0)} points.
          </p>
          {inputs.accuracyLevel !== 'SKU-Week' && (
            <p className="text-xs text-gray-500 mt-1">
              Reported at {inputs.accuracyLevel} level. At SKU-week where decisions happen, estimated accuracy is ~{inputs.adjustedAccuracy.toFixed(0)}%.
            </p>
          )}
        </div>
      )}

      {state >= 3 && inputs.dio != null && (
        <div className="mb-3">
          <p className="text-sm text-gray-700">
            DIO: {inputs.dio} days. {industryLabel} median: {b.medianDIO.value} days.
            {inputs.dio > b.medianDIO.value && (
              <strong> {(inputs.dio - b.medianDIO.value).toFixed(0)} days above median.</strong>
            )}
          </p>
          {gaps.gap3 && gaps.gap3.excessInventory > 0 && (
            <p className="text-sm text-gray-700 mt-1">
              Excess inventory: {formatCr(gaps.gap3.excessInventory)}. Carrying cost: {formatCr(gaps.gap3.value)}/year.
            </p>
          )}
          {inputs.dio > b.medianDIO.value && inputs.adjustedAccuracy != null && (
            <p className="text-xs text-gray-500 mt-1">
              Your inventory is {(inputs.dio - b.medianDIO.value).toFixed(0)} days above {industryLabel.toLowerCase()} median. With forecast accuracy at {inputs.adjustedAccuracy.toFixed(0)}%, this excess is likely safety stock compensating for forecast uncertainty.
            </p>
          )}
        </div>
      )}

      {/* Contradiction banners */}
      {contradictions.length > 0 && contradictions[0].type !== 'metrics_ok' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
          <p className="text-sm text-amber-800 font-medium">
            ⚠ {contradictions[0].text}
          </p>
        </div>
      )}

      {contradictions.length > 0 && contradictions[0].type === 'metrics_ok' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
          <p className="text-sm text-emerald-700">{contradictions[0].text}</p>
        </div>
      )}

      {contradictions.length > 0 && contradictions[0].type === 'low_fill_high_dio' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
          <p className="text-xs text-gray-600">
            <strong>Insight for the prospect:</strong> "You're holding more inventory than peers but serving customers worse. The issue isn't how much stock — it's which stock and where."
          </p>
        </div>
      )}

      {/* Ask next prompts */}
      {state === 1 && (
        <AskNext
          prompt={'Ask next: "What is your forecast accuracy at SKU level? If they don\'t measure it, ask: how confident are you in your demand forecasts — would you say they\'re right more than half the time?"'}
          why="Forecast accuracy is the upstream driver of all supply chain costs. It determines how much the rest of the chain has to compensate."
        />
      )}

      {state === 2 && (
        <AskNext
          prompt={`Ask next: "How many days of inventory do you carry? Or: what's your inventory value?"${
            inputs.companyType === 'Listed' ? ' For listed companies, this is available from financials.' : ''
          }`}
          why={`With accuracy at ${inputs.adjustedAccuracy?.toFixed(0) ?? '—'}%, inventory is where the cost shows up first. DIO will tell us how much capital is being used to compensate.`}
        />
      )}

      {state === 3 && (
        <AskNext
          prompt={'Ask next: "What\'s your fill rate or service level? High 90s, mid 90s?"'}
          why="If fill rate is high despite low accuracy, you're buying service with inventory dollars and freight dollars. If fill rate is also low, you're holding the wrong stock."
        />
      )}

      {state === 4 && contradictions.some(c => c.id === 1) && (
        <AskNext
          prompt={'Ask next: "Do you know roughly what you spend on expedited or premium freight per year? Even a ballpark helps."'}
          why="This is the hidden cost of maintaining service without planning accuracy. The freight number completes the picture."
        />
      )}

      {state === 5 && (
        <p className="text-sm text-gray-600 mt-2">
          All inputs complete. See total below and detailed breakdown for full picture.
        </p>
      )}
    </CommentaryCard>
  );
}

function CommentaryCard({ children }) {
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
      {children}
    </div>
  );
}

function AskNext({ prompt, why }) {
  return (
    <div className="mt-3">
      <p className="text-sm text-teal-700 font-medium pl-4 border-l-2 border-teal-400">
        → {prompt}
      </p>
      <p className="text-xs text-gray-400 mt-2 pl-4">
        Why this matters: {why}
      </p>
    </div>
  );
}
