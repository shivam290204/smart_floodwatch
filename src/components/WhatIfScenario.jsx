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
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🔮</span>
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-800">
          What-If Rainfall Scenarios
        </h3>
      </div>

      <p className="text-xs text-gray-600 mb-3">
        Simulate different rainfall conditions and see impact on flood risk
      </p>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {scenarios.map((scenario) => (
          <button
            key={scenario.value}
            onClick={() => handleScenarioClick(scenario.value)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedScenario === scenario.value
                ? scenario.color + ' shadow-md transform scale-105'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">{scenario.icon}</div>
            <div className="text-xs font-bold">{scenario.label}</div>
          </button>
        ))}
      </div>

      {/* Scenario Results */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-700">Scenario Rainfall:</span>
          <span className="font-bold text-gray-900">
            {adjustedRainfall.toFixed(1)} mm
            {selectedScenario > 0 && (
              <span className="text-xs text-red-600 ml-1">
                (+{(adjustedRainfall - baseRainfall).toFixed(1)})
              </span>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-700">Projected Risk Score:</span>
          <span className={`font-bold text-lg ${
            riskIndex > 70 ? 'text-red-600' : riskIndex > 40 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {Math.round(riskIndex)}/100
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-700">Risk Category:</span>
          <span className={`px-2 py-1 rounded font-semibold text-xs ${
            riskCategory === 'High' ? 'bg-red-100 text-red-700' :
            riskCategory === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {riskCategory}
          </span>
        </div>
      </div>

      {/* Warning if scenario increases risk significantly */}
      {selectedScenario > 0 && riskIndex > 70 && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2">
          <p className="text-xs font-semibold text-red-800">
            ⚠️ Warning: This scenario elevates risk to HIGH. Pre-position emergency resources.
          </p>
        </div>
      )}

      {selectedScenario > 0 && riskCategory === 'High' && (
        <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-2">
          <p className="text-xs font-semibold text-orange-800">
            📋 Recommended: Update emergency response plan for increased rainfall
          </p>
        </div>
      )}
    </div>
  );
};

export default WhatIfScenario;
