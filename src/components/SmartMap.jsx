/**
 * SmartMap.jsx - Enhanced Leaflet map with citizen reporting and safe route planning
 * Features: Ward polygons, flood reporting, localStorage persistence, route safety warnings
 */

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import { wardData } from '../data/wardData';
import { 
  calculateRisk, 
  getRiskColor, 
  saveReportToLocal, 
  getWardReports,
  checkRouteForFloodZones,
  incrementWardReportCount 
} from '../utils/RiskLogic';

// Delete default icon markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function SmartMap() {
  const [selectedWard, setSelectedWard] = useState(null);
  const [reports, setReports] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportText, setReportText] = useState('');
  const [routeMode, setRouteMode] = useState(false);
  const [routeWarning, setRouteWarning] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);

  // Load reports from localStorage on mount
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('floodReports') || '[]');
    setReports(savedReports);
  }, []);

  // Convert ward data to GeoJSON FeatureCollection
  useEffect(() => {
    const features = wardData.map(ward => ({
      type: 'Feature',
      properties: {
        id: ward.id,
        name: ward.name,
        riskLevel: calculateRisk(ward.rainfall_mm, 100 - ward.drainageCapacity, getWardReports(ward.id).length),
        rainfall: ward.rainfall_mm,
        drainage: ward.drainageCapacity,
        reportCount: getWardReports(ward.id).length
      },
      geometry: ward.geometry
    }));

    setGeoJsonData({
      type: 'FeatureCollection',
      features
    });
  }, [reports]);

  const handleWardClick = (wardId) => {
    const ward = wardData.find(w => w.id === wardId);
    if (ward) {
      setSelectedWard(ward);
      setShowReportForm(false);
    }
  };

  const handleSubmitReport = () => {
    if (!reportText.trim() || !selectedWard) return;

    const report = {
      wardId: selectedWard.id,
      wardName: selectedWard.name,
      description: reportText,
      latitude: selectedWard.coordinates[0],
      longitude: selectedWard.coordinates[1]
    };

    saveReportToLocal(report);
    const savedReports = JSON.parse(localStorage.getItem('floodReports') || '[]');
    setReports(savedReports);

    // Change ward color to Red (High Risk) immediately
    setSelectedWard(prev => ({
      ...prev,
      riskLevel: 'High'
    }));

    setReportText('');
    setShowReportForm(false);

    // Toast notification
    showToast(`✓ Report submitted for ${selectedWard.name}`);
  };

  const handleRouteCheck = () => {
    if (!routeMode) {
      setRouteMode(true);
      setRouteWarning(null);
      // Simulate route calculation
      setTimeout(() => {
        const highRiskZones = wardData.filter(w => 
          calculateRisk(w.rainfall_mm, 100 - w.drainageCapacity) === 'High'
        );
        
        // Simulate a route passing through some wards
        if (highRiskZones.length > 0) {
          setRouteWarning({
            message: `⚠️ Caution: Route enters ${highRiskZones.length} flood zone(s)`,
            zones: highRiskZones
          });
        }
      }, 1500);
    } else {
      setRouteMode(false);
      setRouteWarning(null);
    }
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Map Container */}
      <MapContainer 
        center={[28.7041, 77.1025]} 
        zoom={11} 
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Render Ward Polygons */}
        {geoJsonData && (
          <GeoJSON 
            data={geoJsonData}
            style={(feature) => ({
              fillColor: getRiskColor(feature.properties.riskLevel),
              weight: 2,
              opacity: 0.8,
              color: '#333',
              dashArray: '3',
              fillOpacity: 0.6
            })}
            onEachFeature={(feature, layer) => {
              const wardId = feature.properties.id;
              layer.on('click', () => handleWardClick(wardId));

              // Popup content
              const popupContent = `
                <div class="p-3 w-48">
                  <h4 class="font-bold text-sm mb-2">${feature.properties.name}</h4>
                  <div class="text-xs space-y-1">
                    <p><strong>Risk Level:</strong> <span class="font-bold">${feature.properties.riskLevel}</span></p>
                    <p><strong>Rainfall:</strong> ${feature.properties.rainfall}mm</p>
                    <p><strong>Drainage:</strong> ${feature.properties.drainage}%</p>
                    <p><strong>Reports:</strong> ${feature.properties.reportCount}</p>
                  </div>
                </div>
              `;

              layer.bindPopup(popupContent);
            }}
          />
        )}
      </MapContainer>

      {/* Control Panel - Top Right */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm z-40">
        <h3 className="text-lg font-bold text-gray-800 mb-4">SmartMap Controls</h3>

        {/* Route Safety Toggle */}
        <div className="mb-4 p-3 border rounded-lg border-blue-200 bg-blue-50">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={routeMode}
              onChange={handleRouteCheck}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Safe Route Mode</span>
          </label>
          <p className="text-xs text-gray-600 mt-2">Enable to check route for flood zones</p>
        </div>

        {/* Route Warning Toast */}
        {routeWarning && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-800 font-bold text-sm">{routeWarning.message}</p>
            <div className="mt-2 text-xs">
              {routeWarning.zones.map(zone => (
                <p key={zone.id} className="text-red-700">• {zone.name}</p>
              ))}
            </div>
          </div>
        )}

        {/* Ward Info Panel */}
        {selectedWard && (
          <div className="mb-4 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300">
            <h4 className="font-bold text-gray-800 mb-2">{selectedWard.name}</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Risk:</strong> <span className={`font-bold ${
                selectedWard.riskLevel === 'High' ? 'text-red-600' :
                selectedWard.riskLevel === 'Medium' ? 'text-orange-600' : 'text-green-600'
              }`}>{selectedWard.riskLevel}</span></p>
              <p><strong>Rainfall:</strong> {selectedWard.rainfall_mm}mm</p>
              <p><strong>Area:</strong> {selectedWard.area_sqkm} sq km</p>
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded font-medium text-sm transition"
              >
                📍 Report Flood
              </button>
            </div>
          </div>
        )}

        {/* Report Form */}
        {showReportForm && selectedWard && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-300">
            <h5 className="font-bold text-gray-800 mb-2">Report Flood in {selectedWard.name}</h5>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe the flooding situation..."
              className="w-full h-20 p-2 text-sm border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmitReport}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded font-medium text-sm transition"
              >
                Submit Report
              </button>
              <button
                onClick={() => setShowReportForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-3 rounded font-medium text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend - Bottom Left */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-4 z-40">
        <h4 className="font-bold text-gray-800 mb-3 text-sm">Risk Levels</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-sm border border-gray-400"></div>
            <span className="text-sm text-gray-700 font-medium">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-sm border border-gray-400"></div>
            <span className="text-sm text-gray-700 font-medium">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-sm border border-gray-400"></div>
            <span className="text-sm text-gray-700 font-medium">Low Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartMap;
