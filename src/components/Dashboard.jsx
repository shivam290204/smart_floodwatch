import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import RiskCard from './RiskCard';
import MonthSelector from './MonthSelector';
import PredictionBox from './PredictionBox';
import TimeToFlood from './TimeToFlood';
import WhatIfScenario from './WhatIfScenario';
import { useState, useEffect } from 'react';
import { fetchDashboardData } from '../services/mcdService';
import { useDataContext } from '../context/DataContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { selectedMonth, setSelectedMonth: setContextMonth } = useDataContext();
  const [data, setData] = useState({
    riskCounts: { high: 0, medium: 0, low: 0 },
    totalRainfall: 0,
    activeHotspots: 0,
    vulnerableWards: [],
    rainfallTrend: [],
    complaintsTrend: []
  });
  const [scenarioData, setScenarioData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [selectedMonth]);

  const loadDashboardData = async () => {
    const dashboardData = await fetchDashboardData();
    setData(dashboardData);
  };

  const handleMonthChange = (month) => {
    setContextMonth(month);
  };

  const barChartData = {
    labels: data.vulnerableWards.map(w => `Ward ${w.wardId}`),
    datasets: [
      {
        label: 'Risk Index',
        data: data.vulnerableWards.map(w => w.riskIndex),
        backgroundColor: '#3b82f6',
        borderColor: '#1e40af',
        borderWidth: 1,
      },
      {
        label: 'Rainfall (mm)',
        data: data.vulnerableWards.map(w => w.rainfall),
        backgroundColor: '#22c55e',
        borderColor: '#16a34a',
        borderWidth: 1,
      }
    ],
  };

  const lineChartData = {
    labels: ['6am', '9am', '12pm', '3pm', '6pm'],
    datasets: [
      {
        label: 'Rainfall Intensity (mm/hr)',
        data: data.rainfallTrend,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Flood Complaints',
        data: data.complaintsTrend,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  return (
    <div className="space-y-6">
      <MonthSelector selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
      
      <PredictionBox highRiskCount={data.riskCounts.high} />

      {data.vulnerableWards.length > 0 && (
        <>
          <WhatIfScenario
            baseRainfall={data.vulnerableWards[0]?.rainfall || 50}
            drainageDeficit={data.vulnerableWards[0]?.drainageDeficit || 40}
            complaints={10}
            onScenarioChange={(scenario) => setScenarioData(scenario)}
          />
          
          <TimeToFlood 
            ward={data.vulnerableWards[0] || { 
              rainfall: 50, 
              drainageDeficit: 40, 
              riskIndex: 60 
            }} 
          />
        </>
      )}
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Monsoon Flood Risk Assessment Dashboard
          <span className="text-sm font-normal text-gray-500 block mt-1">
            Real-time decision support for Delhi Municipal Corporation
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <RiskCard 
            title="High-Risk Wards" 
            value={data.riskCounts.high} 
            change="+2 today"
            color="red"
            icon="⚠️"
          />
          <RiskCard 
            title="Active Hotspots" 
            value={data.activeHotspots} 
            change="-1 resolved"
            color="yellow"
            icon="📍"
          />
          <RiskCard 
            title="Avg Rainfall" 
            value={`${data.totalRainfall} mm`} 
            change="+15mm since yesterday"
            color="blue"
            icon="🌧️"
          />
          <RiskCard 
            title="Response Teams" 
            value="12 deployed" 
            change="3 on standby"
            color="green"
            icon="🚨"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Top 5 Vulnerable Wards</h3>
            <div className="h-64">
              <Bar 
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">24-Hour Trends</h3>
            <div className="h-64">
              <Line 
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Priority Action Required</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ward</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rainfall</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drainage Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.vulnerableWards.slice(0, 5).map((ward) => (
                  <tr key={ward.wardId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">Ward {ward.wardId}</div>
                      <div className="text-sm text-gray-500">{ward.wardName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ward.riskCategory === 'High' ? 'bg-red-100 text-red-800' :
                        ward.riskCategory === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ward.riskCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{ward.rainfall} mm</div>
                      <div className="text-sm text-gray-500">Last 24h</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              ward.drainageDeficit > 70 ? 'bg-red-500' :
                              ward.drainageDeficit > 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${ward.drainageDeficit}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">{ward.drainageDeficit}% deficit</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                        Deploy Team
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">System Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flood-alert p-4 rounded-lg">
            <h4 className="font-bold text-red-600 mb-2">⚠️ Immediate Action Required</h4>
            <p className="text-sm">Wards 45, 67, 89 exceed critical risk threshold. Recommend deployment of 3 additional pump sets.</p>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-600 mb-2">📈 Rising Trend Detected</h4>
            <p className="text-sm">Rainfall intensity increasing in North Delhi. Prepare for possible escalation to high risk.</p>
          </div>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <h4 className="font-bold text-green-600 mb-2">✅ Resources Optimized</h4>
            <p className="text-sm">Drain clearance completed in 8 medium-risk wards. Resources available for reallocation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
