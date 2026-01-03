/**
 * QUICK_START_EXAMPLES.js
 * Copy-paste examples for using RiskLogic, SmartMap, and SOSSidebar
 */

// ============================================================================
// EXAMPLE 1: Using RiskLogic Utility in Your Components
// ============================================================================

import { 
  calculateRisk, 
  getRiskColor, 
  saveReportToLocal, 
  getReportsFromLocal,
  incrementWardReportCount,
  checkRouteForFloodZones 
} from '../utils/RiskLogic';

// Calculate risk for a ward
const rainfall = 55;      // mm
const drainage = 25;      // % capacity
const reports = 2;        // number

const riskLevel = calculateRisk(rainfall, drainage, reports);
console.log(riskLevel); // Output: 'High'

// Get color for visualization
const hexColor = getRiskColor(riskLevel);
console.log(hexColor); // Output: '#ef4444' (Red)

// Save a citizen report
const newReport = {
  wardId: 'W001',
  wardName: 'Kasturba Nagar',
  description: 'Water overflowing from drains near the market',
  latitude: 28.5355,
  longitude: 77.2707
};

saveReportToLocal(newReport);

// Retrieve all reports
const allReports = getReportsFromLocal();
console.log(allReports); // Array of all submitted reports

// ============================================================================
// EXAMPLE 2: Using SmartMap in Your App
// ============================================================================

import SmartMap from '../components/SmartMap';
import { useState } from 'react';

function MyFloodApp() {
  const [selectedWardId, setSelectedWardId] = useState(null);

  return (
    <div>
      {/* Map takes full width and height */}
      <SmartMap />
      
      {/* When user clicks a ward, it's passed via callback */}
      {/* Check browser console to see ward selection */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Using SOSSidebar with SmartMap
// ============================================================================

import SOSSidebar from '../components/SOSSidebar';

function CompleteFloodSightApp() {
  const [selectedWardId, setSelectedWardId] = useState(null);

  const handleReportIncident = () => {
    // This is called when user clicks "Report Incident" button in sidebar
    console.log('User wants to report incident for ward:', selectedWardId);
    // In production: Open modal, navigate to form, etc.
  };

  return (
    <div className="flex h-screen">
      {/* Left: Interactive Map */}
      <div className="flex-1 relative">
        <SmartMap />
      </div>

      {/* Right: Emergency Contacts Sidebar */}
      <SOSSidebar 
        selectedWardId={selectedWardId}
        onReportIncident={handleReportIncident}
      />
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Advanced - Dynamic Risk Calculation
// ============================================================================

import { wardData } from '../data/wardData';

function RiskDashboard() {
  // Calculate real-time risk for all wards
  const wardsWithRisk = wardData.map(ward => ({
    ...ward,
    calculatedRisk: calculateRisk(
      ward.rainfall_mm,
      100 - ward.drainageCapacity,  // Convert to drainage percentage
      getReportsFromLocal().filter(r => r.wardId === ward.id).length
    )
  }));

  // Group by risk level
  const highRiskWards = wardsWithRisk.filter(w => w.calculatedRisk === 'High');
  const mediumRiskWards = wardsWithRisk.filter(w => w.calculatedRisk === 'Medium');
  const lowRiskWards = wardsWithRisk.filter(w => w.calculatedRisk === 'Low');

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Delhi Flood Risk Summary</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-red-900">High Risk</h3>
          <p className="text-3xl font-bold text-red-600">{highRiskWards.length}</p>
          <p className="text-sm text-red-700">wards affected</p>
        </div>
        
        <div className="bg-orange-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-orange-900">Medium Risk</h3>
          <p className="text-3xl font-bold text-orange-600">{mediumRiskWards.length}</p>
          <p className="text-sm text-orange-700">wards affected</p>
        </div>
        
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-green-900">Low Risk</h3>
          <p className="text-3xl font-bold text-green-600">{lowRiskWards.length}</p>
          <p className="text-sm text-green-700">wards safe</p>
        </div>
      </div>

      {/* List high-risk wards */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-300">
        <h3 className="font-bold text-red-900 mb-3">High Risk Wards Requiring Immediate Action</h3>
        <ul className="space-y-2">
          {highRiskWards.map(ward => (
            <li key={ward.id} className="flex justify-between text-red-800">
              <span>{ward.name}</span>
              <span className="font-bold">{ward.rainfall_mm}mm rainfall</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: localStorage Operations for Data Persistence
// ============================================================================

function ReportViewer() {
  const reports = getReportsFromLocal();

  // Filter reports by ward
  const kasturbaReports = reports.filter(r => r.wardId === 'W001');

  // Get most recent reports
  const recentReports = reports
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  // Count reports per ward
  const reportCountByWard = {};
  reports.forEach(report => {
    reportCountByWard[report.wardId] = (reportCountByWard[report.wardId] || 0) + 1;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Citizen Flood Reports</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          Total Reports: <span className="font-bold text-xl">{reports.length}</span>
        </p>
      </div>

      <h3 className="text-lg font-bold mb-3">Recent Reports</h3>
      <div className="space-y-3">
        {recentReports.map(report => (
          <div key={report.id} className="p-4 border-l-4 border-orange-500 bg-gray-50 rounded">
            <div className="flex justify-between mb-2">
              <h4 className="font-bold text-gray-900">{report.wardName}</h4>
              <span className="text-xs text-gray-600">
                {new Date(report.timestamp).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700">{report.description}</p>
          </div>
        ))}
      </div>

      {/* Clear all reports button */}
      <button 
        onClick={() => {
          if (window.confirm('Clear all stored reports?')) {
            localStorage.removeItem('floodReports');
            window.location.reload();
          }
        }}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Clear All Reports
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Ward-Specific Emergency Info Display
// ============================================================================

import { getWardById, getNearbyWards } from '../data/wardData';

function WardEmergencyPanel({ wardId }) {
  const ward = getWardById(wardId);
  
  if (!ward) return <div>Ward not found</div>;

  const nearbyWards = getNearbyWards(ward.coordinates[0], ward.coordinates[1], 3);
  const reports = getReportsFromLocal().filter(r => r.wardId === wardId);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Ward Name and Status */}
      <div className="mb-4 pb-4 border-b-2">
        <h2 className="text-2xl font-bold text-gray-900">{ward.name}</h2>
        <p className="text-sm text-gray-600 mt-1">Area: {ward.area_sqkm} sq km</p>
      </div>

      {/* MCD Helpline */}
      <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="font-bold text-red-900 mb-2">MCD Control Room</h3>
        <p className="text-2xl font-bold text-red-600 mb-3">{ward.helplineNumber}</p>
        <button 
          onClick={() => window.location.href = `tel:${ward.helplineNumber.replace(/-/g, '')}`}
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
        >
          📞 Call Now
        </button>
      </div>

      {/* Hospital */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-bold text-green-900 mb-2">Nearest Hospital</h3>
        <p className="font-bold text-green-600 mb-1">{ward.nearestHospital}</p>
        <p className="text-sm text-gray-600 mb-3">Phone: {ward.hospitalPhone}</p>
        <button 
          onClick={() => window.location.href = `tel:${ward.hospitalPhone.replace(/-/g, '')}`}
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
        >
          📞 Call Hospital
        </button>
      </div>

      {/* Citizen Reports */}
      {reports.length > 0 && (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-900 mb-2">
            Recent Reports ({reports.length})
          </h3>
          {reports.slice(0, 3).map(report => (
            <p key={report.id} className="text-sm text-yellow-800 mb-1">
              • {report.description}
            </p>
          ))}
        </div>
      )}

      {/* Nearby Wards */}
      <div className="mt-6 pt-6 border-t-2">
        <h3 className="font-bold text-gray-900 mb-3">Nearby Wards</h3>
        <div className="space-y-2">
          {nearbyWards.map(nearbyWard => (
            <div key={nearbyWard.id} className="flex justify-between text-sm text-gray-700">
              <span>{nearbyWard.name}</span>
              <span className={`font-bold ${
                nearbyWard.riskLevel === 'High' ? 'text-red-600' :
                nearbyWard.riskLevel === 'Medium' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {nearbyWard.riskLevel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Integrating into React Router
// ============================================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Flood dashboard with map and sidebar */}
        <Route path="/flood-dashboard" element={<CompleteFloodSightApp />} />
        
        {/* Risk summary dashboard */}
        <Route path="/risk-summary" element={<RiskDashboard />} />
        
        {/* Citizen reports viewer */}
        <Route path="/reports" element={<ReportViewer />} />
        
        {/* Ward-specific emergency info */}
        <Route path="/ward/:wardId" element={
          <WardEmergencyPanel wardId={/* extract from URL */} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// ============================================================================
// END OF EXAMPLES
// ============================================================================
