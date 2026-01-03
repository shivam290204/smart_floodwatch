import { useEffect, useState } from 'react';
import { useDataContext } from '../context/DataContext';

const EmergencyResources = ({ onNavigateToOps }) => {
  const { wards, emergencyMode, wardStatus } = useDataContext();
  const [resources, setResources] = useState({
    totalPumps: 50,
    pumpsDeployed: 0,
    pumpsAvailable: 50,
    teamsOnStandby: 12,
    teamsDeployed: 0,
    responseVehicles: 8,
    vehiclesActive: 0
  });
  const [highRiskCount, setHighRiskCount] = useState(0);

  useEffect(() => {
    // Calculate deployed resources based on ward status
    let highRisk = 0;
    let mediumRisk = 0;

    wards.forEach(ward => {
      const wardName = ward.properties?.name;
      const status = wardStatus[wardName];
      if (status?.riskLevel === 'High') {
        highRisk++;
      } else if (status?.riskLevel === 'Medium') {
        mediumRisk++;
      }
    });

    setHighRiskCount(highRisk);

    const deployed = highRisk * 4 + mediumRisk * 2;
    const teamsOut = highRisk * 2 + mediumRisk;
    const vehiclesOut = Math.min(highRisk, 8);

    setResources({
      totalPumps: emergencyMode ? 60 : 50,
      pumpsDeployed: Math.min(deployed, emergencyMode ? 60 : 50),
      pumpsAvailable: Math.max((emergencyMode ? 60 : 50) - deployed, 0),
      teamsOnStandby: emergencyMode ? 15 : 12,
      teamsDeployed: Math.min(teamsOut, emergencyMode ? 15 : 12),
      responseVehicles: emergencyMode ? 10 : 8,
      vehiclesActive: vehiclesOut
    });
  }, [wards, emergencyMode, wardStatus]);

  const ResourceCard = ({ icon, title, deployed, total, color }) => {
    const percentage = (deployed / total) * 100;
    const isHigh = percentage > 70;
    const isMedium = percentage > 40 && percentage <= 70;

    return (
      <div className={`bg-white rounded-lg shadow-lg p-4 border-l-4 ${color} hover:shadow-xl transition-shadow`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl">{icon}</span>
          <span className={`text-xs uppercase font-semibold px-2 py-1 rounded ${
            isHigh ? 'bg-red-100 text-red-700' :
            isMedium ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {isHigh ? 'CRITICAL' : isMedium ? 'ACTIVE' : 'READY'}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-1">{title}</h3>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {deployed} / {total}
        </div>
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isHigh ? 'bg-red-500' : isMedium ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600 font-medium">
          {total - deployed} available
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Emergency Resource Status</h2>
          {highRiskCount > 0 && (
            <p className="text-sm text-red-600 font-semibold mt-1">
              ⚠️ {highRiskCount} high-risk ward(s) detected
            </p>
          )}
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
          highRiskCount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {highRiskCount > 0 ? '🔴 ALERT' : '🟢 OPERATIONAL'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ResourceCard
          icon="⚙️"
          title="Water Pumps"
          deployed={resources.pumpsDeployed}
          total={resources.totalPumps}
          color="border-blue-500"
        />
        <ResourceCard
          icon="👷"
          title="Response Teams"
          deployed={resources.teamsDeployed}
          total={resources.teamsOnStandby}
          color="border-orange-500"
        />
        <ResourceCard
          icon="🚛"
          title="Emergency Vehicles"
          deployed={resources.vehiclesActive}
          total={resources.responseVehicles}
          color="border-purple-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <button
          onClick={onNavigateToOps}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Open Operations Dashboard
        </button>
        
        <button
          onClick={() => {
            alert(`Current Deployment Status:\n\n✓ ${resources.pumpsDeployed} pumps active\n✓ ${resources.teamsDeployed} teams deployed\n✓ ${resources.vehiclesActive} vehicles in field\n\nAuto-deployment triggers at Risk Index > 70\nManual control available in Operations Dashboard`);
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View Deployment Details
        </button>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 text-sm">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-yellow-800">
            <strong className="font-bold">Deployment Protocol:</strong> Resources auto-deploy when ward risk index exceeds 70. 
            Manual dispatch available via Operations Dashboard. Real-time tracking enabled.
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResources;
