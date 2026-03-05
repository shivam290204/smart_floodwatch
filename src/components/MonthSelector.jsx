import React, { useState } from 'react';
import { Calendar, History, RefreshCw } from 'lucide-react';

const MonthSelector = ({ selectedMonth, onMonthChange, isLoading = false }) => {
  const [tempMonth, setTempMonth] = useState(selectedMonth);
  
  const months = [
    { value: 'Jun', label: 'June', phase: 'Pre-Monsoon', riskLevel: 'Medium' },
    { value: 'Jul', label: 'July', phase: 'Peak Monsoon', riskLevel: 'High' },
    { value: 'Aug', label: 'August', phase: 'Peak Monsoon', riskLevel: 'Critical' },
    { value: 'Sep', label: 'September', phase: 'Subsiding', riskLevel: 'Medium' },
    { value: 'Oct', label: 'October', phase: 'Post-Monsoon', riskLevel: 'Low' },
  ];

  const handleSubmit = () => {
    if (tempMonth !== selectedMonth) {
      onMonthChange(tempMonth);
    }
  };

  const hasChanges = tempMonth !== selectedMonth;
  const selectedMonthData = months.find(m => m.value === tempMonth);
  const currentMonthData = months.find(m => m.value === selectedMonth);

  return (
    <div className="bg-white border border-gray-300 shadow-sm p-0 mb-4 overflow-hidden">
      {/* Left Border Accent */}
      <div className="flex h-full">
        <div className="w-1 bg-blue-900"></div>
        <div className="flex-1 p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 border-b border-gray-300 pb-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 border border-gray-300 flex items-center justify-center flex-shrink-0">
                <History className="w-5 h-5 text-gray-800" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Historical Data Context</h3>
                <p className="text-xs text-gray-700 mt-1 max-w-xs font-semibold uppercase">
                  Select a monsoon phase to load historical rainfall patterns and risk models.
                </p>
              </div>
            </div>
          </div>

          {/* Month Selection Controls */}
          <div className="space-y-3">
            {/* Label */}
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              <Calendar className="w-4 h-4 inline-block mr-2 -mt-0.5" />
              Analysis Period
            </label>

            {/* Month Selector Dropdown */}
            <select
              value={tempMonth}
              onChange={(e) => setTempMonth(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-gray-50 text-sm font-bold text-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors uppercase"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label} - {month.phase}
                </option>
              ))}
            </select>

            {/* Risk Level Indicator */}
            {selectedMonthData && (
              <div className="bg-gray-50 border border-gray-300 p-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 uppercase">Risk Level</span>
                <span className={`text-xs font-bold px-2 py-1 border uppercase ${
                  selectedMonthData.riskLevel === 'Critical' 
                    ? 'bg-red-50 text-red-800 border-red-300'
                    : selectedMonthData.riskLevel === 'High'
                    ? 'bg-orange-50 text-orange-800 border-orange-300'
                    : selectedMonthData.riskLevel === 'Medium'
                    ? 'bg-yellow-50 text-yellow-800 border-yellow-300'
                    : 'bg-green-50 text-green-800 border-green-300'
                }`}>
                  {selectedMonthData.riskLevel}
                </span>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !hasChanges}
              className={`w-full px-4 py-2.5 font-bold text-sm transition-all flex items-center justify-center gap-2 border uppercase tracking-wide ${
                isLoading || !hasChanges
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                  : 'bg-blue-900 text-white hover:bg-blue-800 active:bg-blue-950 border-blue-950'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading Data...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Load Data</span>
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {hasChanges && !isLoading && (
            <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700 font-medium">
              Changing period to {selectedMonthData?.label}. Click "Load Data" to apply changes.
            </div>
          )}

          {!hasChanges && currentMonthData && (
            <div className="mt-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 font-medium">
              Current period: <span className="text-gray-900 font-semibold">{currentMonthData.label} {new Date().getFullYear()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthSelector;
