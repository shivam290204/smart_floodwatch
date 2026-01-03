import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext({});

export const MapProvider = ({ children }) => {
  const [selectedWard, setSelectedWard] = useState(null);
  const [layer, setLayer] = useState('risk');

  const value = {
    selectedWard,
    setSelectedWard,
    layer,
    setLayer,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = () => useContext(MapContext);
