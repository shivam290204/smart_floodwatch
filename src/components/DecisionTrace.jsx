import React from 'react';

const DecisionTrace = ({ ward }) => {
  if (!ward) {
    return (
      <div className="bg-white border border-gray-300 shadow-sm p-6">
        <div className="text-center text-gray-600 py-8">
          <p className="font-bold uppercase tracking-wide">Click on any ward to see decision analysis</p>
          <p className="text-xs mt-2 font-semibold">WHY • WHAT • HOW</p>
        </div>
      </div>
    );
  }

  // Calculate decision factors
  const normalRainfall = 50; // mm baseline for monsoon
  const rainfallAnomaly = Math.round(((ward.rainfall - normalRainfall) / normalRainfall) * 100);
  const drainageStress = Math.round((ward.drainageDeficit / 100) * 100);
  const historicalEvents = Math.floor(ward.complaints / 3); // Proxy for past floods

  // Determine impact
  const hasWaterLogging = ward.riskIndex > 50;
  const disruptionLevel = ward.riskIndex > 70 ? 'High' : ward.riskIndex > 40 ? 'Medium' : 'Low';

  // Recommended actions
  const needsPumps = ward.riskIndex > 60;
  const needsDrainCleaning = ward.drainageDeficit > 50;
  const needsTrafficAdvisory = ward.riskIndex > 70;

  return (
    <div className="bg-white border border-gray-300 shadow-sm">
      {/* Header */}
      <div className="bg-blue-900 text-white p-3 border-b border-gray-300">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wide">Decision Trace</h3>
          <p className="text-xs text-blue-200 uppercase font-semibold">Ward {ward.wardId} – {ward.wardName}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* WHY Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Why is this risky?</h4>
          </div>
          <div className="bg-gray-50 border border-gray-300 p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-800 font-semibold uppercase">Rainfall Anomaly:</span>
              <span className={`font-bold ${rainfallAnomaly > 20 ? 'text-red-800' : rainfallAnomaly > 0 ? 'text-yellow-700' : 'text-green-700'}`}>
                {rainfallAnomaly > 0 ? '+' : ''}{rainfallAnomaly}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800 font-semibold uppercase">Drainage Stress:</span>
              <span className={`font-bold ${drainageStress > 60 ? 'text-red-800' : drainageStress > 40 ? 'text-yellow-700' : 'text-green-700'}`}>
                {drainageStress}% capacity used
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-800 font-semibold uppercase">Historical Flood Events:</span>
              <span className="font-bold text-gray-900">{historicalEvents} incidents</span>
            </div>
          </div>
        </div>

        {/* WHAT Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">What to expect?</h4>
          </div>
          <div className="bg-gray-50 border border-gray-300 p-3 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-semibold uppercase">Surface Water Accumulation:</span>
              <span className={`font-bold px-2 py-1 border text-xs uppercase ${hasWaterLogging ? 'bg-red-50 text-red-800 border-red-300' : 'bg-green-50 text-green-800 border-green-300'}`}>
                {hasWaterLogging ? 'Likely' : 'Unlikely'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-semibold uppercase">Disruption Level:</span>
              <span className={`font-bold px-2 py-1 border text-xs uppercase ${
                disruptionLevel === 'High' ? 'bg-red-50 text-red-800 border-red-300' : 
                disruptionLevel === 'Medium' ? 'bg-yellow-50 text-yellow-800 border-yellow-300' : 
                'bg-green-50 text-green-800 border-green-300'
              }`}>
                {disruptionLevel}
              </span>
            </div>
          </div>
        </div>

        {/* HOW Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">How to respond?</h4>
          </div>
          <div className="bg-gray-50 border border-gray-300 p-3 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className={`font-bold ${needsPumps ? 'text-blue-800' : 'text-gray-400'}`}>
                {needsPumps ? '✓' : '○'}
              </span>
              <div className="flex-1">
                <span className={`uppercase text-xs font-bold ${needsPumps ? 'text-gray-900' : 'text-gray-500'}`}>
                  Deploy Mobile Pumps
                </span>
                {needsPumps && <p className="text-xs text-gray-700 mt-1 font-semibold">Immediate deployment recommended</p>}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className={`font-bold ${needsDrainCleaning ? 'text-blue-800' : 'text-gray-400'}`}>
                {needsDrainCleaning ? '✓' : '○'}
              </span>
              <div className="flex-1">
                <span className={`uppercase text-xs font-bold ${needsDrainCleaning ? 'text-gray-900' : 'text-gray-500'}`}>
                  Priority Drain Cleaning
                </span>
                {needsDrainCleaning && <p className="text-xs text-gray-700 mt-1 font-semibold">Clear blocked drains within 24h</p>}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className={`font-bold ${needsTrafficAdvisory ? 'text-blue-800' : 'text-gray-400'}`}>
                {needsTrafficAdvisory ? '✓' : '○'}
              </span>
              <div className="flex-1">
                <span className={`uppercase text-xs font-bold ${needsTrafficAdvisory ? 'text-gray-900' : 'text-gray-500'}`}>
                  Traffic Advisory Required
                </span>
                {needsTrafficAdvisory && <p className="text-xs text-gray-700 mt-1 font-semibold">Issue public alert for route diversions</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Risk Score Summary */}
        <div className="bg-white border border-gray-300 p-3 border-l-4 border-l-blue-900">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900 uppercase">Overall Risk Score:</span>
            <span className="text-2xl font-bold text-blue-900">
              {Math.round(ward.riskIndex)}/100
            </span>
          </div>
          <p className="text-xs text-gray-700 mt-1 uppercase font-semibold">
            Category: <span className="font-bold text-gray-900">{ward.riskCategory}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DecisionTrace;
