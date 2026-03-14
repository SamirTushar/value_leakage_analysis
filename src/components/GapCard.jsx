import ConvictionBadge from './ConvictionBadge';
import { formatCr } from '../utils/formatCurrency';

export default function GapCard({ name, amount, conviction, description, formula, driver }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
        <div className="flex items-center gap-3">
          <ConvictionBadge type={conviction} />
          <span className="text-xl font-bold text-gray-900">{formatCr(amount)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      {formula && (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mb-2 font-mono">
          {formula}
        </p>
      )}
      {driver && (
        <p className="text-xs text-gray-600">{driver}</p>
      )}
    </div>
  );
}
