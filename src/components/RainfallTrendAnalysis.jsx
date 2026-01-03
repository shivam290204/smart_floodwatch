import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchRainfallStats } from '../services/mcdService';

const RainfallTrendAnalysis = ({ selectedMonth }) => {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map short month names to CSV column names
  const monthMap = {
    'Jun': 'June',
    'Jul': 'July',
    'Aug': 'Aug',
    'Sep': 'Sept',
    'Oct': 'Oct',
  };

  useEffect(() => {
    loadTrendData();
  }, [selectedMonth]);

  const loadTrendData = async () => {
    setLoading(true);
    try {
      const stats = await fetchRainfallStats();
      setTrendData(stats);
      setError(null);
    } catch (err) {
      console.error('Error loading rainfall data:', err);
      setError('Failed to load rainfall data');
    }
    setLoading(false);
  };

  if (error) {
    return <div className="bg-red-50 rounded-lg shadow-md p-4 text-red-700">{error}</div>;
  }

  if (loading || !trendData) {
    return <div className="bg-white rounded-lg shadow-md p-4">Loading...</div>;
  }

  const csvMonthName = monthMap[selectedMonth] || 'July';
  const northCurrent = trendData.northLatest[csvMonthName] || 0;
  const southCurrent = trendData.southLatest[csvMonthName] || 0;
  const avgRainfall = (northCurrent + southCurrent) / 2;

  // Historical normal (based on monsoon average)
  const normalRainfall = (trendData.monsoonAvgNorth + trendData.monsoonAvgSouth) / 2;
  const anomaly = ((avgRainfall - normalRainfall) / normalRainfall) * 100;

  const chartData = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'North Delhi',
        data: ['June', 'July', 'Aug', 'Sept', 'Oct'].map(m => trendData.northLatest[m] || 0),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'South Delhi',
        data: ['June', 'July', 'Aug', 'Sept', 'Oct'].map(m => trendData.southLatest[m] || 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
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
        text: `Monsoon ${trendData.latestYear} - Regional Rainfall Pattern`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Rainfall (mm)',
        },
      },
    },
  };

  const getAnomalyColor = (value) => {
    if (value > 30) return 'text-red-600 bg-red-50';
    if (value > 10) return 'text-orange-600 bg-orange-50';
    if (value < -10) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  const getAnomalyIcon = (value) => {
    if (value > 30) return '🌊';
    if (value > 10) return '⚠️';
    if (value < -10) return '☀️';
    return '✅';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800">📈 Rainfall Trend Analysis</h3>
          <p className="text-xs text-gray-600">North vs South Delhi - Monsoon {trendData.latestYear}</p>
        </div>
        <div className={`px-3 py-2 rounded-lg font-bold text-sm ${getAnomalyColor(anomaly)}`}>
          {getAnomalyIcon(anomaly)} {anomaly > 0 ? '+' : ''}{anomaly.toFixed(1)}% vs Normal
        </div>
      </div>

      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="text-xs text-gray-600 mb-1">North Delhi - {selectedMonth}</div>
          <div className="text-2xl font-bold text-blue-700">{northCurrent.toFixed(1)} mm</div>
          <div className="text-xs text-gray-600 mt-1">
            {((northCurrent / trendData.monsoonAvgNorth - 1) * 100).toFixed(0)}% vs seasonal avg
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="text-xs text-gray-600 mb-1">South Delhi - {selectedMonth}</div>
          <div className="text-2xl font-bold text-green-700">{southCurrent.toFixed(1)} mm</div>
          <div className="text-xs text-gray-600 mt-1">
            {((southCurrent / trendData.monsoonAvgSouth - 1) * 100).toFixed(0)}% vs seasonal avg
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200">
        <div className="flex items-start gap-2">
          <span className="text-xl">💡</span>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800 mb-1">Regional Insight</h4>
            <p className="text-xs text-gray-700">
              {northCurrent > southCurrent 
                ? `North Delhi receiving ${((northCurrent - southCurrent) / southCurrent * 100).toFixed(0)}% more rainfall. Prioritize drainage in northern wards.`
                : `South Delhi receiving ${((southCurrent - northCurrent) / northCurrent * 100).toFixed(0)}% more rainfall. Focus resources on southern wards.`}
            </p>
          </div>
        </div>
      </div>

      {anomaly > 20 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <p className="text-sm font-semibold text-red-800">
            🚨 High Rainfall Alert: Current precipitation is significantly above normal. Expect elevated flood risk across Delhi.
          </p>
        </div>
      )}
    </div>
  );
};

export default RainfallTrendAnalysis;
