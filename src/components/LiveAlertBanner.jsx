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
    <div className="bg-red-800 text-white border-b-4 border-red-950">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xl font-bold bg-red-950 px-2 py-1 border border-red-700">ALERT</span>
            <div>
              <div className="font-bold text-sm uppercase tracking-wide">LIVE ALERT: High Flood Risk Detected</div>
              <div className="text-xs text-red-100 font-semibold uppercase mt-0.5">
                {highRiskWards.length} ward{highRiskWards.length > 1 ? 's' : ''} under high risk: {' '}
                {highRiskWards.slice(0, 3).map(w => w.properties?.wardName).join(', ')}
                {highRiskWards.length > 3 && ` + ${highRiskWards.length - 3} more`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white hover:text-red-200 text-xl ml-4 font-bold px-2 border border-transparent hover:border-red-400"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAlertBanner;
