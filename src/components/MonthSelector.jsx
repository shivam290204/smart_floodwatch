import React, { useState } from 'react';

const MonthSelector = ({ selectedMonth, onMonthChange }) => {
  const [tempMonth, setTempMonth] = useState(selectedMonth);
  
  const months = [
    { value: 'Jun', label: 'June', rainfall: 0.8 },
    { value: 'Jul', label: 'July', rainfall: 1.2 },
    { value: 'Aug', label: 'August', rainfall: 1.0 },
    { value: 'Sep', label: 'September', rainfall: 0.6 },
  ];

  const handleSubmit = () => {
    onMonthChange(tempMonth);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        📅 Select Monsoon Month
      </label>
      <div className="flex gap-2">
        <select
          value={tempMonth}
          onChange={(e) => setTempMonth(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Risk calculation updates based on historical monsoon data
      </p>
    </div>
  );
};

export default MonthSelector;
