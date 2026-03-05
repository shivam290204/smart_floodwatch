import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import RiskCard from './RiskCard';
import MonthSelector from './MonthSelector';
import PredictionBox from './PredictionBox';
import TimeToFlood from './TimeToFlood';
import WhatIfScenario from './WhatIfScenario';
import DownloadReportBtn from './DownloadReportBtn';
import { useState, useEffect } from 'react';
import { fetchDashboardData } from '../services/mcdService';
import { useDataContext } from '../context/DataContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// Monthly Scenarios Dictionary - Historical Data for Time-Travel Simulator
const monthlyScenarios = {
  Jun: {
    risk: 'Medium',
    riskLevel: 'medium',
    rainfall: 85,
    status: 'Pre-Monsoon Prep',
    riskCounts: { high: 3, medium: 8, low: 12 },
    activeHotspots: 5,
    rainfallTrend: [8, 12, 15, 20, 18],
    complaintsTrend: [5, 8, 10, 12, 9],
    statusMessage: 'Systems on standby. Drainage networks being inspected.',
    teamStatus: '8 deployed',
    teamStandby: '5 on standby'
  },
  Jul: {
    risk: 'High',
    riskLevel: 'high',
    rainfall: 289,
    status: 'Active Flood Response',
    riskCounts: { high: 12, medium: 6, low: 5 },
    activeHotspots: 18,
    rainfallTrend: [45, 62, 78, 85, 72],
    complaintsTrend: [28, 42, 55, 48, 38],
    statusMessage: 'Peak monsoon. Multiple response teams deployed across city.',
    teamStatus: '15 deployed',
    teamStandby: '2 on standby'
  },
  Aug: {
    risk: 'Critical',
    riskLevel: 'critical',
    rainfall: 240,
    status: 'Drainage Overflow',
    riskCounts: { high: 15, medium: 5, low: 3 },
    activeHotspots: 22,
    rainfallTrend: [58, 72, 88, 95, 82],
    complaintsTrend: [42, 58, 72, 68, 55],
    statusMessage: 'Critical overflow detected. Emergency protocols activated.',
    teamStatus: '18 deployed',
    teamStandby: '0 on standby'
  },
  Sep: {
    risk: 'Medium',
    riskLevel: 'medium',
    rainfall: 152,
    status: 'Subsiding Conditions',
    riskCounts: { high: 6, medium: 10, low: 7 },
    activeHotspots: 12,
    rainfallTrend: [28, 35, 42, 38, 30],
    complaintsTrend: [18, 22, 28, 24, 19],
    statusMessage: 'Rainfall decreasing. Recovery operations underway.',
    teamStatus: '10 deployed',
    teamStandby: '4 on standby'
  },
  Oct: {
    risk: 'Low',
    riskLevel: 'low',
    rainfall: 12,
    status: 'Post-Monsoon Maintenance',
    riskCounts: { high: 1, medium: 3, low: 19 },
    activeHotspots: 2,
    rainfallTrend: [2, 3, 5, 4, 2],
    complaintsTrend: [1, 2, 3, 2, 1],
    statusMessage: 'Maintenance phase. Infrastructure repairs in progress.',
    teamStatus: '5 deployed',
    teamStandby: '8 on standby'
  }
};

const Dashboard = () => {
  const { selectedMonth, setSelectedMonth: setContextMonth } = useDataContext();
  const [currentMonth, setCurrentMonth] = useState('Jul');
  const [data, setData] = useState({
    riskCounts: { high: 0, medium: 0, low: 0 },
    totalRainfall: 0,
    activeHotspots: 0,
    vulnerableWards: [],
    rainfallTrend: [],
    complaintsTrend: []
  });
  const [scenarioData, setScenarioData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [selectedMonth, currentMonth]);

  const loadDashboardData = async () => {
    const dashboardData = await fetchDashboardData();
    
    // Merge API data with scenario data
    const scenario = monthlyScenarios[currentMonth];
    if (scenario) {
      setData({
        ...dashboardData,
        riskCounts: scenario.riskCounts,
        totalRainfall: scenario.rainfall,
        activeHotspots: scenario.activeHotspots,
        rainfallTrend: scenario.rainfallTrend,
        complaintsTrend: scenario.complaintsTrend
      });
    } else {
      setData(dashboardData);
    }
  };

  const handleMonthChange = async (month) => {
    setIsLoading(true);
    setContextMonth(month);
    setCurrentMonth(month);
    
    // Simulate API delay for realistic "database query" feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    await loadDashboardData();
    setIsLoading(false);
  };

  // Get current scenario data
  const currentScenario = monthlyScenarios[currentMonth] || monthlyScenarios.Jul;

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
    <div className="space-y-6 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white border-2 border-blue-900 p-6 max-w-sm mx-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent animate-spin"></div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wide">Loading Data...</h3>
                <p className="text-sm text-gray-700 mt-1 font-semibold uppercase">Historical Data for {currentMonth}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <MonthSelector 
        selectedMonth={currentMonth} 
        onMonthChange={handleMonthChange}
        isLoading={isLoading}
      />
      
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
      
      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="bg-blue-900 text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-300">
          <div>
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide">
              Monsoon Flood Risk Assessment Dashboard
              <span className="text-xs sm:text-sm font-normal text-blue-200 block mt-1 uppercase">
                Real-time decision support for Delhi Municipal Corporation
              </span>
            </h2>
          </div>
          <DownloadReportBtn />
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-8">
          <RiskCard 
            title="Risk Level" 
            value={currentScenario.risk}
            change={currentScenario.status}
            color={currentScenario.riskLevel === 'critical' ? 'red' : currentScenario.riskLevel === 'high' ? 'red' : currentScenario.riskLevel === 'medium' ? 'yellow' : 'blue'}
            icon="▲"
            riskLevel={currentScenario.riskLevel}
          />
          <RiskCard 
            title="Hotspots" 
            value={data.activeHotspots} 
            change="High Risk Areas"
            color="yellow"
            icon="●"
          />
          <RiskCard 
            title="Rainfall" 
            value={`${data.totalRainfall}mm`} 
            change={`${currentMonth} avg`}
            color="blue"
            icon="💧"
            rainfallAmount={data.totalRainfall}
          />
          <RiskCard 
            title="Response" 
            value={currentScenario.teamStatus.split(' ')[0]} 
            change="Active Teams"
            color="blue"
            icon="▸"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white border border-gray-300">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Top 5 Vulnerable Wards</h3>
            </div>
            <div className="p-3 h-48 sm:h-56 md:h-64">
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

          <div className="bg-white border border-gray-300">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-2">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">24-Hour Trends</h3>
            </div>
            <div className="p-3 h-48 sm:h-56 md:h-64">
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

        <div className="bg-white border border-gray-300">
          <div className="bg-gray-100 border-b border-gray-300 px-3 py-2">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Priority Action Required</h3>
          </div>
          <div className="overflow-x-auto text-xs sm:text-sm">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Ward</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Risk Level</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Rainfall</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Drainage Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.vulnerableWards.slice(0, 5).map((ward) => (
                  <tr key={ward.wardId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-gray-900 uppercase">Ward {ward.wardId}</div>
                      <div className="text-xs text-gray-600 uppercase">{ward.wardName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-bold uppercase border ${
                        ward.riskCategory === 'High' ? 'bg-red-50 text-red-800 border-red-300' :
                        ward.riskCategory === 'Medium' ? 'bg-yellow-50 text-yellow-800 border-yellow-300' :
                        'bg-green-50 text-green-800 border-green-300'
                      }`}>
                        {ward.riskCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{ward.rainfall} mm</div>
                      <div className="text-xs text-gray-600 uppercase">Last 24h</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 h-2 border border-gray-300">
                          <div 
                            className={`h-full ${
                              ward.drainageDeficit > 70 ? 'bg-red-700' :
                              ward.drainageDeficit > 40 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${ward.drainageDeficit}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs font-bold text-gray-700 uppercase">{ward.drainageDeficit}% Deficit</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button className="px-3 py-1 bg-blue-900 text-white text-xs font-bold uppercase hover:bg-blue-800 transition border border-blue-950">
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
      </div>

      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="bg-blue-900 text-white px-4 py-3 border-b border-gray-300">
          <h3 className="text-lg font-bold uppercase tracking-wide">System Insights & Recommendations</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-300 border-l-4 border-l-red-700 p-4">
              <h4 className="font-bold text-gray-900 mb-2 uppercase text-sm">Immediate Action Required</h4>
              <p className="text-sm text-gray-800 font-medium">Wards 45, 67, 89 exceed critical risk threshold. Recommend deployment of 3 additional pump sets.</p>
            </div>
            <div className="bg-white border border-gray-300 border-l-4 border-l-yellow-600 p-4">
              <h4 className="font-bold text-gray-900 mb-2 uppercase text-sm">Rising Trend Detected</h4>
              <p className="text-sm text-gray-800 font-medium">Rainfall intensity increasing in North Delhi. Prepare for possible escalation to high risk.</p>
            </div>
            <div className="bg-white border border-gray-300 border-l-4 border-l-green-600 p-4">
              <h4 className="font-bold text-gray-900 mb-2 uppercase text-sm">Resources Optimized</h4>
              <p className="text-sm text-gray-800 font-medium">Drain clearance completed in 8 medium-risk wards. Resources available for reallocation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
