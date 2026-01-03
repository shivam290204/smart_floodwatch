import { MapContainer, TileLayer, LayersControl, GeoJSON, CircleMarker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { calculateRiskIndex, getRiskCategory, getRiskColor } from '../utils/riskCalculator';
import { fetchWardData, fetchHotspots, fetchBoundary } from '../services/mcdService';
import WardPopup from './WardPopup';
import { useDataContext } from '../context/DataContext';

const { BaseLayer, Overlay } = LayersControl;

const FloodMap = ({ onWardSelect }) => {
  const { wards: contextWards, selectedMonth, dispatchTeamToWard, wardStatus } = useDataContext();
  const [wards, setWards] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [boundary, setBoundary] = useState(null);
  const [, setSelectedLayer] = useState('risk');
  const center = [28.6139, 77.209];
  const zoom = 11;

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  useEffect(() => {
    if (contextWards.length > 0) {
      setWards(contextWards);
    }
  }, [contextWards]);

  const loadData = async () => {
    const [hotspotData, boundaryData] = await Promise.all([
      fetchHotspots(),
      fetchBoundary(),
    ]);
    setHotspots(hotspotData);
    setBoundary(boundaryData);
  };

  const wardStyle = (feature) => {
    const riskIndex = feature.properties.riskIndex || 0;
    const category = getRiskCategory(riskIndex);

    return {
      fillColor: getRiskColor(category),
      weight: 2,
      opacity: 1,
      color: '#1e40af',
      fillOpacity: 0.7,
    };
  };

  const onEachWard = (feature, layer) => {
    const wardData = feature.properties;
    const riskIndex = wardData.riskIndex || calculateRiskIndex(
      wardData.rainfall || 0,
      wardData.drainageDeficit || 0,
      wardData.complaints || 0
    );

    const popupContent = ReactDOMServer.renderToString(
      <WardPopup
        wardName={wardData.wardName}
        wardId={wardData.wardId}
        rainfall={wardData.rainfall}
        drainageDeficit={wardData.drainageDeficit}
        complaints={wardData.complaints}
        riskIndex={riskIndex}
        lastUpdated={wardData.lastUpdated}
        dispatchTeamToWard={dispatchTeamToWard}
        wardStatus={wardStatus}
      />
    );

    layer.bindPopup(popupContent);

    layer.on('click', () => {
      if (onWardSelect) {
        onWardSelect(wardData);
      }
    });

    layer.on('mouseover', () => {
      layer.setStyle({ weight: 4 });
    });
    layer.on('mouseout', () => {
      layer.setStyle({ weight: 2 });
    });
  };

  return (
    <div className="relative">
      <MapContainer center={center} zoom={zoom} className="h-[500px] w-full rounded-xl shadow-lg">
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>

          <Overlay checked name="Ward Risk" onChange={(e) => setSelectedLayer(e.name)}>
            {wards.map((ward) => (
              <GeoJSON
                key={ward.id}
                data={{
                  type: 'Feature',
                  geometry: ward.geometry,
                  properties: {
                    wardName: ward.wardName,
                    wardId: ward.wardId,
                    rainfall: ward.rainfall,
                    drainageDeficit: ward.drainageDeficit,
                    complaints: ward.complaints,
                    riskIndex: ward.riskIndex,
                    riskCategory: ward.riskCategory,
                    lastUpdated: ward.lastUpdated,
                  },
                }}
                style={wardStyle}
                onEachFeature={onEachWard}
              />
            ))}
          </Overlay>

          <Overlay name="City Boundary">
            {boundary && (
              <GeoJSON
                data={boundary}
                style={{ color: '#0f172a', weight: 2, fillOpacity: 0 }}
              />
            )}
          </Overlay>

          <Overlay name="Water-Logging Hotspots">
            {hotspots.map((hotspot) => (
              <CircleMarker
                key={hotspot.id}
                center={[hotspot.lat, hotspot.lng]}
                radius={hotspot.severity === 'high' ? 10 : hotspot.severity === 'medium' ? 7 : 5}
                pathOptions={{
                  fillColor: hotspot.severity === 'high' ? '#ef4444' :
                            hotspot.severity === 'medium' ? '#eab308' : '#22c55e',
                  color: '#000',
                  weight: 1,
                  fillOpacity: 0.8,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>Hotspot: {hotspot.location}</strong><br />
                    Severity: {hotspot.severity}<br />
                    Reports: {hotspot.reports}<br />
                    Last Incident: {new Date(hotspot.lastIncident).toLocaleDateString()}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </Overlay>

          <Overlay name="Drainage Network">
          </Overlay>
        </LayersControl>
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-[1000]">
        <h3 className="font-bold text-sm mb-2">Map Legend</h3>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-flood-green rounded-full mr-2"></div>
            <span className="text-xs">Low Risk (0-40)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-flood-yellow rounded-full mr-2"></div>
            <span className="text-xs">Medium Risk (41-70)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-flood-red rounded-full mr-2"></div>
            <span className="text-xs">High Risk (71-100)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloodMap;
