const WardPopup = ({ wardName, wardId, rainfall, drainageDeficit, complaints, riskIndex, lastUpdated, dispatchTeamToWard, wardStatus }) => {
  // Note: This component is rendered as static HTML in popups
  // For interactive features, hooks won't work here
  const currentStatus = wardStatus?.[wardId] || 'monitoring';
  
  const getRiskColor = () => {
    if (riskIndex >= 70) return 'text-red-700';
    if (riskIndex >= 40) return 'text-orange-600';
    return 'text-green-600';
  };
  
  const getStatusBadge = () => {
    if (currentStatus === 'response-active') {
      return (
        <div className="mt-2 px-3 py-2 bg-orange-50 border border-orange-500 flex items-center gap-2">
          <span className="text-orange-800 font-bold uppercase tracking-wide text-xs">🚨 Response Active</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="text-sm min-w-[280px]">
      <div className="font-bold text-gray-900 text-lg mb-2 uppercase tracking-wide border-b border-gray-300 pb-2">
        {wardName}
        <span className="text-xs font-bold text-gray-600 ml-2 uppercase">(Ward {wardId})</span>
      </div>
      
      <div className="mt-3 space-y-2 text-gray-800 font-medium">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 uppercase text-xs font-bold">Risk Index:</span>
          <span className={`font-bold text-lg ${getRiskColor()}`}>{riskIndex}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 uppercase text-xs font-bold">Rainfall:</span>
          <span className="font-bold">{rainfall} mm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 uppercase text-xs font-bold">Drainage Deficit:</span>
          <span className="font-bold text-red-700">{drainageDeficit}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 uppercase text-xs font-bold">Complaints:</span>
          <span className="font-bold">{complaints}</span>
        </div>
      </div>
      
      {getStatusBadge()}
      
      <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-400 text-xs text-blue-900 uppercase font-semibold">
        <strong>Admin Action Required:</strong> Click ward for dispatch options in Dashboard
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-300">
        <div className="text-xs text-gray-600 font-bold uppercase">Last Updated: {lastUpdated}</div>
      </div>
    </div>
  );
};

export default WardPopup;