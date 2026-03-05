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
      <div className={`bg-white border border-gray-300 p-4 border-t-4 ${color}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl text-gray-700">{icon}</span>
          <span className={`text-xs uppercase font-bold px-2 py-1 border ${
            isHigh ? 'bg-red-50 text-red-800 border-red-200' :
            isMedium ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
            'bg-green-50 text-green-800 border-green-200'
          }`}>
            {isHigh ? 'CRITICAL' : isMedium ? 'ACTIVE' : 'READY'}
          </span>
        </div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {deployed} <span className="text-lg text-gray-500 font-normal">/ {total}</span>
        </div>
        <div className="bg-gray-200 h-2 w-full border border-gray-300">
          <div
            className={`h-full ${
              isHigh ? 'bg-red-600' : isMedium ? 'bg-yellow-500' : 'bg-green-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-600 font-medium uppercase">
          {total - deployed} Available
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-300 shadow-sm">
      <div className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between border-b border-gray-300">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide">Emergency Resource Status</h2>
          {highRiskCount > 0 && (
            <p className="text-xs text-red-200 font-semibold mt-1">
              {highRiskCount} HIGH-RISK WARD(S) DETECTED
            </p>
          )}
        </div>
        <span className={`px-3 py-1 text-xs font-bold uppercase border ${
          highRiskCount > 0 ? 'bg-red-800 text-white border-red-600' : 'bg-green-800 text-white border-green-600'
        }`}>
          {highRiskCount > 0 ? 'ALERT' : 'OPERATIONAL'}
        </span>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 border border-blue-950 transition-colors flex items-center justify-center gap-2 uppercase text-sm tracking-wide"
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
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-6 border border-gray-400 transition-colors flex items-center justify-center gap-2 uppercase text-sm tracking-wide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View Deployment Details
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 p-3 text-sm flex items-start gap-3">
        <svg className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="text-yellow-900">
          <strong className="font-bold uppercase">Deployment Protocol:</strong> Resources auto-deploy when ward risk index exceeds 70. 
          Manual dispatch available via Operations Dashboard. Real-time tracking enabled.
        </div>
      </div>
      </div>
    </div>
  );
};

export default EmergencyResources;
