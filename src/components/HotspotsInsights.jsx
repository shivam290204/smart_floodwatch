import { useEffect, useState } from 'react';
import { useDataContext } from '../context/DataContext';

const HotspotsInsights = ({ onNavigateToEmergency }) => {
  const { wards, selectedMonth } = useDataContext();
  const [priorityWards, setPriorityWards] = useState([]);
  const [systemInsights, setSystemInsights] = useState([]);

  useEffect(() => {
    if (wards.length > 0) {
      // Get top 6 priority wards ranked by urgency
      const sorted = [...wards]
        .filter(w => w.properties?.riskIndex)
        .sort((a, b) => (b.properties?.riskIndex || 0) - (a.properties?.riskIndex || 0))
        .slice(0, 6)
        .map(ward => {
          const risk = ward.properties.riskIndex;
          const rainfall = ward.properties.rainfall || 0;
          const drainage = ward.properties.drainageDeficit || 0;
          
          // Generate specific reasons for each ward
          const reasons = [];
          if (rainfall > 70) reasons.push('Rainfall above normal');
          else if (rainfall > 50) reasons.push('Moderate rainfall detected');
          
          if (drainage > 50) reasons.push('Low drainage buffer');
          else if (drainage > 30) reasons.push('Drainage capacity stressed');
          
          if (risk > 80) reasons.push('Repeated past flooding');
          else if (risk > 60) reasons.push('Historical flood pattern');
          
          // If we don't have enough reasons, add generic ones
          if (reasons.length < 2) {
            reasons.push('Elevated risk conditions');
          }
          
          // Determine suggested action
          let action = '';
          if (risk >= 80) action = 'Deploy Pumps';
          else if (risk >= 60) action = 'Team on Standby';
          else action = 'Monitor Closely';
          
          return {
            ...ward,
            reasons: reasons.slice(0, 3),
            action
          };
        });
      
      setPriorityWards(sorted);

      // Generate system insights
      const highRiskCount = wards.filter(w => w.properties?.riskIndex >= 70).length;
      const mediumRiskCount = wards.filter(w => w.properties?.riskIndex >= 40 && w.properties?.riskIndex < 70).length;
      const avgRainfall = wards.reduce((sum, w) => sum + (w.properties?.rainfall || 0), 0) / wards.length;
      const deployedPumps = Math.floor(highRiskCount * 0.65); // Simulate pump utilization
      const totalPumps = 50;
      const pumpUtilization = Math.round((deployedPumps / totalPumps) * 100);
      const stableWards = wards.filter(w => w.properties?.riskIndex < 40).length;

      const insights = [];

      // Seasonal Risk
      insights.push({
        icon: '📊',
        title: 'Seasonal Risk',
        text: `${selectedMonth} historically shows elevated flood probability.`,
        color: 'bg-gray-50 border-gray-300 text-gray-900'
      });

      // Immediate Risk
      if (highRiskCount > 0) {
        insights.push({
          icon: '⚠️',
          title: 'Immediate Risk',
          text: `${highRiskCount} wards may experience water-logging within 4 hours.`,
          color: 'bg-gray-50 border-gray-300 text-gray-900'
        });
      } else {
        insights.push({
          icon: '✓',
          title: 'Immediate Risk',
          text: 'No critical wards detected. Conditions stable.',
          color: 'bg-gray-50 border-gray-300 text-gray-900'
        });
      }

      // Capacity Status
      insights.push({
        icon: '🔧',
        title: 'Capacity Status',
        text: `Pump utilization at ${pumpUtilization}%. ${pumpUtilization > 70 ? 'Limited buffer available' : 'Adequate buffer available'}.`,
        color: 'bg-gray-50 border-gray-300 text-gray-900'
      });

      // Stability Insight
      if (stableWards > wards.length * 0.6) {
        insights.push({
          icon: '📍',
          title: 'Stability Insight',
          text: 'North-West Delhi wards currently stable.',
          color: 'bg-gray-50 border-gray-300 text-gray-900'
        });
      }

      // Medium Risk Zones
      if (mediumRiskCount > 0) {
        insights.push({
          icon: '👁️',
          title: 'Monitoring Required',
          text: `${mediumRiskCount} wards in medium-risk category. Close monitoring advised.`,
          color: 'bg-gray-50 border-gray-300 text-gray-900'
        });
      }

      setSystemInsights(insights);
    }
  }, [wards, selectedMonth]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Flood-Prone Wards - REDESIGNED */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 select-none">
          <h2 className="text-xl font-bold text-gray-900 select-none">
            Top Flood-Prone Wards (Next 24 Hours)
          </h2>
          <p className="text-sm text-gray-600 mt-1 select-none">Priority ranking based on real-time risk assessment</p>
        </div>
        
        <div className="p-6 space-y-4">
          {priorityWards.map((ward, index) => {
            const risk = ward.properties?.riskIndex || 0;
            const isHighRisk = risk >= 70;
            const isMediumRisk = risk >= 40 && risk < 70;
            
            return (
              <div
                key={ward.properties?.wardId || index}
                className={`border-l-4 rounded-lg p-4 ${
                  isHighRisk 
                    ? 'bg-gray-50 border-blue-900' 
                    : isMediumRisk 
                    ? 'bg-gray-50 border-blue-700' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isHighRisk 
                        ? 'bg-blue-900 text-white' 
                        : isMediumRisk 
                        ? 'bg-blue-700 text-white' 
                        : 'bg-gray-400 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg select-none">
                        {ward.properties?.wardName || 'Unknown Ward'}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 select-none ${
                        isHighRisk 
                          ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                          : isMediumRisk 
                          ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {isHighRisk ? 'HIGH RISK' : isMediumRisk ? 'MEDIUM RISK' : 'LOW RISK'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                    ward.action === 'Deploy Pumps' 
                      ? 'bg-blue-900 text-white' 
                      : ward.action === 'Team on Standby' 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {ward.action}
                  </div>
                </div>
                
                <div className="ml-11 space-y-1">
                  {ward.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-gray-500 mt-0.5">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Insights - REDESIGNED */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 select-none">
          <h2 className="text-xl font-bold text-gray-900 select-none">
            System Insights
          </h2>
          <p className="text-sm text-gray-600 mt-1 select-none">Auto-generated operational intelligence</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemInsights.map((insight, index) => (
            <div
              key={index}
              className={`border-l-4 border-blue-900 rounded-lg p-4 bg-gray-50`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{insight.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1 text-gray-900 select-none">{insight.title}</h4>
                  <p className="text-sm leading-relaxed text-gray-700">{insight.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why This Matters - NEW SECTION */}
      <div className="bg-blue-900 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-bold text-lg mb-2">Why These Insights Matter</h3>
            <p className="text-sm leading-relaxed opacity-95">
              These insights help authorities prioritize high-risk wards, allocate emergency resources efficiently, 
              and prevent flood escalation before it occurs. The system continuously monitors risk factors and provides 
              actionable intelligence for rapid decision-making.
            </p>
          </div>
        </div>
      </div>

      {/* Action Button - NEW */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Ready to Take Action?
            </h3>
            <p className="text-sm text-gray-600">
              View deployment plan and assign resources to priority wards
            </p>
          </div>
          <button
            onClick={onNavigateToEmergency}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg shadow-md transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            View Emergency Deployment Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotspotsInsights;
