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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Operations Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time resource allocation and response coordination</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowJurisdictionModal(true)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Check Jurisdiction
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 transition"
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
        <div className="bg-green-100 border-l-4 border-green-500 p-4 m-4 rounded-lg">
          <p className="text-green-800 font-medium">{confirmMessage}</p>
        </div>
      )}

      {/* Alert Banner */}
      {highRiskWards.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 m-4 rounded-lg">
          <p className="text-red-800 font-bold">
            Immediate intervention required in {highRiskWards.length} ward(s)
          </p>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        {/* SECTION 1: Resource Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <p className="text-gray-600 text-sm font-semibold uppercase">Pumps Available</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{availablePumps}</p>
            <p className="text-gray-500 text-xs mt-1">of {totalPumps} total</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
            <p className="text-gray-600 text-sm font-semibold uppercase">Pumps Deployed</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">{deployedPumps}</p>
            <p className="text-gray-500 text-xs mt-1">Active deployment</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold uppercase">Response Teams</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{activeTeams}</p>
            <p className="text-gray-500 text-xs mt-1">Teams active</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
            <p className="text-gray-600 text-sm font-semibold uppercase">Avg Response Time</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">{avgResponseTime}m</p>
            <p className="text-gray-500 text-xs mt-1">Minutes to deploy</p>
          </div>
        </div>

        {/* SECTION 2: Priority Wards List */}
        {highRiskWards.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Priority Deployment Required</h2>
            <div className="space-y-4">
              {highRiskWards.map((ward) => {
                const wardName = ward.properties?.name;
                const status = wardStatus[wardName];
                const isPumpDeployed = isWardDeployed(wardName, 'pump');
                const isTeamDeployed = isWardDeployed(wardName, 'team');

                return (
                  <div key={wardName} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{wardName}</h3>
                        <p className="text-red-700 font-semibold mt-1">Risk Level: {status?.riskLevel}</p>
                        <p className="text-gray-700 mt-2">
                          Reason: High rainfall accumulation with inadequate drainage capacity
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Suggested Action: Deploy pumps and send response team for immediate assessment
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleDeploy(wardName, 'pump')}
                          disabled={!isPumpDeployed && availablePumps === 0}
                          className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                            isPumpDeployed
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : availablePumps === 0
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isPumpDeployed ? 'Recall Pump' : 'Deploy Pump'}
                        </button>
                        <button
                          onClick={() => handleDeploy(wardName, 'team')}
                          className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                            isTeamDeployed
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {isTeamDeployed ? 'Recall Team' : 'Assign Team'}
                        </button>
                        <button
                          onClick={() => handleResolved(wardName)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition whitespace-nowrap"
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
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8 text-center">
            <p className="text-green-800 font-bold text-lg">All wards are at acceptable risk levels</p>
            <p className="text-green-700 mt-2">No emergency deployment required at this time</p>
          </div>
        )}

        {/* SECTION 4: Deployment Summary */}
        {Object.keys(deployments).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Deployments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(deployments).map(([key, deployment]) => {
                const [wardName] = key.split('-');
                return (
                  <div key={key} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <p className="font-semibold text-gray-900">{wardName}</p>
                    <p className="text-sm text-gray-600 mt-1">
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
