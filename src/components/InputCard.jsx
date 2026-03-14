import StatusDot from './StatusDot';
import InfoTooltip from './InfoTooltip';

export default function InputCard({
  status,
  label,
  infoText,
  children,
  benchmarkText,
  feedbackText,
  feedbackType,
  highlight,
  optional,
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-all ${
        highlight ? 'border-amber-300 shadow-amber-100 shadow-md' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <StatusDot status={status} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-800">{label}</span>
            {optional && (
              <span className="text-xs text-gray-400 font-normal">(optional)</span>
            )}
            {infoText && <InfoTooltip text={infoText} />}
          </div>
          <div className="space-y-3">
            {children}
            {benchmarkText && (
              <p className="text-xs text-gray-400">{benchmarkText}</p>
            )}
            {feedbackText && (
              <p
                className={`text-xs font-medium ${
                  feedbackType === 'warning'
                    ? 'text-amber-600'
                    : feedbackType === 'good'
                    ? 'text-emerald-600'
                    : 'text-gray-500'
                }`}
              >
                {feedbackText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
