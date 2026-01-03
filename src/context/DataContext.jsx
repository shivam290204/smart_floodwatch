import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchWardData, fetchHotspots, fetchDashboardData } from '../services/mcdService';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const [wards, setWards] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('Jul');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [wardStatus, setWardStatus] = useState({});
  const [originalWards, setOriginalWards] = useState([]);

  useEffect(() => {
    const load = async () => {
      const wardsData = await fetchWardData(selectedMonth);
      setOriginalWards(wardsData);
      setWards(wardsData);
      setHotspots(await fetchHotspots());
      setDashboard(await fetchDashboardData());
    };
    load();
  }, [selectedMonth]);

  // Emergency Mode: Simulate heavy rain event
  useEffect(() => {
    if (emergencyMode && originalWards.length > 0) {
      // Transform 30% of wards to High Risk (Red)
      const emergencyWards = originalWards.map((ward, index) => {
        // Make every 3rd ward high risk (approximately 30%)
        if (index % 3 === 0 && ward && ward.properties) {
          return {
            ...ward,
            properties: {
              ...ward.properties,
              rainfall: Math.min((ward.properties.rainfall || 50) * 1.8, 100),
              riskIndex: Math.min((ward.properties.riskIndex || 60) + 30, 100),
              riskCategory: 'High'
            }
          };
        }
        return ward;
      });
      setWards(emergencyWards);
    } else if (originalWards.length > 0) {
      // Restore original data when exiting emergency mode
      setWards(originalWards);
    }
  }, [emergencyMode, originalWards]);

  // Dispatch team to ward - updates ward status and modifies risk
  const dispatchTeamToWard = (wardId) => {
    setWardStatus(prev => ({
      ...prev,
      [wardId]: 'response-active'
    }));

    // Update ward appearance: reduce risk slightly (Red -> Orange)
    setWards(currentWards => 
      currentWards.map(ward => {
        if (ward && ward.properties && ward.properties.wardId === wardId) {
          return {
            ...ward,
            properties: {
              ...ward.properties,
              riskIndex: Math.max((ward.properties.riskIndex || 70) - 20, 40),
              riskCategory: ward.properties.riskIndex > 70 ? 'Medium' : ward.properties.riskCategory,
              responseActive: true
            }
          };
        }
        return ward;
      })
    );
  };

  const value = {
    wards,
    hotspots,
    dashboard,
    selectedMonth,
    setSelectedMonth,
    emergencyMode,
    setEmergencyMode,
    wardStatus,
    dispatchTeamToWard,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
