import { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import RunningCommentary from './components/RunningCommentary';
import TotalDisplay from './components/TotalDisplay';
import DetailedBreakdown from './components/DetailedBreakdown';
import AssumptionsPanel from './components/AssumptionsPanel';
import benchmarkData from './data/benchmarks.json';
import { adjustAccuracy } from './logic/adjustments';
import { calculateAll } from './logic/calculations';
import { detectContradictions } from './logic/contradictions';

const INITIAL_INPUTS = {
  companyName: '',
  companyType: 'Listed',
  industry: '',
  revenue: null,
  cogs: null,
  reportedAccuracy: null,
  accuracyLevel: 'SKU-Week',
  dio: null,
  inventoryValue: null,
  fillRate: null,
  expeditedFreight: null,
};

function App() {
  const [view, setView] = useState('diagnostic');
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const [overrides, setOverrides] = useState({});

  // Merge benchmark defaults with overrides
  const benchmarks = useMemo(() => {
    if (!inputs.industry || !benchmarkData[inputs.industry]) return null;
    const base = benchmarkData[inputs.industry].benchmarks;
    const merged = {};
    for (const [key, val] of Object.entries(base)) {
      merged[key] = overrides[key] !== undefined
        ? { ...val, value: overrides[key] }
        : { ...val };
    }
    return merged;
  }, [inputs.industry, overrides]);

  const industryLabel = inputs.industry ? benchmarkData[inputs.industry]?.label : '';

  // Compute adjusted accuracy
  const adjustedAccuracyVal = useMemo(() => {
    if (inputs.reportedAccuracy != null && inputs.reportedAccuracy !== '') {
      return adjustAccuracy(Number(inputs.reportedAccuracy), inputs.accuracyLevel);
    }
    if (benchmarks) return benchmarks.typicalMAPE.value;
    return null;
  }, [inputs.reportedAccuracy, inputs.accuracyLevel, benchmarks]);

  // Effective inputs for calculations
  const effectiveInputs = useMemo(() => {
    if (!benchmarks) return inputs;

    let effectiveCOGS = inputs.cogs;
    if ((effectiveCOGS == null || effectiveCOGS === '') && inputs.revenue && inputs.companyType === 'Unlisted') {
      effectiveCOGS = inputs.revenue * (1 - benchmarks.grossMargin.value);
    }

    let effectiveDIO = inputs.dio;
    if ((effectiveDIO == null || effectiveDIO === '') && inputs.companyType === 'Unlisted') {
      effectiveDIO = Math.round(benchmarks.medianDIO.value * 1.15);
    }

    const effectiveFillRate = inputs.fillRate ?? benchmarks.typicalFillRate.value;

    return {
      ...inputs,
      cogs: effectiveCOGS != null ? Number(effectiveCOGS) : null,
      dio: effectiveDIO != null ? Number(effectiveDIO) : null,
      fillRate: effectiveFillRate != null ? Number(effectiveFillRate) : null,
      adjustedAccuracy: adjustedAccuracyVal,
      industryLabel,
    };
  }, [inputs, benchmarks, adjustedAccuracyVal, industryLabel]);

  // Calculate gaps
  const gaps = useMemo(() => {
    if (!benchmarks || !effectiveInputs.revenue) return {};
    return calculateAll(effectiveInputs, benchmarks);
  }, [effectiveInputs, benchmarks]);

  // Detect contradictions
  const contradictions = useMemo(() => {
    if (!benchmarks) return [];
    return detectContradictions(effectiveInputs, benchmarks);
  }, [effectiveInputs, benchmarks]);

  const handleUpdate = useCallback((updates) => {
    setInputs((prev) => {
      const next = { ...prev, ...updates };
      if (updates.industry !== undefined && updates.industry !== prev.industry) {
        setOverrides({});
      }
      return next;
    });
  }, []);

  const handleOverride = useCallback((key, value) => {
    setOverrides((prev) => {
      if (value === undefined) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const handleResetOverrides = useCallback(() => {
    setOverrides({});
  }, []);

  const tabs = [
    { id: 'diagnostic', label: 'Diagnostic' },
    { id: 'breakdown', label: 'Breakdown' },
    { id: 'assumptions', label: 'Assumptions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        companyName={inputs.companyName}
        companyType={inputs.companyType}
        industry={inputs.industry}
        onUpdate={handleUpdate}
      />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                  view === tab.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {view === 'diagnostic' && (
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <InputSection
            inputs={effectiveInputs}
            benchmarks={benchmarks}
            onUpdate={handleUpdate}
            contradictions={contradictions}
          />
          <RunningCommentary
            inputs={effectiveInputs}
            benchmarks={benchmarks}
            contradictions={contradictions}
            gaps={gaps}
          />
          <TotalDisplay
            inputs={effectiveInputs}
            total={gaps.total}
            totalPctOfRevenue={gaps.totalPctOfRevenue}
            onViewBreakdown={() => setView('breakdown')}
          />
        </div>
      )}

      {view === 'breakdown' && (
        <DetailedBreakdown
          inputs={effectiveInputs}
          benchmarks={benchmarks}
          gaps={gaps}
          contradictions={contradictions}
          onBack={() => setView('diagnostic')}
        />
      )}

      {view === 'assumptions' && (
        <AssumptionsPanel
          industry={inputs.industry}
          benchmarks={benchmarks}
          overrides={overrides}
          onOverride={handleOverride}
          onReset={handleResetOverrides}
          onBack={() => setView('diagnostic')}
        />
      )}
    </div>
  );
}

export default App;
