import benchmarkData from '../data/benchmarks.json';
import InfoTooltip from './InfoTooltip';

const readyIndustries = Object.entries(benchmarkData).filter(([, v]) => v.ready);

export default function Header({ companyName, companyType, industry, onUpdate }) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-5">Value Leakage Diagnostic</h1>
      <div className="flex flex-wrap items-end gap-6">
        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => onUpdate({ companyName: e.target.value })}
            placeholder="Your Company"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-48"
          />
        </div>

        {/* Company Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            Company Type
            <InfoTooltip text="Listed companies have public financials — you can pre-fill revenue, COGS, and inventory from Screener.in (India) or annual reports. Unlisted companies: we estimate from industry benchmarks, just enter revenue." />
          </label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => onUpdate({ companyType: 'Listed' })}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                companyType === 'Listed'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Listed
            </button>
            <button
              onClick={() => onUpdate({ companyType: 'Unlisted' })}
              className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors cursor-pointer ${
                companyType === 'Unlisted'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Unlisted
            </button>
          </div>
        </div>

        {/* Industry */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
            Industry
            <InfoTooltip text="Select the closest industry match. This loads benchmark data for comparison. Benchmarks can be adjusted in the Assumptions tab." />
          </label>
          <select
            value={industry || ''}
            onChange={(e) => onUpdate({ industry: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white min-w-[200px] cursor-pointer"
          >
            <option value="">Select industry...</option>
            {readyIndustries.map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
