import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import JurisdictionModal from './JurisdictionModal';

const EmergencyOperationsDashboard = ({ onBack }) => {
  const { wards, wardStatus } = useDataContext();
  const [deployments, setDeployments] = useState({});
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [showJurisdictionModal, setShowJurisdictionModal] = useState(false);

  // Calculate high-risk wards
  const highRiskWards = wards.filter(ward => wardStatus[ward.properties?.name]?.riskLevel === 'High');

  // Resource calculations (rule-based)
  const totalPumps = 50;
  const deployedPumps = Object.values(deployments).filter(d => d.type === 'pump').length;
  const availablePumps = totalPumps - deployedPumps;
  const activeTeams = Object.values(deployments).filter(d => d.type === 'team').length;
  const avgResponseTime = Math.max(5, 25 - activeTeams * 2);

  const handleDeploy = (wardName, type) => {
    const key = `${wardName}-${type}`;
    if (deployments[key]) {
      // Remove if already deployed
      const newDeployments = { ...deployments };
      delete newDeployments[key];
      setDeployments(newDeployments);
      setConfirmMessage(`${type === 'pump' ? 'Pump' : 'Team'} recalled from ${wardName}`);
    } else {
      // Deploy
      if (type === 'pump' && availablePumps > 0) {
        setDeployments({
          ...deployments,
          [key]: { type: 'pump', timestamp: new Date() }
        });
        setConfirmMessage(`Pump deployed to ${wardName}`);
      } else if (type === 'team') {
        setDeployments({
          ...deployments,
          [key]: { type: 'team', timestamp: new Date() }
        });
        setConfirmMessage(`Response team assigned to ${wardName}`);
      }
    }

    // Clear message after 3 seconds
    setTimeout(() => setConfirmMessage(null), 3000);
  };

  const handleResolved = (wardName) => {
    // Remove all deployments for this ward
    const newDeployments = { ...deployments };
    Object.keys(newDeployments).forEach(key => {
      if (key.startsWith(wardName)) {
        delete newDeployments[key];
      }
    });
    setDeployments(newDeployments);
    setConfirmMessage(`${wardName} marked as resolved`);
    setTimeout(() => setConfirmMessage(null), 3000);
  };

  const isWardDeployed = (wardName, type) => {
    return !!deployments[`${wardName}-${type}`];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-900 border-b-4 border-blue-950 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-white uppercase tracking-wide">Emergency Operations Dashboard</h1>
            <p className="text-blue-200 mt-1 text-xs sm:text-sm font-semibold uppercase">Real-time resource allocation and response coordination</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowJurisdictionModal(true)}
              className="px-4 sm:px-6 py-2 bg-white text-blue-900 font-bold border border-gray-300 hover:bg-gray-100 transition uppercase text-xs sm:text-sm tracking-wide"
            >
              Check Jurisdiction
            </button>
            <button
              onClick={onBack}
              className="px-4 sm:px-6 py-2 bg-gray-800 text-white font-bold border border-gray-900 hover:bg-gray-900 transition uppercase text-xs sm:text-sm tracking-wide"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Jurisdiction Modal */}
      <JurisdictionModal 
        isOpen={showJurisdictionModal}
        onClose={() => setShowJurisdictionModal(false)}
      />

      {/* Confirmation Message */}
      {confirmMessage && (
        <div className="bg-green-50 border-l-4 border-green-600 border-y border-r border-gray-300 p-4 m-4">
          <p className="text-green-800 font-bold uppercase text-sm">{confirmMessage}</p>
        </div>
      )}

      {/* Alert Banner */}
      {highRiskWards.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-700 border-y border-r border-gray-300 p-4 m-4">
          <p className="text-red-800 font-bold uppercase text-sm">
            Immediate intervention required in {highRiskWards.length} ward(s)
          </p>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* SECTION 1: Resource Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-300 shadow-sm p-4 sm:p-6 border-t-4 border-t-blue-900">
            <p className="text-gray-700 text-xs font-bold uppercase tracking-wide">Pumps Available</p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-900 mt-2">{availablePumps}</p>
            <p className="text-gray-600 text-xs mt-1 font-semibold uppercase">of {totalPumps} total</p>
          </div>

          <div className="bg-white border border-gray-300 shadow-sm p-4 sm:p-6 border-t-4 border-t-orange-600">
            <p className="text-gray-700 text-xs font-bold uppercase tracking-wide">Pumps Deployed</p>
            <p className="text-3xl sm:text-4xl font-bold text-orange-700 mt-2">{deployedPumps}</p>
            <p className="text-gray-600 text-xs mt-1 font-semibold uppercase">Active deployment</p>
          </div>

          <div className="bg-white border border-gray-300 shadow-sm p-4 sm:p-6 border-t-4 border-t-green-700">
            <p className="text-gray-700 text-xs font-bold uppercase tracking-wide">Response Teams</p>
            <p className="text-3xl sm:text-4xl font-bold text-green-800 mt-2">{activeTeams}</p>
            <p className="text-gray-600 text-xs mt-1 font-semibold uppercase">Teams active</p>
          </div>

          <div className="bg-white border border-gray-300 shadow-sm p-4 sm:p-6 border-t-4 border-t-purple-700">
            <p className="text-gray-700 text-xs font-bold uppercase tracking-wide">Avg Response Time</p>
            <p className="text-3xl sm:text-4xl font-bold text-purple-800 mt-2">{avgResponseTime}m</p>
            <p className="text-gray-600 text-xs mt-1 font-semibold uppercase">Minutes to deploy</p>
          </div>
        </div>

        {/* SECTION 2: Priority Wards List */}
        {highRiskWards.length > 0 && (
          <div className="bg-white border border-gray-300 shadow-sm p-4 sm:p-6 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-300 pb-2">Priority Deployment Required</h2>
            <div className="space-y-4">
              {highRiskWards.map((ward) => {
                const wardName = ward.properties?.name;
                const status = wardStatus[wardName];
                const isPumpDeployed = isWardDeployed(wardName, 'pump');
                const isTeamDeployed = isWardDeployed(wardName, 'team');

                return (
                  <div key={wardName} className="border-l-4 border-red-700 border-y border-r border-gray-300 bg-red-50 p-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 uppercase">{wardName}</h3>
                        <p className="text-red-800 font-bold mt-1 uppercase text-sm">Risk Level: {status?.riskLevel}</p>
                        <p className="text-gray-800 mt-2 text-sm font-semibold uppercase">
                          Reason: High rainfall accumulation with inadequate drainage capacity
                        </p>
                        <p className="text-gray-700 text-xs mt-1 font-bold uppercase">
                          Suggested Action: Deploy pumps and send response team for immediate assessment
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                        <button
                          onClick={() => handleDeploy(wardName, 'pump')}
                          disabled={!isPumpDeployed && availablePumps === 0}
                          className={`px-4 py-2 border font-bold transition whitespace-nowrap uppercase text-xs tracking-wide ${
                            isPumpDeployed
                              ? 'bg-red-800 text-white border-red-900 hover:bg-red-900'
                              : availablePumps === 0
                              ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                              : 'bg-blue-900 text-white border-blue-950 hover:bg-blue-800'
                          }`}
                        >
                          {isPumpDeployed ? 'Recall Pump' : 'Deploy Pump'}
                        </button>
                        <button
                          onClick={() => handleDeploy(wardName, 'team')}
                          className={`px-4 py-2 border font-bold transition whitespace-nowrap uppercase text-xs tracking-wide ${
                            isTeamDeployed
                              ? 'bg-red-800 text-white border-red-900 hover:bg-red-900'
                              : 'bg-green-800 text-white border-green-900 hover:bg-green-900'
                          }`}
                        >
                          {isTeamDeployed ? 'Recall Team' : 'Assign Team'}
                        </button>
                        <button
                          onClick={() => handleResolved(wardName)}
                          className="px-4 py-2 bg-gray-800 text-white border border-gray-900 font-bold hover:bg-gray-900 transition whitespace-nowrap uppercase text-xs tracking-wide"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {highRiskWards.length === 0 && (
          <div className="bg-green-50 border border-green-700 p-8 text-center">
            <p className="text-green-900 font-bold text-lg uppercase tracking-wide">All wards are at acceptable risk levels</p>
            <p className="text-green-800 mt-2 font-semibold uppercase text-sm">No emergency deployment required at this time</p>
          </div>
        )}

        {/* SECTION 4: Deployment Summary */}
        {Object.keys(deployments).length > 0 && (
          <div className="bg-white border border-gray-300 shadow-sm p-4 sm:p-6 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">Active Deployments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(deployments).map(([key, deployment]) => {
                const [wardName] = key.split('-');
                return (
                  <div key={key} className="border border-gray-300 p-4 bg-gray-50 border-l-4 border-l-blue-900">
                    <p className="font-bold text-gray-900 uppercase">{wardName}</p>
                    <p className="text-xs font-bold text-gray-700 mt-1 uppercase">
                      {deployment.type === 'pump' ? 'Pump' : 'Response Team'} deployed at{' '}
                      {new Date(deployment.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyOperationsDashboard;
