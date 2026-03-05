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
    return <div className="bg-red-50 border border-red-300 p-4 text-red-800 font-bold uppercase text-sm">{error}</div>;
  }

  if (loading || !trendData) {
    return <div className="bg-white border border-gray-300 shadow-sm p-4 font-bold uppercase text-gray-700">Loading...</div>;
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
    if (value > 30) return 'text-red-800 bg-red-50 border-red-300';
    if (value > 10) return 'text-orange-800 bg-orange-50 border-orange-300';
    if (value < -10) return 'text-blue-800 bg-blue-50 border-blue-300';
    return 'text-green-800 bg-green-50 border-green-300';
  };

  return (
    <div className="bg-white border border-gray-300 shadow-sm">
      <div className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between border-b border-gray-300">
        <div>
          <h3 className="font-bold text-lg uppercase tracking-wide">Rainfall Trend Analysis</h3>
          <p className="text-xs text-blue-200 uppercase">North vs South Delhi - Monsoon {trendData.latestYear}</p>
        </div>
        <div className={`px-3 py-1 border font-bold text-xs uppercase ${getAnomalyColor(anomaly)}`}>
          {anomaly > 0 ? '+' : ''}{anomaly.toFixed(1)}% VS NORMAL
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="h-64 border border-gray-200 p-2 bg-gray-50">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-300 p-3 border-t-4 border-t-blue-700">
            <div className="text-xs text-gray-700 mb-1 font-bold uppercase">North Delhi - {selectedMonth}</div>
            <div className="text-2xl font-bold text-gray-900">{northCurrent.toFixed(1)} mm</div>
            <div className="text-xs text-gray-600 mt-1 font-semibold uppercase">
              {((northCurrent / trendData.monsoonAvgNorth - 1) * 100).toFixed(0)}% vs seasonal avg
            </div>
          </div>
          <div className="bg-white border border-gray-300 p-3 border-t-4 border-t-green-600">
            <div className="text-xs text-gray-700 mb-1 font-bold uppercase">South Delhi - {selectedMonth}</div>
            <div className="text-2xl font-bold text-gray-900">{southCurrent.toFixed(1)} mm</div>
            <div className="text-xs text-gray-600 mt-1 font-semibold uppercase">
              {((southCurrent / trendData.monsoonAvgSouth - 1) * 100).toFixed(0)}% vs seasonal avg
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 p-3">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <h4 className="font-bold text-sm text-yellow-900 mb-1 uppercase">Regional Insight</h4>
              <p className="text-xs text-yellow-800 font-semibold">
                {northCurrent > southCurrent 
                  ? `NORTH DELHI RECEIVING ${((northCurrent - southCurrent) / southCurrent * 100).toFixed(0)}% MORE RAINFALL. PRIORITIZE DRAINAGE IN NORTHERN WARDS.`
                  : `SOUTH DELHI RECEIVING ${((southCurrent - northCurrent) / northCurrent * 100).toFixed(0)}% MORE RAINFALL. FOCUS RESOURCES ON SOUTHERN WARDS.`}
              </p>
            </div>
          </div>
        </div>

        {anomaly > 20 && (
          <div className="bg-red-50 border border-red-300 border-l-4 border-l-red-700 p-3">
            <p className="text-sm font-bold text-red-900 uppercase">
              HIGH RAINFALL ALERT: CURRENT PRECIPITATION IS SIGNIFICANTLY ABOVE NORMAL. EXPECT ELEVATED FLOOD RISK ACROSS DELHI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RainfallTrendAnalysis;
