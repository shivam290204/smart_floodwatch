const colorMap = {
  red: 'bg-red-50 text-red-800 border border-red-200',
  yellow: 'bg-amber-50 text-amber-800 border border-amber-200',
  blue: 'bg-gray-50 text-gray-800 border border-gray-200',
  green: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
};

const getRiskTextColor = (riskLevel) => {
  switch(riskLevel) {
    case 'critical':
    case 'high':
      return 'text-red-800';
    case 'medium':
      return 'text-amber-800';
    case 'low':
      return 'text-emerald-800';
    default:
      return 'text-gray-800';
  }
};

const getRainfallColor = (rainfall) => {
  if (rainfall >= 200) return 'text-red-800 font-extrabold';
  if (rainfall >= 100) return 'text-red-700 font-bold';
  if (rainfall >= 50) return 'text-amber-700 font-semibold';
  return 'text-emerald-700 font-medium';
};

const RiskCard = ({ title, value, change, color = 'blue', icon, riskLevel, rainfallAmount }) => {
  const textColorClass = riskLevel ? getRiskTextColor(riskLevel) : '';
  const rainfallColorClass = rainfallAmount !== undefined ? getRainfallColor(rainfallAmount) : '';
  
  return (
    <div className={`rounded-md p-2 sm:p-3 md:p-4 ${colorMap[color]} transition-all`}>
      <div className="flex items-start gap-1 sm:gap-2 mb-2">
        <span className="text-base sm:text-lg flex-shrink-0">{icon}</span>
        <div className="text-xs sm:text-sm font-bold uppercase tracking-tight text-gray-600 line-clamp-2">{title}</div>
      </div>
      <div className={`text-lg sm:text-xl md:text-2xl font-extrabold mb-1 line-clamp-1 ${
        textColorClass || rainfallColorClass || 'text-gray-900'
      }`}>
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 line-clamp-1">{change}</div>
      
      {riskLevel && (
        <div className="mt-2 pt-1 border-t border-gray-200">
          <div className={`text-xs font-bold uppercase tracking-wider ${
            riskLevel === 'critical' ? 'text-blue-900' :
            riskLevel === 'high' ? 'text-blue-900' :
            riskLevel === 'medium' ? 'text-blue-700' : 'text-gray-600'
          }`}>
            {riskLevel === 'critical' ? 'CRITICAL' :
             riskLevel === 'high' ? 'HIGH' :
             riskLevel === 'medium' ? 'MEDIUM' : 'LOW'}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskCard;
