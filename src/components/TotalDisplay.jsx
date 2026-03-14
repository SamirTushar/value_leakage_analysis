import { getDiagnosticState } from '../logic/sequencing';
import { formatCr, formatPct } from '../utils/formatCurrency';

export default function TotalDisplay({ inputs, total, totalPctOfRevenue, onViewBreakdown }) {
  const state = getDiagnosticState(inputs);

  if (state < 2) {
    return null;
  }

  if (state === 2) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-500">Enter DIO to size the first gap.</p>
      </div>
    );
  }

  if (total == null) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
        Total Value Leakage
      </p>
      <p className="text-4xl font-bold text-gray-900">
        {formatCr(total)}
        <span className="text-lg font-normal text-gray-400">/year</span>
      </p>
      {totalPctOfRevenue != null && (
        <p className="text-sm text-gray-500 mt-1">
          {formatPct(totalPctOfRevenue)} of revenue
        </p>
      )}
      <button
        onClick={onViewBreakdown}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
      >
        View Detailed Breakdown →
      </button>
    </div>
  );
}
