/**
 * FloodSightDemo.jsx - Integration page demonstrating SmartMap + SOSSidebar
 * Shows how to use all three features together (RiskLogic, SmartMap, SOSSidebar)
 */

import React, { useState } from 'react';
import SmartMap from './SmartMap';
import SOSSidebar from './SOSSidebar';

function FloodSightDemo() {
  const [selectedWardId, setSelectedWardId] = useState(null);

  const handleReportIncident = () => {
    alert('Opening citizen report form...\nIn production, this would open a modal or navigate to reporting page.');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Map Area - Left Side */}
      <div className="flex-1 relative">
        <SmartMap onWardSelect={setSelectedWardId} />
      </div>

      {/* SOS Sidebar - Right Side */}
      <SOSSidebar 
        selectedWardId={selectedWardId}
        onReportIncident={handleReportIncident}
      />
    </div>
  );
}

export default FloodSightDemo;
