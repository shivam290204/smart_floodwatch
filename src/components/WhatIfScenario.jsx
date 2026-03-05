import React from 'react';
import { calculateRiskIndex, getRiskCategory } from '../utils/riskCalculator';

const WhatIfScenario = ({ baseRainfall, drainageDeficit, complaints, onScenarioChange }) => {
  const scenarios = [
    { label: 'Base', value: 0, icon: '📊', color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { label: '+10%', value: 10, icon: '🌦️', color: 'bg-green-100 border-green-300 text-green-800' },
    { label: '+25%', value: 25, icon: '🌧️', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { label: '+50%', value: 50, icon: '⛈️', color: 'bg-red-100 border-red-300 text-red-800' },
  ];

  const [selectedScenario, setSelectedScenario] = React.useState(0);

  const handleScenarioClick = (scenarioValue) => {
    setSelectedScenario(scenarioValue);
    const adjustedRainfall = baseRainfall * (1 + scenarioValue / 100);
    const newRiskIndex = calculateRiskIndex(adjustedRainfall, drainageDeficit, complaints);
    const newRiskCategory = getRiskCategory(newRiskIndex);
    
    if (onScenarioChange) {
      onScenarioChange({
        scenario: scenarioValue,
        rainfall: adjustedRainfall,
        riskIndex: newRiskIndex,
        riskCategory: newRiskCategory,
      });
    }
  };

  const getCurrentScenarioData = () => {
    const adjustedRainfall = baseRainfall * (1 + selectedScenario / 100);
    const riskIndex = calculateRiskIndex(adjustedRainfall, drainageDeficit, complaints);
    const riskCategory = getRiskCategory(riskIndex);
    return { adjustedRainfall, riskIndex, riskCategory };
  };

  const { adjustedRainfall, riskIndex, riskCategory } = getCurrentScenarioData();

  return (
    <div className="bg-white border border-gray-300 shadow-sm">
      <div className="bg-blue-900 text-white px-3 py-2 border-b border-gray-300">
        <h3 className="font-bold text-sm uppercase tracking-wide">
          What-If Rainfall Scenarios
        </h3>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-700 mb-3 uppercase font-semibold">
          Simulate different rainfall conditions and see impact on flood risk
        </p>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.value}
              onClick={() => handleScenarioClick(scenario.value)}
              className={`p-2 border transition-all ${
                selectedScenario === scenario.value
                  ? scenario.color + ' border-2'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs font-bold uppercase">{scenario.label}</div>
            </button>
          ))}
        </div>

        {/* Scenario Results */}
        <div className="bg-gray-50 border border-gray-300 p-3 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-800 font-semibold uppercase">Scenario Rainfall:</span>
            <span className="font-bold text-gray-900">
              {adjustedRainfall.toFixed(1)} mm
              {selectedScenario > 0 && (
                <span className="text-xs text-red-700 ml-1">
                  (+{(adjustedRainfall - baseRainfall).toFixed(1)})
                </span>
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-800 font-semibold uppercase">Projected Risk Score:</span>
            <span className={`font-bold text-lg ${
              riskIndex > 70 ? 'text-red-700' : riskIndex > 40 ? 'text-yellow-700' : 'text-green-700'
            }`}>
              {Math.round(riskIndex)}/100
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-800 font-semibold uppercase">Risk Category:</span>
            <span className={`px-2 py-1 border font-bold text-xs uppercase ${
              riskCategory === 'High' ? 'bg-red-50 text-red-800 border-red-300' :
              riskCategory === 'Medium' ? 'bg-yellow-50 text-yellow-800 border-yellow-300' :
              'bg-green-50 text-green-800 border-green-300'
            }`}>
              {riskCategory}
            </span>
        </div>
      </div>

      {/* Warning if scenario increases risk significantly */}
      {selectedScenario > 0 && riskIndex > 70 && (
        <div className="mt-3 bg-red-50 border border-red-300 p-2">
          <p className="text-xs font-bold text-red-900 uppercase">
            WARNING: THIS SCENARIO ELEVATES RISK TO HIGH. PRE-POSITION EMERGENCY RESOURCES.
          </p>
        </div>
      )}

      {selectedScenario > 0 && riskCategory === 'High' && (
        <div className="mt-3 bg-orange-50 border border-orange-300 p-2">
          <p className="text-xs font-bold text-orange-900 uppercase">
            RECOMMENDED: UPDATE EMERGENCY RESPONSE PLAN FOR INCREASED RAINFALL
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default WhatIfScenario;
