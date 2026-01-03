import React from 'react';

const DecisionTrace = ({ ward }) => {
  if (!ward) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="text-center text-gray-500 py-8">
          <span className="text-4xl mb-3 block">🗺️</span>
          <p className="font-semibold">Click on any ward to see decision analysis</p>
          <p className="text-sm mt-2">WHY • WHAT • HOW</p>
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
    <div className="bg-white rounded-xl shadow-lg border border-blue-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
        <div>
          <h3 className="text-lg font-bold">Decision Trace</h3>
          <p className="text-sm opacity-90">Ward {ward.wardId} – {ward.wardName}</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* WHY Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔍</span>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Why is this risky?</h4>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Rainfall Anomaly:</span>
              <span className={`font-semibold ${rainfallAnomaly > 20 ? 'text-red-600' : rainfallAnomaly > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                {rainfallAnomaly > 0 ? '+' : ''}{rainfallAnomaly}% {rainfallAnomaly > 20 ? '⚠️' : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Drainage Stress:</span>
              <span className={`font-semibold ${drainageStress > 60 ? 'text-red-600' : drainageStress > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                {drainageStress}% capacity used
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Historical Flood Events:</span>
              <span className="font-semibold text-gray-800">{historicalEvents} incidents</span>
            </div>
          </div>
        </div>

        {/* WHAT Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📊</span>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">What to expect?</h4>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Surface Water Accumulation:</span>
              <span className={`font-semibold px-2 py-1 rounded ${hasWaterLogging ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {hasWaterLogging ? 'Likely' : 'Unlikely'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Disruption Level:</span>
              <span className={`font-semibold px-2 py-1 rounded ${
                disruptionLevel === 'High' ? 'bg-red-100 text-red-700' : 
                disruptionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-green-100 text-green-700'
              }`}>
                {disruptionLevel}
              </span>
            </div>
          </div>
        </div>

        {/* HOW Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚡</span>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">How to respond?</h4>
          </div>
          <div className="bg-green-50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className={`font-bold ${needsPumps ? 'text-red-600' : 'text-gray-400'}`}>
                {needsPumps ? '✓' : '○'}
              </span>
              <div className="flex-1">
                <span className={needsPumps ? 'text-gray-800 font-semibold' : 'text-gray-500'}>
                  Deploy Mobile Pumps
                </span>
                {needsPumps && <p className="text-xs text-gray-600 mt-1">Immediate deployment recommended</p>}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className={`font-bold ${needsDrainCleaning ? 'text-orange-600' : 'text-gray-400'}`}>
                {needsDrainCleaning ? '✓' : '○'}
              </span>
              <div className="flex-1">
                <span className={needsDrainCleaning ? 'text-gray-800 font-semibold' : 'text-gray-500'}>
                  Priority Drain Cleaning
                </span>
                {needsDrainCleaning && <p className="text-xs text-gray-600 mt-1">Clear blocked drains within 24h</p>}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className={`font-bold ${needsTrafficAdvisory ? 'text-blue-600' : 'text-gray-400'}`}>
                {needsTrafficAdvisory ? '✓' : '○'}
              </span>
              <div className="flex-1">
                <span className={needsTrafficAdvisory ? 'text-gray-800 font-semibold' : 'text-gray-500'}>
                  Traffic Advisory Required
                </span>
                {needsTrafficAdvisory && <p className="text-xs text-gray-600 mt-1">Issue public alert for route diversions</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Risk Score Summary */}
        <div className="bg-gray-100 rounded-lg p-3 border-l-4 border-blue-600">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Overall Risk Score:</span>
            <span className={`text-2xl font-bold ${
              ward.riskIndex > 70 ? 'text-red-600' : 
              ward.riskIndex > 40 ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {Math.round(ward.riskIndex)}/100
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Category: <span className="font-semibold">{ward.riskCategory}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DecisionTrace;
