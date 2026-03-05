const colorMap = {
  red: 'bg-white border-t-4 border-t-red-700 border border-gray-300',
  yellow: 'bg-white border-t-4 border-t-yellow-500 border border-gray-300',
  blue: 'bg-white border-t-4 border-t-blue-700 border border-gray-300',
  green: 'bg-white border-t-4 border-t-green-600 border border-gray-300',
};

const getRiskTextColor = (riskLevel) => {
  switch(riskLevel) {
    case 'critical':
    case 'high':
      return 'text-red-800';
    case 'medium':
      return 'text-yellow-700';
    case 'low':
      return 'text-green-700';
    default:
      return 'text-gray-800';
  }
};

const getRainfallColor = (rainfall) => {
  if (rainfall >= 200) return 'text-red-800 font-extrabold';
  if (rainfall >= 100) return 'text-red-700 font-bold';
  if (rainfall >= 50) return 'text-yellow-700 font-semibold';
  return 'text-green-700 font-medium';
};

const RiskCard = ({ title, value, change, color = 'blue', icon, riskLevel, rainfallAmount }) => {
  const textColorClass = riskLevel ? getRiskTextColor(riskLevel) : '';
  const rainfallColorClass = rainfallAmount !== undefined ? getRainfallColor(rainfallAmount) : '';
  
  return (
    <div className={`p-3 sm:p-4 ${colorMap[color]} transition-all`}>
      <div className="flex items-start gap-1 sm:gap-2 mb-2">
        <div className="text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-700 line-clamp-2">{title}</div>
      </div>
      <div className={`text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 line-clamp-1 ${
        textColorClass || rainfallColorClass || 'text-gray-900'
      }`}>
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 font-semibold uppercase line-clamp-1">{change}</div>
      
      {riskLevel && (
        <div className="mt-2 pt-2 border-t border-gray-300">
          <div className={`text-xs font-bold uppercase tracking-wider ${
            riskLevel === 'critical' ? 'text-red-800' :
            riskLevel === 'high' ? 'text-red-700' :
            riskLevel === 'medium' ? 'text-yellow-700' : 'text-green-700'
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
