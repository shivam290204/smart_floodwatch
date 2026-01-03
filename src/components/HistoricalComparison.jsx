import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const HistoricalComparison = () => {
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistoricalData();
  }, []);

  const loadHistoricalData = async () => {
    try {
      const [northRes, southRes] = await Promise.all([
        fetch('/data/north_rainfall.csv'),
        fetch('/data/south_rainfall.csv'),
      ]);

      const northText = await northRes.text();
      const southText = await southRes.text();

      const parseCSV = (text) => {
        const lines = text.trim().split(/\r?\n/);
        const headers = lines[0].split(',').map(h => h.trim());
        return lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const row = {};
          headers.forEach((h, i) => {
            row[h] = isNaN(values[i]) ? values[i] : parseFloat(values[i]);
          });
          return row;
        });
      };

      const northData = parseCSV(northText);
      const southData = parseCSV(southText);

      // Function to calculate total rainfall from monthly data
      const calculateTotal = (row) => {
        const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return months.reduce((sum, month) => {
          const value = parseFloat(row[month]) || 0;
          return sum + value;
        }, 0);
      };

      // Get last 5 years
      const recentYears = northData.slice(-5);
      const years = recentYears.map(r => r.Year);
      const northTotals = recentYears.map(r => calculateTotal(r));
      const southTotals = southData.slice(-5).map(r => calculateTotal(r));
      const combinedTotals = northTotals.map((north, idx) => north + southTotals[idx]);

      setHistoricalData({
        years,
        northTotals,
        southTotals,
        combinedTotals,
        avgNorth: northTotals.reduce((a, b) => a + b, 0) / northTotals.length,
        avgSouth: southTotals.reduce((a, b) => a + b, 0) / southTotals.length,
        avgCombined: combinedTotals.reduce((a, b) => a + b, 0) / combinedTotals.length,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading historical data:', error);
      setLoading(false);
    }
  };

  if (loading || !historicalData) {
    return <div className="bg-white rounded-lg shadow-md p-4">Loading historical data...</div>;
  }

  const chartData = {
    labels: historicalData.years,
    datasets: [
      {
        label: 'North Delhi',
        data: historicalData.northTotals,
        backgroundColor: '#3b82f6',
        borderColor: '#1e40af',
        borderWidth: 1,
      },
      {
        label: 'South Delhi',
        data: historicalData.southTotals,
        backgroundColor: '#10b981',
        borderColor: '#047857',
        borderWidth: 1,
      },
      {
        label: 'Total Delhi (North + South)',
        data: historicalData.combinedTotals,
        backgroundColor: '#8b5cf6',
        borderColor: '#6d28d9',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Total Monsoon Rainfall - 5 Year Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Rainfall (mm)',
        },
      },
    },
  };

  const currentYear = historicalData.years[historicalData.years.length - 1];
  const currentNorth = historicalData.northTotals[historicalData.northTotals.length - 1];
  const currentSouth = historicalData.southTotals[historicalData.southTotals.length - 1];
  const currentCombined = historicalData.combinedTotals[historicalData.combinedTotals.length - 1];

  const northChange = ((currentNorth - historicalData.avgNorth) / historicalData.avgNorth) * 100;
  const southChange = ((currentSouth - historicalData.avgSouth) / historicalData.avgSouth) * 100;
  const combinedChange = ((currentCombined - historicalData.avgCombined) / historicalData.avgCombined) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div>
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <span>📅</span> Historical Rainfall Comparison
        </h3>
        <p className="text-xs text-gray-600">5-Year Monsoon Trend Analysis</p>
      </div>

      <div className="h-64">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-lg p-3 border-2 ${
          northChange > 0 ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'
        }`}>
          <div className="text-xs text-gray-600 mb-1">North Delhi {currentYear}</div>
          <div className={`text-2xl font-bold ${northChange > 0 ? 'text-red-700' : 'text-blue-700'}`}>
            {currentNorth.toFixed(0)} mm
          </div>
          <div className="text-xs font-semibold mt-1">
            {northChange > 0 ? '↑' : '↓'} {Math.abs(northChange).toFixed(1)}% vs 5-yr avg
          </div>
        </div>

        <div className={`rounded-lg p-3 border-2 ${
          southChange > 0 ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'
        }`}>
          <div className="text-xs text-gray-600 mb-1">South Delhi {currentYear}</div>
          <div className={`text-2xl font-bold ${southChange > 0 ? 'text-red-700' : 'text-blue-700'}`}>
            {currentSouth.toFixed(0)} mm
          </div>
          <div className="text-xs font-semibold mt-1">
            {southChange > 0 ? '↑' : '↓'} {Math.abs(southChange).toFixed(1)}% vs 5-yr avg
          </div>
        </div>

        <div className={`rounded-lg p-3 border-2 ${
          combinedChange > 0 ? 'bg-red-50 border-red-300' : 'bg-purple-50 border-purple-300'
        }`}>
          <div className="text-xs text-gray-600 mb-1">Total Delhi {currentYear}</div>
          <div className={`text-2xl font-bold ${combinedChange > 0 ? 'text-red-700' : 'text-purple-700'}`}>
            {currentCombined.toFixed(0)} mm
          </div>
          <div className="text-xs font-semibold mt-1">
            {combinedChange > 0 ? '↑' : '↓'} {Math.abs(combinedChange).toFixed(1)}% vs 5-yr avg
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-indigo-200">
        <div className="flex items-start gap-2">
          <span className="text-xl">🔍</span>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800 mb-1">Trend Analysis</h4>
            <p className="text-xs text-gray-700">
              {northChange > 10 || southChange > 10 
                ? `⚠️ Above-average monsoon detected. Historical data shows increased flood risk in years with >10% excess rainfall.`
                : northChange < -10 || southChange < -10
                ? `✅ Below-average rainfall. Lower flood risk expected, but maintain monitoring for localized heavy showers.`
                : `📊 Normal monsoon pattern. Standard flood preparedness protocols recommended.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalComparison;
