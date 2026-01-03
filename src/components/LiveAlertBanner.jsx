import { useEffect, useState } from 'react';
import { useDataContext } from '../context/DataContext';

const LiveAlertBanner = () => {
  const { wards } = useDataContext();
  const [highRiskWards, setHighRiskWards] = useState([]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (wards.length > 0) {
      const highRisk = wards.filter(
        ward => ward.properties?.riskIndex >= 70 || ward.properties?.riskCategory === 'High'
      );
      setHighRiskWards(highRisk);
    }
  }, [wards]);

  if (highRiskWards.length === 0 || !showBanner) return null;

  return (
    <div className="bg-red-600 text-white shadow-lg animate-pulse">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl animate-bounce">🚨</span>
            <div>
              <div className="font-bold text-lg">LIVE ALERT: High Flood Risk Detected</div>
              <div className="text-sm text-red-100">
                {highRiskWards.length} ward{highRiskWards.length > 1 ? 's' : ''} under high risk: {' '}
                {highRiskWards.slice(0, 3).map(w => w.properties?.wardName).join(', ')}
                {highRiskWards.length > 3 && ` + ${highRiskWards.length - 3} more`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white hover:text-red-200 text-2xl ml-4"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAlertBanner;
